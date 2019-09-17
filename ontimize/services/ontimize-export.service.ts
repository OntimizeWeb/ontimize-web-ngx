import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { AppConfig, Config } from '../config/app-config';
import { LoginService } from '../services';
import { Codes, ServiceUtils } from '../utils';

export const EXPORT_PATH_DEFAULT: string = '/export';
export const DOWNLOAD_PATH_DEFAULT: string = EXPORT_PATH_DEFAULT + '/download';

export class OExportExtension {
  public static Excel: string = 'xlsx';
  public static HTML: string = 'html';
  public static PDF: string = 'pdf';
}

@Injectable()
export class OntimizeExportService {

  public EXPORT_PATH_DEFAULT: string = EXPORT_PATH_DEFAULT;
  public DOWNLOAD_PATH_DEFAULT: string = DOWNLOAD_PATH_DEFAULT;

  public exportPath: string = EXPORT_PATH_DEFAULT;
  public downloadPath: string = DOWNLOAD_PATH_DEFAULT;

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

  public getDefaultServiceConfiguration(serviceName?: string): Object {
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
    const url = this._urlBase + this.exportPath + '/' + format;
    const options = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': 'Bearer ' + this._sessionid
      })
    };
    const body = JSON.stringify(data);
    let _innerObserver: any;
    const dataObservable = new Observable(observer => _innerObserver = observer).pipe(share());

    const self = this;
    // TODO: try multipart
    this.httpClient.post(url, body, options).subscribe((resp: any) => {
      if (resp && resp.code === Codes.ONTIMIZE_UNAUTHORIZED_CODE) {
        self.redirectLogin(true);
      } else if (resp.code === Codes.ONTIMIZE_FAILED_CODE) {
        _innerObserver.error(resp.message);
      } else if (resp.code === Codes.ONTIMIZE_SUCCESSFUL_CODE) {
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
    const url = this._urlBase + this.downloadPath + '/' + fileExtension + '/' + fileId;

    let _innerObserver: any;
    const dataObservable = new Observable(observer => _innerObserver = observer).pipe(share());
    // let responseType: string;
    // if (OExportExtension.Excel === fileExtension) {
    //   responseType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    // } else if (OExportExtension.HTML === fileExtension) {
    //   responseType = 'text/html';
    // } else if (OExportExtension.PDF === fileExtension) {
    //   responseType = 'application/pdf';
    // }
    const options: any = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + this._sessionid
      }),
      'observe': 'response',
      'responseType': 'blob'
    };
    // .map((res: any) => new Blob([res.blob()], { type: responseType }))
    this.httpClient.get(url, options).subscribe((resp: any) => {
      let fileData = resp.body;
      let fileURL = URL.createObjectURL(fileData);
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.href = fileURL;
      a.download = fileId + '.' + fileExtension;
      a.click();
      document.body.removeChild(a);
      _innerObserver.next(fileData);
      URL.revokeObjectURL(fileURL);
    }, error => _innerObserver.error(error),
      () => _innerObserver.complete());

    return dataObservable;
  }

  protected redirectLogin(sessionExpired: boolean = false): void {
    let router = this.injector.get(Router);
    const loginService = this.injector.get(LoginService);
    if (sessionExpired) {
      loginService.sessionExpired();
    }
    ServiceUtils.redirectLogin(router, sessionExpired);
  }

}
