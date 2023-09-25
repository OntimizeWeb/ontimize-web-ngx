import { HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';

import { IFileService } from '../../interfaces/file-service.interface';
import { Util } from '../../util/util';
import { OntimizeBaseService } from './ontimize-base-service.class';

@Injectable()
export class OntimizeFileService extends OntimizeBaseService implements IFileService {

  public path: string = '';

  public configureService(config: any): void {
    super.configureService(config);
    this.path = config.path;
  }

  /**
   * Sends file/s upload request/s
   *
   * @param files the array of files to upload
   * @param entity the entity
   */
  public upload(files: any[], entity: string, data?: object): Observable<any> {

    const dataObservable = new Observable(observer => {

      const url = `${this.urlBase}${this.path}/${entity}`;

      const toUpload: any = new FormData();
      files.forEach(item => {
        item.prepareToUpload();
        item.isUploading = true;
        toUpload.append('name', item.name);
        toUpload.append('file', item.file);
      });

      if (data) {
        toUpload.append('data', JSON.stringify(data));
      }

      const request = new HttpRequest('POST', url, toUpload, {
        headers: this.buildHeaders(),
        reportProgress: true
      });

      this.httpClient.request(request).subscribe(resp => {
        if (HttpEventType.UploadProgress === resp.type) {
          // Upload progress event received
          const progressData = {
            loaded: resp.loaded,
            total: resp.total
          };
          observer.next(progressData);
        } else if (HttpEventType.Response === resp.type) {
          // Full response received
          if (resp.body) {
            if (resp.body['code'] === 3) {
              this.authService.logout();
            } else if (resp.body['code'] === 1) {
              observer.error(resp.body['message']);
            } else if (resp.body['code'] === 0) {
              // RESPONSE
              observer.next(resp.body);
            } else {
              // Unknow state -> error
              observer.error('Service unavailable');
            }
          } else {
            observer.next(resp.body);
          }
        }
      }, error => {
        console.error(error);
        if (error.status === 401) {
          this.authService.logout();
        } else {
          observer.error(error);
        }
      },
        () => observer.complete());
    });
    return dataObservable.pipe(share());
  }

  protected buildHeaders(): HttpHeaders {
    let headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    const sessionId = this.authService.getSessionInfo().id;
    if (Util.isDefined(sessionId)) {
      headers = headers.append('Authorization', 'Bearer ' + sessionId);
    }
    return headers;
  }

}
