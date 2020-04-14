import { EventEmitter, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { share } from 'rxjs/operators';

import { AppConfig } from '../config/app-config';
import { IAuthService } from '../interfaces/auth-service.interface';
import { ILoginService } from '../interfaces/login-service.interface';
import { DialogService } from '../services/dialog.service';
import { OntimizeService } from '../services/ontimize.service';
import { PermissionsService } from '../services/permissions/permissions.service';
import { ORemoteConfigurationService } from '../services/remote-config.service';
import { Config } from '../types/config.type';
import { SessionInfo } from '../types/session-info.type';
import { ObservableWrapper } from '../util/async';
import { Codes } from '../util/codes';
import { ServiceUtils } from '../util/service.utils';
import { LoginStorageService } from './login-storage.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService implements ILoginService {

  public onLogin: EventEmitter<any> = new EventEmitter();
  public onLogout: EventEmitter<any> = new EventEmitter();

  private _user: string;
  private _config: Config;
  private router: Router;
  private ontService: OntimizeService;
  private dialogService: DialogService;
  private loginStorageService: LoginStorageService;

  constructor(protected injector: Injector) {
    this._config = this.injector.get(AppConfig).getConfiguration();
    this.router = this.injector.get(Router);
    this.loginStorageService = this.injector.get(LoginStorageService);
    const sessionInfo = this.loginStorageService.getSessionInfo();
    if (sessionInfo && sessionInfo.id && sessionInfo.user && sessionInfo.user.length > 0) {
      this._user = sessionInfo.user;
    }
    this.dialogService = injector.get(DialogService);
  }

  public get user(): string {
    return this._user;
  }

  public get localStorageKey(): string {
    return this.loginStorageService._localStorageKey;
  }

  public configureOntimizeAuthService(config: object): void {
    this.ontService = this.injector.get(OntimizeService);
    const servConf = {};
    servConf[Codes.SESSION_KEY] = this.loginStorageService.getSessionInfo();
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
    this.loginStorageService.storeSessionInfo(session);
    ObservableWrapper.callEmit(this.onLogin, session);
  }

  public onLoginError(error: any): void {
    this.dialogService.alert('ERROR', 'MESSAGES.ERROR_LOGIN');
  }

  public logout(): Observable<any> {
    ObservableWrapper.callEmit(this.onLogout, null);
    const self = this;
    const sessionInfo = this.loginStorageService.getSessionInfo();
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
    this.loginStorageService.sessionExpired();
  }

  public isLoggedIn(): boolean {
    return this.loginStorageService.isLoggedIn();
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

  public getSessionInfo(): SessionInfo {
    return this.loginStorageService.getSessionInfo();
  }
}
