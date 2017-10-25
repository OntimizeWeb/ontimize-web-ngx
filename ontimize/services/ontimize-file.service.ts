import { Injector, Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { LoginService } from '../services';
import {
  AppConfig,
  Config
} from '../config/app-config';

@Injectable()
export class OntimizeFileService {

  public path: string = '';

  protected http: Http;
  protected _sessionid: string;
  protected _urlBase: string;
  protected _appConfig: Config;
  protected _config: AppConfig;

  constructor(protected injector: Injector) {
    this.http = this.injector.get(Http);
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

  public upload(files: File[], entity: string): Observable<any> {
    var url = this._urlBase + this.path + '/' + entity;

    const formData = new FormData();
    files.forEach(file => {
      formData.append('name', file.name);
      formData.append('file', file);
    });

    var headers: Headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    let authorizationToken = 'Bearer ' + this._sessionid;
    headers.append('Authorization', authorizationToken);

    let _innerObserver: any;
    let dataObservable = new Observable(observer =>
      _innerObserver = observer).share();

    var self = this;
    this.http
      .post(url, formData, { headers: headers })
      .map(response => response.json())
      .subscribe(resp => {
        if (resp && resp.code === 3) {
          self.redirectLogin(true);
        } else if (resp.code === 1) {
          _innerObserver.error(resp.message);
        } else if (resp.code === 0) {
          _innerObserver.next(resp);
        } else {
          //Unknow state -> error
          _innerObserver.error('Service unavailable');
        }
      }, error => {
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
