import { HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { IExportDataProvider } from '../../interfaces/export-data-provider.interface';

import { IExportService } from '../../interfaces/export-service.interface';
import { ServiceResponse } from '../../interfaces/service-response.interface';
import { Util } from '../../util/util';
import { OntimizeExportDataProviderService } from '../ontimize-export-data-provider.service';
import { OntimizeBaseService } from './ontimize-base-service.class';
import { HttpRequestOptions } from '../../types/http-request-options.type';

@Injectable()
export class OntimizeExportService extends OntimizeBaseService implements IExportService {

  public exportPath: string;
  public downloadPath: string;
  public servicePath: string;
  public exportDataProvider: IExportDataProvider;

  constructor(protected injector: Injector) {
    super(injector);
    this.exportDataProvider = this.injector.get<OntimizeExportDataProviderService>(OntimizeExportDataProviderService);
  }

  public configureService(config: any): void {
    super.configureService(config);
    if (config.exportPath) {
      this.exportPath = config.exportPath;
    }
    if (config.downloadPath) {
      this.downloadPath = config.downloadPath;
    }
    if (config.path) {
      this.servicePath = config.path;
    }
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
    const entity = this.exportDataProvider.entity;
    const url = `${this.urlBase}${this.exportPath ? this.exportPath : ''}${this.servicePath}/${entity}/${format}`;

    const options: HttpRequestOptions = {
      headers: this.buildHeaders().append('Content-Type', 'application/json;charset=UTF-8'),
      observe: 'response'
    };

    const exportData = this.exportDataProvider.getExportConfiguration();
    const body = JSON.stringify(exportData);
    // TODO: try multipart
    const dataObservable: Observable<ServiceResponse> = new Observable((observer: Subscriber<ServiceResponse>) => {
      this.httpClient.post<ServiceResponse>(url, body, options).pipe(
        map((resData: any) => this.adapter.adapt(resData))
      ).subscribe(resp => {
        this.parseSuccessfulExportDataResponse(format, resp, observer);
      }, error => {
        this.parseUnsuccessfulResponse(error, observer);
      });
    });
    return dataObservable.pipe(share());
  }

  protected parseSuccessfulExportDataResponse(format: string, resp: ServiceResponse, subscriber: Subscriber<ServiceResponse>) {
    if (resp && resp.isUnauthorized()) {
      this.clientErrorFallback(401);
    } else if (resp && resp.isFailed()) {
      subscriber.error(resp.message);
    } else if (resp && resp.isSuccessful()) {
      this.downloadFile(resp.data[0][format + 'Id'], format)
        .subscribe(
          r => subscriber.next(r),
          e => subscriber.error(e),
          () => subscriber.complete()
        );
    } else {
      // Unknow state -> error
      subscriber.error('Service unavailable');
    }

  }

  public downloadFile(fileId: string, fileExtension: string): Observable<any> {
    const url = `${this.urlBase}${this.downloadPath ? this.downloadPath : ''}${this.servicePath}/${fileExtension}/${fileId}`;

    const options: any = {
      headers: this.buildHeaders(),
      observe: 'response',
      responseType: 'blob'
    };

    const dataObservable = new Observable(observer => {
      // .map((res: any) => new Blob([res.blob()], { type: responseType }))
      this.httpClient.get(url, options).subscribe(
        (resp: any) => {
          const fileData = resp.body;
          const fileURL = URL.createObjectURL(fileData);
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.href = fileURL;
          a.download = fileId + '.' + fileExtension;
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