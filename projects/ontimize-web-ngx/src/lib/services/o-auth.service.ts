import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, from, Observable } from 'rxjs';

import { AppConfig } from '../config/app-config';
import { IAuthService } from '../interfaces/auth-service.interface';
import { Config } from '../types/config.type';
import { SessionInfo } from '../types/session-info.type';
import { Codes } from '../util/codes';
import { AuthService } from './auth.service';
import { LoginStorageService } from './login-storage.service';
import { OntimizeService } from './ontimize/ontimize.service';
import { PermissionsService } from './permissions/permissions.service';
import { ORemoteConfigurationService } from './remote-config.service';

@Injectable()
export class OntimizeAuthService extends AuthService {

  private _user: string;
  private _config: Config;
  private router: Router;
  private ontService: OntimizeService;
  private loginStorageService: LoginStorageService;

  constructor(protected injector: Injector) {
    super(injector);
    this._config = this.injector.get(AppConfig).getConfiguration();
    this.router = this.injector.get(Router);
    this.loginStorageService = this.injector.get(LoginStorageService);
    const sessionInfo = this.loginStorageService.getSessionInfo();
    if (sessionInfo && sessionInfo.id && sessionInfo.user && sessionInfo.user.length > 0) {
      this._user = sessionInfo.user;
    }
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
    const dataObservable: Observable<any> = new Observable(observer => {
      this.retrieveAuthService().then(service => {
        service.startsession(user, password).subscribe(resp => {
          this.onLoginSuccess(resp);
          const permissionsService = this.injector.get(PermissionsService);
          const remoteConfigService = this.injector.get(ORemoteConfigurationService);
          const pendingArray = [];
          pendingArray.push(permissionsService.getUserPermissionsAsPromise());
          pendingArray.push(remoteConfigService.initialize());
          combineLatest(pendingArray).subscribe(() => {
            observer.next();
            observer.complete();
          });
        }, error => {
          this.onLoginError(error);
          observer.error(error);
        });
      });
    });
    return from(dataObservable.toPromise());
  }

  public onLoginSuccess(sessionId: string | number): void {
    // save user and sessionid into local storage
    const session = {
      user: this._user,
      id: sessionId
    };
    this.loginStorageService.storeSessionInfo(session);
    this.onLogin.next(session);
  }

  public onLoginError(error: any): void {
    this.alert('ERROR', 'MESSAGES.ERROR_LOGIN');
  }

  public logout(): Observable<any> {
    this.onLogout.next(null);
    const sessionInfo = this.loginStorageService.getSessionInfo();
    const dataObservable: Observable<any> = new Observable(innerObserver => {
      this.retrieveAuthService().then(service => {
        service.endsession(sessionInfo.user, sessionInfo.id).subscribe(resp => {
          const remoteConfigService = this.injector.get(ORemoteConfigurationService);
          remoteConfigService.finalize().subscribe(() => {
            this.onLogoutSuccess(resp);
            innerObserver.next();
            innerObserver.complete();
          });
        }, error => {
          this.onLogoutError(error);
          innerObserver.error(error);
        });
      });
    });
    return from(dataObservable.toPromise());
  }

  public onLogoutSuccess(sessionId: number): void {
    if (sessionId === 0) {
      this.clearSessionData();
      this.redirectLogin(false);
    }
  }

  public onLogoutError(error: any): void {
    console.error('Error on logout');
    this.clearSessionData();
    this.redirectLogin(false);
  }

  public clearSessionData(): void {
    this.loginStorageService.sessionExpired();
  }

  public isLoggedIn(): boolean {
    return this.loginStorageService.isLoggedIn();
  }

  public getSessionInfo(): SessionInfo {
    return this.loginStorageService.getSessionInfo();
  }

  public storeSessionInfo(info: SessionInfo): void {
    this.loginStorageService.storeSessionInfo(info);
  }

  redirectLogin(sessionExpired: boolean = false) {
    const arg = {};
    arg[Codes.SESSION_EXPIRED_KEY] = sessionExpired;
    const extras = {};
    extras[Codes.QUERY_PARAMS] = arg;
    this.router.navigate([Codes.LOGIN_ROUTE], extras);
  }

}
