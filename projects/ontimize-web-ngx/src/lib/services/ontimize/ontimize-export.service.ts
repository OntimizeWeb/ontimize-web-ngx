import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';

import { ServiceResponse } from '../../interfaces/service-response.interface';
import { OntimizeBaseService } from './ontimize-base-service.class';

@Injectable()
export class OntimizeExportService extends OntimizeBaseService {

  public exportPath: string;
  public downloadPath: string;
  public servicePath: string;

  protected exportAll: boolean = false;

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

  public exportData(data: any, format: string, entity?: string): Observable<ServiceResponse> {
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
      options: options
    });
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
      this.httpClient.get(url, options).subscribe((resp: any) => {
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
        () => observer.complete());
    });
    return dataObservable.pipe(share());
  }

  protected buildHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      Authorization: 'Bearer ' + this._sessionid
    });
  }

}
