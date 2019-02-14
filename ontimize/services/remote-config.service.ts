import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscriber } from 'rxjs';

import { ServiceUtils } from '../components/service.utils';
import { AppConfig } from '../config/app-config';
import { OntimizeServiceConfig, OntimizeServiceResponse, ORemoteConfiguration, ORemoteConfigurationColumns } from '../types';
import { Codes } from '../util/codes';
import { LoginService, SessionInfo } from './login.service';

@Injectable()
export class ORemoteConfigurationService {

  public static DEFAULT_REMOTE_CONFIG_PATH = '/config';
  public static DEFAULT_COLUMN_USER = 'USER_';
  public static DEFAULT_COLUMN_APPID = 'APP_UUID';
  public static DEFAULT_COLUMN_CONFIG = 'CONFIGURATION';

  public path: string = '';

  protected httpClient: HttpClient;
  protected _appConfig: AppConfig;
  protected _urlBase: string;
  protected _sessionInfo: SessionInfo;
  protected _columns: ORemoteConfigurationColumns = {
    user: ORemoteConfigurationService.DEFAULT_COLUMN_USER,
    appId: ORemoteConfigurationService.DEFAULT_COLUMN_APPID,
    configuration: ORemoteConfigurationService.DEFAULT_COLUMN_CONFIG
  };

  constructor(protected injector: Injector) {
    this.httpClient = this.injector.get(HttpClient);
    this._appConfig = this.injector.get(AppConfig);
  }

  public configureService(config: OntimizeServiceConfig = {}): void {
    this._urlBase = config.urlBase ? config.urlBase : this._appConfig.getConfiguration().apiEndpoint;
    this._sessionInfo = this.injector.get(LoginService).getSessionInfo();

    const remoteConfig: ORemoteConfiguration = this._appConfig.getRemoteConfigurationConfig();
    this.path = remoteConfig.path ? remoteConfig.path : ORemoteConfigurationService.DEFAULT_REMOTE_CONFIG_PATH;
    this._columns = remoteConfig.columns ? Object.assign(this._columns, remoteConfig.columns) : this._columns;
  }

  public getUserConfiguration(user?: string, appId?: string): Observable<any> {
    const url = this._urlBase + this.path + '/search';
    const body: any = {};
    body[this._columns.user] = user ? user : this._sessionInfo.user;
    body[this._columns.appId] = appId ? appId : this._appConfig.getConfiguration().uuid;
    const options = {
      headers: this.buildHeaders()
    };

    const self = this;
    const observable = new Observable((observer: Subscriber<OntimizeServiceResponse>) =>
      this.httpClient.post(url, body, options).subscribe(
        (resp: OntimizeServiceResponse) => {
          if (resp && resp.code === Codes.ONTIMIZE_UNAUTHORIZED_CODE) {
            self.redirectLogin(true);
          } else if (resp && resp.code === Codes.ONTIMIZE_FAILED_CODE) {
            observer.error(resp.message);
          } else if (resp && resp.code === Codes.ONTIMIZE_SUCCESSFUL_CODE) {
            observer.next(resp);
          } else {
            observer.error('Service unavailable');
          }
        },
        error => {
          if (error.status !== 500 && (error.status === 401 || error.status === 0) && !error.ok) {
            self.redirectLogin(true);
          } else {
            observer.error(error);
          }
        },
        () => observer.complete())
    );
    return observable;
  }

  public storeUserConfiguration(configuration: any, user?: string, appId?: string): Observable<any> {
    const url = this._urlBase + this.path;
    const body: any = { filter: {}, data: {} };
    body.filter[this._columns.user] = user ? user : this._sessionInfo.user;
    body.filter[this._columns.appId] = appId ? appId : this._appConfig.getConfiguration().uuid;
    body.data[this._columns.configuration] = JSON.stringify(configuration);
    const options = {
      headers: this.buildHeaders()
    };

    const self = this;
    const observable = new Observable((observer: Subscriber<OntimizeServiceResponse>) =>
      this.httpClient.put(url, body, options).subscribe(
        (resp: OntimizeServiceResponse) => {
          if (resp && resp.code === Codes.ONTIMIZE_UNAUTHORIZED_CODE) {
            self.redirectLogin(true);
          } else if (resp && resp.code === Codes.ONTIMIZE_FAILED_CODE) {
            observer.error(resp.message);
          } else if (resp && resp.code === Codes.ONTIMIZE_SUCCESSFUL_CODE) {
            observer.next(resp);
          } else {
            observer.error('Service unavailable');
          }
        },
        error => {
          if (error.status !== 500 && (error.status === 401 || error.status === 0) && !error.ok) {
            self.redirectLogin(true);
          } else {
            observer.error(error);
          }
        },
        () => observer.complete())
    );
    return observable;
  }

  protected buildHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': 'Bearer ' + this._sessionInfo.id
    });
  }

  protected redirectLogin(sessionExpired: boolean = false): void {
    const router = this.injector.get(Router);
    ServiceUtils.redirectLogin(router, sessionExpired);
  }

}
