import { HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { share } from 'rxjs/operators';

import { IExportService } from '../../interfaces/export-service.interface';
import { ServiceResponse } from '../../interfaces/service-response.interface';
import { OntimizeBaseService } from './ontimize-base-service.class';

@Injectable()
export class OntimizeExportService extends OntimizeBaseService implements IExportService {

  public exportPath: string;
  public downloadPath: string;
  public servicePath: string;

  protected _sessionid: string;
  protected exportAll: boolean = false;

  constructor(protected injector: Injector) {
    super(injector);
  }

  public configureService(config: any, modeAll = false): void {
    super.configureService(config);
    this.exportAll = modeAll;
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
    return new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      Authorization: 'Bearer ' + this._sessionid
    });
  }

  public exportData(data: any, format: string, entity?: string): Observable<any> {
    const url = `${this.urlBase}${this.exportPath ? this.exportPath : ''}${this.servicePath}/${entity}/${format}`;

    const options = {
      headers: this.buildHeaders().append('Content-Type', 'application/json;charset=UTF-8')
    };

    const body = JSON.stringify(data);
    // TODO: try multipart

    return this.doRequest({
      method: 'POST',
      url: url,
      body: body,
      options: options,
      successCallback: (resp, subscriber) => {
        this.parseSuccessfulExportDataResponse(format, resp, subscriber);
      }
    });
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
