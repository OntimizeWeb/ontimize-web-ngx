import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { LoginService } from '../services';
import { AppConfig, Config } from '../config/app-config';

export const EXPORT_PATH_DEFAULT: string = '/export';
export const DOWNLOAD_PATH_DEFAULT: string = EXPORT_PATH_DEFAULT + '/download';

export class OExportExtension {
  public static Excel: string = 'xlsx';
}

@Injectable()
export class OntimizeExportService {

  public EXPORT_PATH_DEFAULT: string = EXPORT_PATH_DEFAULT;
  public DOWNLOAD_PATH_DEFAULT: string = DOWNLOAD_PATH_DEFAULT;

  public exportPath: string = EXPORT_PATH_DEFAULT;
  public downloadPath: string = DOWNLOAD_PATH_DEFAULT;

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

  public getDefaultServiceConfiguration(serviceName?: string): Object {
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
    if (config.exportPath) {
      this.exportPath = config.exportPath;
    }
    if (config.downloadPath) {
      this.downloadPath = config.downloadPath;
    }
  }

  public get urlBase(): string {
    return this._urlBase;
  }

  public set urlBase(value: string) {
    this._urlBase = value;
  }

  public exportData(data: any, format: string): Observable<any> {
    var url = this._urlBase + this.exportPath + '/' + format;

    var headers: Headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json;charset=UTF-8');

    let authorizationToken = 'Bearer ' + this._sessionid;
    headers.append('Authorization', authorizationToken);

    var body = JSON.stringify(data);

    let _innerObserver: any;
    let dataObservable = new Observable(observer => _innerObserver = observer).share();

    var self = this;
    // TODO: try multipart
    this.http
      .post(url, body, { headers: headers })
      .map(response => response.json())
      .subscribe(resp => {
        if (resp && resp.code === 3) {
          self.redirectLogin(true);
        } else if (resp.code === 1) {
          _innerObserver.error(resp.message);
        } else if (resp.code === 0) {
          _innerObserver.next(resp);
        } else {
          // Unknow state -> error
          _innerObserver.error('Service unavailable');
        }
      }, error => _innerObserver.error(error),
      () => _innerObserver.complete());

    return dataObservable;
  }

  public downloadFile(fileId: string, fileExtension: string): Observable<any> {
    var url = this._urlBase + this.downloadPath + '/' + fileExtension + '/' + fileId;

    var headers: Headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');

    let authorizationToken = 'Bearer ' + this._sessionid;
    headers.append('Authorization', authorizationToken);

    let _innerObserver: any;
    let dataObservable = new Observable(observer => _innerObserver = observer).share();

    this.http.get(url, {
      headers: headers,
      responseType: ResponseContentType.Blob
    })
      .map(res => new Blob([res.blob()], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
      .subscribe(resp => {
        let fileURL = URL.createObjectURL(resp);
        window.open(fileURL, '_self');
        _innerObserver.next(resp);
      }, error => _innerObserver.error(error),
      () => _innerObserver.complete());

    return dataObservable;
  }

  protected redirectLogin(sessionExpired: boolean = false): void {
    let router = this.injector.get(Router);
    router.navigate(['/login'], {
      queryParams: { 'isdetail': 'true' }
    });
  }

}
