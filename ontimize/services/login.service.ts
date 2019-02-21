import { Injectable, Injector, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { share } from 'rxjs/operators';

import { Codes, IAuthService, ObservableWrapper, ServiceUtils } from '../utils';
import { OntimizeService, DialogService, PermissionsService, ORemoteConfigurationService } from '../services';
import { AppConfig, Config } from '../config/app-config';

export interface SessionInfo {
  id: number;
  user: string;
}

export interface ILoginService {
  login(user: string, password: string): Observable<any>;
  logout(): void;
  sessionExpired(): void;
  isLoggedIn(): boolean;
}

@Injectable()
export class LoginService implements ILoginService {
  public onLogin: EventEmitter<any> = new EventEmitter();
  public onLogout: EventEmitter<any> = new EventEmitter();

  private _user: string;
  private _localStorageKey: string;
  private _config: Config;
  private router: Router;
  private ontService: OntimizeService;
  private dialogService: DialogService;

  constructor(protected injector: Injector) {
    this._config = this.injector.get(AppConfig).getConfiguration();
    this.router = this.injector.get(Router);
    this._localStorageKey = this._config['uuid'];
    let sessionInfo = this.getSessionInfo();
    if (sessionInfo && sessionInfo.id && sessionInfo.user && sessionInfo.user.length > 0) {
      this._user = sessionInfo.user;
    }
    this.dialogService = injector.get(DialogService);
  }

  public get user(): string {
    return this._user;
  }

  public get localStorageKey(): string {
    return this._localStorageKey;
  }

  configureOntimizeAuthService(config: Object): void {
    this.ontService = this.injector.get(OntimizeService);
    let servConf = {};
    servConf[Codes.SESSION_KEY] = this.getSessionInfo();
    this.ontService.configureService(servConf);
  }

  retrieveAuthService(): Promise<IAuthService> {
    var self = this;
    let promise = new Promise<IAuthService>((resolve: any) => {
      if (self.ontService !== undefined) {
        resolve(self.ontService);
      } else {
        self.configureOntimizeAuthService(self._config);
        resolve(self.ontService);
      }
    });
    return promise;
  }

  login(user: string, password: string): Observable<any> {
    this._user = user;
    const self = this;
    let innerObserver: any;
    const dataObservable = new Observable(observer => innerObserver = observer).pipe(share());

    this.retrieveAuthService().then((service) => {
      service.startsession(user, password).subscribe(resp => {
        self.onLoginSuccess(resp);
        const permissionsService = self.injector.get(PermissionsService);
        const remoteConfigService = self.injector.get(ORemoteConfigurationService);
        let pendingArray = [];
        pendingArray.push(permissionsService.getUserPermissionsAsPromise());
        pendingArray.push(remoteConfigService.initialize());
        combineLatest(pendingArray).subscribe(() => {
          innerObserver.next();
          innerObserver.complete();
        });
      }, error => {
        self.onLoginError(error);
        innerObserver.error(error);
      });
    });

    return dataObservable.pipe(share());
  }

  onLoginSuccess(sessionId: number) {
    // save user and sessionid into local storage
    let session = {
      user: this._user,
      id: sessionId
    };
    this.storeSessionInfo(session);
    ObservableWrapper.callEmit(this.onLogin, session);
  }

  onLoginError(error: any) {
    this.dialogService.alert('ERROR', 'MESSAGES.ERROR_LOGIN');
  }

  logout(): Observable<any> {
    ObservableWrapper.callEmit(this.onLogout, null);
    const self = this;
    const sessionInfo = this.getSessionInfo();
    const dataObservable: Observable<any> = new Observable(innerObserver => {
      self.retrieveAuthService().then((service) => {
        service.endsession(sessionInfo.user, sessionInfo.id).subscribe(resp => {
          const remoteConfigService = self.injector.get(ORemoteConfigurationService);
          remoteConfigService.finalize().subscribe(() => {
            self.onLogoutSuccess(resp);
            innerObserver.next();
            innerObserver.complete();
          });
        }, error => {
          self.onLogoutError(error);
          innerObserver.error(error);
        });
      });
    });
    return dataObservable.pipe(share());
  }

  onLogoutSuccess(sessionId: number) {
    if (sessionId === 0) {
      let sessionInfo = this.getSessionInfo();
      delete sessionInfo.id;
      delete sessionInfo.user;
      this.storeSessionInfo(sessionInfo);
    }
  }

  onLogoutError(error: any) {
    console.error('Error on logout');
  }

  sessionExpired() {
    let sessionInfo = this.getSessionInfo();
    delete sessionInfo.id;
    delete sessionInfo.user;
    this.storeSessionInfo(sessionInfo);
  }

  isLoggedIn(): boolean {
    let sessionInfo = this.getSessionInfo();
    if (sessionInfo && sessionInfo.id && sessionInfo.user && sessionInfo.user.length > 0) {
      if (isNaN(sessionInfo.id) && sessionInfo.id < 0) {
        return false;
      }
      return true;
    }
    return false;
  }

  public storeSessionInfo(sessionInfo: SessionInfo) {
    if (sessionInfo !== undefined) {
      let info = localStorage.getItem(this._localStorageKey);
      let stored = null;
      if (info && info.length > 0) {
        stored = JSON.parse(info);
      } else {
        stored = {};
      }
      stored[Codes.SESSION_KEY] = sessionInfo;
      localStorage.setItem(this._localStorageKey, JSON.stringify(stored));
    }
  }

  public getSessionInfo(): SessionInfo {
    const info = localStorage.getItem(this._localStorageKey);
    if (!info) {
      return undefined;
    }
    let stored = JSON.parse(info);
    return stored[Codes.SESSION_KEY] || {};
  }

  public logoutAndRedirect() {
    this.logout().subscribe(() => {
      ServiceUtils.redirectLogin(this.router, false);
    });
  }

  public logoutWithConfirmationAndRedirect() {
    this.dialogService.confirm('CONFIRM', 'MESSAGES.CONFIRM_LOGOUT').then(res => {
      if (res) {
        this.logoutAndRedirect();
      }
    });
  }
}
