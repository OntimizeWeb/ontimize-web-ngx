import { HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { AppConfig } from '../../config/app-config';
import { IExportDataProvider } from '../../interfaces/export-data-provider.interface';
import { IExportService } from '../../interfaces/export-service.interface';
import { OntimizeExportDataProviderService } from '../ontimize-export-data-provider.service';
import { OntimizeBaseService } from './ontimize-base-service.class';
import { Util } from '../../util/util';
import { HttpRequestOptions } from '../../types/http-request-options.type';

@Injectable()
export class OntimizeExportService3X extends OntimizeBaseService implements IExportService {

  public exportPath: string;
  public servicePath: string;
  protected exportDataProvider: IExportDataProvider;

  constructor(protected injector: Injector) {
    super(injector);
    this.exportPath = this.injector.get<AppConfig>(AppConfig).getExportPath();
    this.exportDataProvider = this.injector.get<OntimizeExportDataProviderService>(OntimizeExportDataProviderService);
  }

  public configureService(config: any): void {
    super.configureService(config);
    this.servicePath = config.path;
  }

  protected buildHeaders(): HttpHeaders {
    let headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'X-Requested-With,content-type' });
    const sessionId = this.authService.getSessionInfo().id;
    if (Util.isDefined(sessionId)) {
      headers = headers.append('Authorization', 'Bearer ' + sessionId);
    }
    return headers;
  }

  public exportData(format: string, columns?: string[], landscape?: Boolean, filename?: string): Observable<any> {

    const url = `${this.urlBase}${this.exportPath}/${format}`;

    const options: HttpRequestOptions = {
      headers: this.buildHeaders().append('Content-Type', 'application/json;charset=UTF-8'),
      observe: 'response',
      responseType: 'blob'
    };

    let paramExport = {
      format: format,
      path: this.servicePath,
      columns: columns,
      landscape: landscape
    };

    let exportData: any = this.exportDataProvider.getExportConfiguration(paramExport);

    const body = JSON.stringify(exportData);

    const dataObservable = new Observable(observer => {
      this.httpClient.post(url, body, options).subscribe(
        (resp: any) => {
          const fileData = resp.body;
          const contentDisposition = resp.headers.get('content-disposition');
          let fileName = filename && filename.trim() !== '' ? filename + '.' + format : 'file.' + format;

          const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const matches = fileNameRegex.exec(contentDisposition);
          if (!filename && matches != null && matches[1]) {
            fileName = matches[1].replace(/['"]/g, '');
          }

          const fileURL = URL.createObjectURL(fileData);
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.href = fileURL;
          a.download = fileName;
          a.click();
          document.body.removeChild(a);
          observer.next(fileData);
          URL.revokeObjectURL(fileURL);
        },
        error => observer.error(error),
        () => observer.complete()
      );
    });

    return dataObservable.pipe(share());
  }
}
