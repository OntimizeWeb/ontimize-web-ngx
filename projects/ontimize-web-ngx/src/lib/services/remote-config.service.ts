import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HostListener, Injectable, Injector, Type, Directive } from '@angular/core';
import { Observable, Subscriber, Subscription, timer } from 'rxjs';

import { AppConfig } from '../config/app-config';
import { ServiceResponse } from '../interfaces/service-response.interface';
import { ORemoteConfiguration, ORemoteConfigurationColumns } from '../types/remote-configuration.type';
import { SessionInfo } from '../types/session-info.type';
import { Codes } from '../util/codes';
import { Util } from '../util/util';
import { AuthService } from './auth.service';
import { LocalStorageService } from './local-storage.service';

@Directive()
@Injectable({
  providedIn: 'root'
})
export class ORemoteConfigurationService {

  public static DEFAULT_COLUMN_USER = 'USER_';
  public static DEFAULT_COLUMN_APPID = 'APP_UUID';
  public static DEFAULT_COLUMN_CONFIG = 'CONFIGURATION';
  public static DEFAULT_STORAGE_TIMEOUT = 60000;

  protected localStorageService: LocalStorageService;
  protected authService: AuthService;
  protected httpClient: HttpClient;
  protected _appConfig: AppConfig;
  protected _url: string;
  protected _uuid: string;
  protected _timeout: number;
  protected timerSubscription: Subscription;
  protected storeSubscription: Subscription;

  protected _columns: ORemoteConfigurationColumns = {
    user: ORemoteConfigurationService.DEFAULT_COLUMN_USER,
    appId: ORemoteConfigurationService.DEFAULT_COLUMN_APPID,
    configuration: ORemoteConfigurationService.DEFAULT_COLUMN_CONFIG
  };

  @HostListener('window:beforeunload', [])
  beforeunloadHandler() {
    this.finalize().subscribe(() => {
      //
    });
  }

  constructor(protected injector: Injector) {
    this.httpClient = this.injector.get<HttpClient>(HttpClient as Type<HttpClient>);
    this._appConfig = this.injector.get<AppConfig>(AppConfig as Type<AppConfig>);
    this.authService = this.injector.get<AuthService>(AuthService as Type<AuthService>);
    this.localStorageService = this.injector.get<LocalStorageService>(LocalStorageService as Type<LocalStorageService>);

    this.httpClient = this.injector.get<HttpClient>(HttpClient as Type<HttpClient>);
    this._uuid = this._appConfig.getConfiguration().uuid;

    if (this._appConfig.useRemoteConfiguration()) {
      this._url = this._appConfig.getRemoteConfigurationEndpoint();

      const remoteConfig: ORemoteConfiguration = this._appConfig.getRemoteConfigurationConfig();
      this._columns = (remoteConfig && remoteConfig.columns) ? Object.assign(this._columns, remoteConfig.columns) : this._columns;

      this._timeout = (remoteConfig && remoteConfig.timeout) ? remoteConfig.timeout : ORemoteConfigurationService.DEFAULT_STORAGE_TIMEOUT;
      const self = this;
      this.localStorageService.onSetLocalStorage.subscribe(() => {
        if (self.storeSubscription) {
          self.storeSubscription.unsubscribe();
        }
      });
    }
  }

  public getUserConfiguration(): Observable<ServiceResponse> {
    const self = this;
    const observable = new Observable((observer: Subscriber<ServiceResponse>) => {
      const sessionInfo = self.authService.getSessionInfo();
      if (!self.hasSession(sessionInfo)) {
        observer.error();
        return;
      }
      const url = self._url + '/search';
      const body: any = {};
      body[self._columns.user] = sessionInfo.user;
      body[self._columns.appId] = self._uuid;
      const options = {
        headers: self.buildHeaders()
      };
      self.httpClient.post(url, body, options).subscribe((resp: ServiceResponse) => {
        if (resp && resp.code === Codes.ONTIMIZE_SUCCESSFUL_CODE && Util.isDefined(resp.data)) {
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
    if (self.storeSubscription) {
      self.storeSubscription.unsubscribe();
    }
    const observable = new Observable((observer: Subscriber<ServiceResponse>) => {
      const sessionInfo = self.authService.getSessionInfo();
      if (!self._appConfig.useRemoteConfiguration() || !self.hasSession(sessionInfo)) {
        observer.next();
        observer.complete();
        return;
      }
      const url = self._url;
      const body: any = { filter: {}, data: {} };
      body.filter[self._columns.user] = sessionInfo.user;
      body.filter[self._columns.appId] = self._uuid;
      let userData = self.localStorageService.getSessionUserComponentsData() || '';
      try {
        userData = btoa(JSON.stringify(userData));
      } catch (e) {
        userData = '';
      }
      body.data[self._columns.configuration] = userData;
      const options = {
        headers: self.buildHeaders()
      };
      self.httpClient.put(url, body, options).subscribe((resp: ServiceResponse) => {
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

  public initialize(): Observable<any> {
    const self = this;
    return new Observable(observer => {
      if (self._appConfig.useRemoteConfiguration()) {
        self.timerSubscription = timer(self._timeout, self._timeout).subscribe(() => {
          self.storeSubscription = self.storeUserConfiguration().subscribe(() => {
            //
          });
        });
        self.getUserConfiguration().subscribe((resp: ServiceResponse) => {
          let storedConf;
          if (Util.isArray(resp.data)) {
            storedConf = resp.data[0][self._columns.configuration];
          } else {
            storedConf = resp.data;
          }
          if (Util.isDefined(storedConf)) {
            let componentsData;
            try {
              const decoded = atob(storedConf);
              componentsData = JSON.parse(decoded);
            } catch (e) {
              componentsData = {};
            }
            self.localStorageService.storeSessionUserComponentsData(componentsData);
          }
          observer.next();
        }, () => {
          observer.next();
        });
      } else {
        observer.next();
      }
    });
  }

  public finalize(): Observable<any> {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    return this.storeUserConfiguration();
  }

  protected hasSession(sessionInfo: SessionInfo): boolean {
    return Util.isDefined(sessionInfo) && Util.isDefined(sessionInfo.user) && Util.isDefined(sessionInfo.id);
  }

  protected buildHeaders(): HttpHeaders {
    const sessionInfo = this.authService.getSessionInfo();
    return new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: 'Bearer ' + sessionInfo.id
    });
  }

}
