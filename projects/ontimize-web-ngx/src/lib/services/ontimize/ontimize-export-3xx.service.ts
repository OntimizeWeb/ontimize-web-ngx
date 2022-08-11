import { HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { AppConfig } from '../../config/app-config';
import { IExportService } from '../../interfaces/export-service.interface';
import { HttpRequestOptions } from '../../types';
import { Util } from '../../util';
import { OntimizeExportDataProviderService } from '../ontimize-export-data-provider.service';
import { OntimizeBaseService } from './ontimize-base-service.class';

@Injectable()
export class OntimizeExportService3X extends OntimizeBaseService implements IExportService {

  public exportPath: string;
  public servicePath: string;
  protected exportDataProvider: OntimizeExportDataProviderService;

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
    let headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    const sessionId = this.authService.getSessionInfo().id;
    if (Util.isDefined(sessionId)) {
      headers = headers.append('Authorization', 'Bearer ' + sessionId);
    }
    return headers;
  }

  public exportData(format: string): Observable<any> {

    const url = `${this.urlBase}${this.exportPath}/${format}`;

    const options: HttpRequestOptions = {
      headers: this.buildHeaders().append('Content-Type', 'application/json;charset=UTF-8'),
      observe: 'response',
      responseType: 'blob'
    };


    const body = JSON.stringify(this.exportDataProvider.getExportConfiguration(this.servicePath));

    const dataObservable = new Observable(observer => {
      this.httpClient.post(url, body, options).subscribe(
        (resp: any) => {
          const fileData = resp.body;
          const contentDisposition = resp.headers.get('content-disposition');
          let fileName = 'file.' + format;
          const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const matches = fileNameRegex.exec(contentDisposition);
          if (matches != null && matches[1]) {
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
        }, error => observer.error(error),
        () => observer.complete()
      );
    });
    return dataObservable.pipe(share());
  }

}
