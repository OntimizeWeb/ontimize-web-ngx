import { EventEmitter, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { AppConfig, Config } from '../config/app-config';
import { DialogService, OntimizeService, ORemoteConfigurationService, PermissionsService } from '../services';
import { Codes, IAuthService, ObservableWrapper, ServiceUtils } from '../utils';

export interface SessionInfo {
  id?: number;
  user?: string;
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
    const sessionInfo = this.getSessionInfo();
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

  public configureOntimizeAuthService(config: Object): void {
    this.ontService = this.injector.get(OntimizeService);
    const servConf = {};
    servConf[Codes.SESSION_KEY] = this.getSessionInfo();
    this.ontService.configureService(servConf);
  }

  public retrieveAuthService(): Promise<IAuthService> {
    return new Promise<IAuthService>(resolve => {
      if (this.ontService !== undefined) {
        resolve(this.ontService);
      } else {
        this.configureOntimizeAuthService(this._config);
        resolve(this.ontService);
      }
    });
  }

  public login(user: string, password: string): Observable<any> {
    this._user = user;
    const self = this;
    let innerObserver: any;
    const dataObservable = new Observable(observer => innerObserver = observer).pipe(share());

    this.retrieveAuthService().then(service => {
      service.startsession(user, password).subscribe(resp => {
        self.onLoginSuccess(resp);
        const permissionsService = self.injector.get(PermissionsService);
        const remoteConfigService = self.injector.get(ORemoteConfigurationService);
        const pendingArray = [];
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

  public onLoginSuccess(sessionId: number): void {
    // save user and sessionid into local storage
    const session = {
      user: this._user,
      id: sessionId
    };
    this.storeSessionInfo(session);
    ObservableWrapper.callEmit(this.onLogin, session);
  }

  public onLoginError(error: any): void {
    this.dialogService.alert('ERROR', 'MESSAGES.ERROR_LOGIN');
  }

  public logout(): Observable<any> {
    ObservableWrapper.callEmit(this.onLogout, null);
    const self = this;
    const sessionInfo = this.getSessionInfo();
    const dataObservable: Observable<any> = new Observable(innerObserver => {
      self.retrieveAuthService().then(service => {
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

  public onLogoutSuccess(sessionId: number): void {
    if (sessionId === 0) {
      this.sessionExpired();
    }
  }

  public onLogoutError(error: any): void {
    console.error('Error on logout');
  }

  public sessionExpired(): void {
    const sessionInfo = this.getSessionInfo();
    delete sessionInfo.id;
    delete sessionInfo.user;
    this.storeSessionInfo(sessionInfo);
  }

  public isLoggedIn(): boolean {
    const sessionInfo = this.getSessionInfo();
    if (sessionInfo && sessionInfo.id && sessionInfo.user && sessionInfo.user.length > 0) {
      if (isNaN(sessionInfo.id) && sessionInfo.id < 0) {
        return false;
      }
      return true;
    }
    return false;
  }

  public storeSessionInfo(sessionInfo: SessionInfo): void {
    if (sessionInfo !== undefined) {
      const info = localStorage.getItem(this._localStorageKey);
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
      return {};
    }
    const stored = JSON.parse(info);
    return stored[Codes.SESSION_KEY] || {};
  }

  public logoutAndRedirect(): void {
    this.logout().subscribe(() => {
      ServiceUtils.redirectLogin(this.router, false);
    });
  }

  public logoutWithConfirmationAndRedirect(): void {
    this.dialogService.confirm('CONFIRM', 'MESSAGES.CONFIRM_LOGOUT').then(res => {
      if (res) {
        this.logoutAndRedirect();
      }
    });
  }

}
