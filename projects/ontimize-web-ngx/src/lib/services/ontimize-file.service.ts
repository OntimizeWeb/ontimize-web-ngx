import { HttpClient, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { AppConfig, Config } from '../config/app-config';
import { LoginService } from '../services';
import { Codes, ServiceUtils } from '../utils';

@Injectable()
export class OntimizeFileService {

  public path: string = '';

  protected httpClient: HttpClient;
  protected _sessionid: string;
  protected _urlBase: string;
  protected _appConfig: Config;
  protected _config: AppConfig;

  constructor(protected injector: Injector) {
    this.httpClient = this.injector.get(HttpClient);
    this._config = this.injector.get(AppConfig);
    this._appConfig = this._config.getConfiguration();
  }

  public getDefaultServiceConfiguration(serviceName?: string) {
    let loginService: LoginService = this.injector.get(LoginService);
    let configuration = this._config.getServiceConfiguration();

    let servConfig = {};
    if (serviceName && configuration.hasOwnProperty(serviceName)) {
      servConfig = configuration[serviceName];
    }
    servConfig[Codes.SESSION_KEY] = loginService.getSessionInfo();
    return servConfig;
  }

  public configureService(config: any): void {
    this._urlBase = config.urlBase ? config.urlBase : this._appConfig['apiEndpoint'];
    this._sessionid = config.session ? config.session.id : -1;
    this.path = config.path;
  }

  public get urlBase(): string {
    return this._urlBase;
  }

  public set urlBase(value: string) {
    this._urlBase = value;
  }

  /**
   * Sends file/s upload request/s
   *
   * @param files the array of files to upload
   * @param entity the entity
   */
  public upload(files: any[], entity: string, data?: Object): Observable<any> {
    const url = this._urlBase + this.path + '/' + entity;

    const headers: HttpHeaders = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + this._sessionid
    });

    let _innerObserver: any;
    const dataObservable = new Observable(observer => _innerObserver = observer).pipe(share());

    let toUpload: any = new FormData();
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
      headers: headers,
      reportProgress: true
    });

    const self = this;
    this.httpClient.request(request).subscribe(resp => {
      if (HttpEventType.UploadProgress === resp.type) {
        // Upload progress event received
        let progressData = {
          loaded: resp.loaded,
          total: resp.total
        };
        _innerObserver.next(progressData);
      } else if (HttpEventType.Response === resp.type) {
        // Full response received
        if (resp.body) {
          if (resp.body['code'] === 3) {
            self.redirectLogin(true);
          } else if (resp.body['code'] === 1) {
            _innerObserver.error(resp.body['message']);
          } else if (resp.body['code'] === 0) {
            // RESPONSE
            _innerObserver.next(resp.body);
          } else {
            // Unknow state -> error
            _innerObserver.error('Service unavailable');
          }
        } else {
          _innerObserver.next(resp.body);
        }
      }
    }, error => {
      console.error(error);
      if (error.status === 401) {
        self.redirectLogin(true);
      } else {
        _innerObserver.error(error);
      }
    },
      () => _innerObserver.complete());

    return dataObservable;
  }

  protected redirectLogin(sessionExpired: boolean = false) {
    let router = this.injector.get(Router);
    const loginService = this.injector.get(LoginService);
    if (sessionExpired) {
      loginService.sessionExpired();
    }
    ServiceUtils.redirectLogin(router, sessionExpired);
  }

}
