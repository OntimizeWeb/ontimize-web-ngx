import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, Subscriber, timer, Subscription } from 'rxjs';

import { AppConfig } from '../config/app-config';
import { OntimizeServiceResponse, ORemoteConfiguration, ORemoteConfigurationColumns } from '../types';
import { Codes } from '../util/codes';
import { LoginService, SessionInfo } from './login.service';
import { LocalStorageService } from './local-storage.service';
import { Util } from '../util/util';

@Injectable()
export class ORemoteConfigurationService {

  public static DEFAULT_COLUMN_USER = 'USER_';
  public static DEFAULT_COLUMN_APPID = 'APP_UUID';
  public static DEFAULT_COLUMN_CONFIG = 'CONFIGURATION';
  public static DEFAULT_STORAGE_TIMEOUT = 60000;

  protected localStorageService: LocalStorageService;
  protected httpClient: HttpClient;
  protected _appConfig: AppConfig;
  protected _url: string;
  protected _sessionInfo: SessionInfo;
  protected _uuid: string;
  protected timerSubscription: Subscription;
  protected storeSubscription: Subscription;

  protected _columns: ORemoteConfigurationColumns = {
    user: ORemoteConfigurationService.DEFAULT_COLUMN_USER,
    appId: ORemoteConfigurationService.DEFAULT_COLUMN_APPID,
    configuration: ORemoteConfigurationService.DEFAULT_COLUMN_CONFIG
  };

  constructor(protected injector: Injector) {
    this.httpClient = this.injector.get(HttpClient);
    this._appConfig = this.injector.get(AppConfig);
    this.localStorageService = this.injector.get(LocalStorageService);

    this._uuid = this._appConfig.getConfiguration().uuid;
    this._sessionInfo = this.injector.get(LoginService).getSessionInfo();
    this._url = this._appConfig.getRemoteConfigurationEndpoint();

    const remoteConfig: ORemoteConfiguration = this._appConfig.getRemoteConfigurationConfig();
    this._columns = remoteConfig.columns ? Object.assign(this._columns, remoteConfig.columns) : this._columns;

    const timeout = remoteConfig.timeout || ORemoteConfigurationService.DEFAULT_STORAGE_TIMEOUT;
    this.timerSubscription = timer(timeout, timeout).subscribe(() => {
      this.storeSubscription = this.storeUserConfiguration().subscribe(() => {
        //
      });
    });
  }

  public getUserConfiguration(): Observable<any> {
    const self = this;
    const observable = new Observable((observer: Subscriber<OntimizeServiceResponse>) => {
      if (!self.hasSession()) {
        observer.error();
        return;
      }
      const url = self._url + '/search';
      const body: any = {};
      body[self._columns.user] = self._sessionInfo.user;
      body[self._columns.appId] = self._uuid;
      const options = {
        headers: self.buildHeaders()
      };
      self.httpClient.post(url, body, options).subscribe((resp: OntimizeServiceResponse) => {
        if (resp && resp.code === Codes.ONTIMIZE_SUCCESSFUL_CODE && Util.isDefined(resp.data)) {
          let storedConf;
          if (Util.isArray(resp.data)) {
            storedConf = resp.data[0][self._columns.configuration];
          } else {
            storedConf = resp.data;
          }
          if (Util.isDefined(storedConf)) {
            //

          }
          observer.next(resp);
        } else {
          observer.error();
        }
      },
        (error) => observer.error(error),
        () => observer.complete());
    });
    return observable;
  }

  public storeUserConfiguration(): Observable<any> {
    const self = this;
    const observable = new Observable((observer: Subscriber<OntimizeServiceResponse>) => {
      const url = self._url;
      const body: any = { filter: {}, data: {} };
      body.filter[self._columns.user] = self._sessionInfo.user;
      body.filter[self._columns.appId] = self._uuid;

      // self.localStorageService.
      // body.data[self._columns.configuration] = JSON.stringify(configuration);
      const options = {
        headers: self.buildHeaders()
      };
      self.httpClient.put(url, body, options).subscribe((resp: OntimizeServiceResponse) => {
        if (resp && resp.code === Codes.ONTIMIZE_SUCCESSFUL_CODE) {
          observer.next(resp);
        } else {
          observer.error();
        }
      }, (error) => observer.error(error),
        () => observer.complete());
    });
    return observable;
  }

  public initializeRemoteStorageData(): Promise<boolean> {
    const self = this;
    return new Promise((resolve: any, reject: any) => {
      if (self._appConfig.useRemoteConfiguration()) {
        self.getUserConfiguration().subscribe(res => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  protected hasSession(): boolean {
    return Util.isDefined(this._sessionInfo) && Util.isDefined(this._sessionInfo.user) && Util.isDefined(this._sessionInfo.id);
  }

  protected buildHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': 'Bearer ' + this._sessionInfo.id
    });
  }

}
