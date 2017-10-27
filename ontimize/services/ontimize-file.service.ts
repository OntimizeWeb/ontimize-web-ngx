import { Injector, Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { LoginService } from '../services';
import { AppConfig, Config } from '../config/app-config';

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
    servConfig['session'] = loginService.getSessionInfo();
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
   * @param files
   * @param entity the entity
   */
  public upload(files, entity: string): Observable<any> {
    var url = this._urlBase + this.path + '/' + entity;

    let authorizationToken = 'Bearer ' + this._sessionid;
    let headers: HttpHeaders = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Authorization': authorizationToken
    });

    let _innerObserver: any;
    let dataObservable = new Observable(observer => _innerObserver = observer).share();

    const request = new HttpRequest('POST', url, files, {
      headers: headers,
      reportProgress: true
    });

    var self = this;
    this.httpClient
      .request(request)
      .subscribe(resp => {
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
        console.log(error);
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
    router.navigate(['/login'], {
      queryParams: { 'isdetail': 'true' }
    });
  }

  protected isNullOrUndef(arg: any): boolean {
    if (arg === null || arg === undefined) {
      return true;
    }
    return false;
  }

}
