import { Injector, Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';

import { OntimizeService, LoginService, OUserInfoService } from '../services';
import { AppConfig, Config } from '../config/app-config';
import { Util, Codes } from '../utils';
import { dataServiceFactory } from './data-service.provider';

export interface IProfileService {
  isRestricted(route: string): Promise<boolean>;
  getPermissions(route: string, attr: string): Promise<any>;
}

@Injectable()
export class AuthGuardService implements CanActivate, IProfileService {

  public static PROFILE_ROUTE_PROPERTY = 'route';
  public static PROFILE_COMPONENTS_PROPERTY = 'components';

  protected router: Router;
  protected loginService: LoginService;
  protected oUserInfoService: OUserInfoService;
  protected config: Config;
  protected ontimizeService: any;
  protected service: any;
  protected entity: any;
  protected keyColumn: any;
  protected valueColumn: any;
  protected user: any;
  protected profile: any;
  protected profileObservable: Observable<any>;


  constructor(protected injector: Injector) {

    this.user = undefined;
    this.profile = undefined;
    this.router = this.injector.get(Router);
    this.loginService = this.injector.get(LoginService);
    this.oUserInfoService = this.injector.get(OUserInfoService);

    this.config = this.injector.get(AppConfig).getConfiguration();

    this.entity = undefined;
    this.keyColumn = undefined;
    this.valueColumn = undefined;

    if (Util.isDefined(this.config.authGuard)) {
      if (Util.isDefined(this.config.authGuard.entity)) {
        this.entity = this.config.authGuard.entity;
      }
      if (Util.isDefined(this.config.authGuard.keyColumn)) {
        this.keyColumn = this.config.authGuard.keyColumn;
      }
      if (Util.isDefined(this.config.authGuard.valueColumn)) {
        this.valueColumn = this.config.authGuard.valueColumn;
      }
      if (Util.isDefined(this.config.authGuard.service)) {
        this.service = this.config.authGuard.service;
      }
    }
  }

  configureService() {
    let localInjector = Injector.create([{ provide: OntimizeService, useFactory: dataServiceFactory, deps: [Injector] }], this.injector);

    this.ontimizeService = localInjector.get(OntimizeService);

    if (Util.isDataService(this.ontimizeService)) {
      let serviceCfg: Object = this.ontimizeService.getDefaultServiceConfiguration(this.service);
      if (this.entity) {
        serviceCfg['entity'] = this.entity;
        //serviceCfg[Codes.SESSION_KEY] = this.loginService.getSessionInfo();
      }
      this.ontimizeService.configureService(serviceCfg);
    }
  }

  public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let isLoggedIn = this.loginService.isLoggedIn();
    if (!isLoggedIn) {
      this.profile = undefined;
      this.router.navigate([Codes.LOGIN_ROUTE]);
    } else if (Util.isDefined(this.entity) && Util.isDefined(this.keyColumn) && Util.isDefined(this.valueColumn)) {
      if (!Util.isDefined(this.profile) || (this.user !== this.loginService.user)) {
        this.user = undefined;
        this.profile = undefined;
        this.profileObservable = new Observable(observer => {
          // get user profile from service
          this.configureService();
          let filter: Object = {};
          filter[this.keyColumn] = this.loginService.user;
          this.ontimizeService.query(filter, [this.valueColumn], this.entity).subscribe((res: any) => {
            this.user = this.loginService.user;
            if ((res.code === Codes.ONTIMIZE_SUCCESSFUL_CODE) && Util.isDefined(res.data) && (res.data.length === 1) &&
              Util.isObject(res.data[0])) {
              this.profile = res.data[0].hasOwnProperty(this.valueColumn) ? JSON.parse(res.data[0][this.valueColumn]) : {};
            } else {
              //TODO JEE?
            }
            observer.next();
            observer.complete();
          },
            (err: any) => {
              console.log('[AuthGuardService.canActivate]: error', err);
              observer.error(err);
            }
          );
        }).pipe(share());
        this.profileObservable.subscribe(res => {
          let restricted = this._isRestricted(state.url);
          if (restricted) {
            this.router.navigate([Codes.LOGIN_ROUTE]);
          }
          return restricted;
        }, err => {
          this.router.navigate([Codes.LOGIN_ROUTE]);
          return false;
        });
      } else if (this._isRestricted(state.url)) {
        this.router.navigate([Codes.LOGIN_ROUTE]);
      }
    }
    if (isLoggedIn) {
      this.setUserInformation();
    }
    return isLoggedIn;
  }

  setUserInformation() {
    const sessionInfo = this.loginService.getSessionInfo();
    // TODO query user information
    this.oUserInfoService.setUserInfo({
      username: sessionInfo.user,
      avatar: './assets/images/user_profile.png'
    });
  }

  public isRestricted(route: string): Promise<boolean> {
    return new Promise((resolve: any, reject: any) => {
      if ((Util.isDefined(this.entity)) && (typeof (this.keyColumn) !== 'undefined') &&
        (typeof (this.valueColumn) !== 'undefined') && (typeof (this.profile) === 'undefined')) {
        this.profileObservable.subscribe(res => {
          resolve(this._isRestricted(route));
        }, err => {
          reject(false);
        });
      } else {
        resolve(this._isRestricted(route));
      }
    });
  }

  protected _isRestricted(route: string): boolean {
    let restricted = false;
    if (Util.isDefined(this.profile) && Util.isDefined(this.profile[AuthGuardService.PROFILE_ROUTE_PROPERTY])) {
      for (let routePrefix in this.profile[AuthGuardService.PROFILE_ROUTE_PROPERTY]) {
        if (this.profile[AuthGuardService.PROFILE_ROUTE_PROPERTY].hasOwnProperty(routePrefix)) {
          if (route.startsWith(routePrefix) && this.profile[AuthGuardService.PROFILE_ROUTE_PROPERTY][routePrefix] === false) {
            restricted = true;
            break;
          }
        }
      }
    }
    return restricted;
  }

  public getPermissions(route: string, attr: string): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      if (Util.isDefined(this.entity) && Util.isDefined(this.keyColumn) && Util.isDefined(this.valueColumn) && !Util.isDefined(this.profile)) {
        this.profileObservable.subscribe(res => {
          resolve(this._getPermissions(route, attr));
        }, err => {
          reject(undefined);
        });
      } else {
        resolve(this._getPermissions(route, attr));
      }
    });
  }

  protected _getPermissions(route: string, attr: string): any {
    let permissions = undefined;
    if (Util.isDefined(this.profile) && Util.isDefined(this.profile[AuthGuardService.PROFILE_COMPONENTS_PROPERTY]) &&
      Util.isDefined(this.profile[AuthGuardService.PROFILE_COMPONENTS_PROPERTY][route]) &&
      Util.isDefined(this.profile[AuthGuardService.PROFILE_COMPONENTS_PROPERTY][route][attr])) {
      permissions = this.profile[AuthGuardService.PROFILE_COMPONENTS_PROPERTY][route][attr];
    }
    return permissions;
  }

}
