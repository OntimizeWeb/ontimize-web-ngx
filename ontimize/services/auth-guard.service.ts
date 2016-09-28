import { Injector, Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { IProfileService } from '../interfaces';
import { OntimizeService, LoginService } from '../services';
import { APP_CONFIG, Config } from '../config/app-config';

@Injectable()
export class AuthGuardService implements CanActivate, IProfileService {

  public static PROFILE_ROUTE_PROPERTY = 'route';
  public static PROFILE_COMPONENTS_PROPERTY = 'components';

  protected injector: Injector;
  protected router: Router;
  protected loginService: LoginService;
  protected config: Config;
  protected ontimizeService: OntimizeService;
  protected entity: any;
  protected keyColumn: any;
  protected valueColumn: any;
  protected user: any;
  protected profile: any;
  protected profileObservable: Observable<any>;

  constructor(private inj: Injector) {
    this.injector = inj;

    this.user = undefined;
    this.profile = undefined;
    this.router = this.injector.get(Router);
    this.loginService = this.injector.get(LoginService);
    this.config = this.injector.get(APP_CONFIG);

    this.entity = undefined;
    this.keyColumn = undefined;
    this.valueColumn = undefined;
    if (typeof(this.config.authGuard) !== 'undefined') {
      if (typeof(this.config.authGuard.entity) !== 'undefined') {
        this.entity = this.config.authGuard.entity;
      }
      if (typeof(this.config.authGuard.keyColumn) !== 'undefined') {
        this.keyColumn = this.config.authGuard.keyColumn;
      }
      if (typeof(this.config.authGuard.valueColumn) !== 'undefined') {
        this.valueColumn = this.config.authGuard.valueColumn;
      }
    }

    this.ontimizeService = this.injector.get(OntimizeService);

  }

  public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let isLoggedIn = this.loginService.isLoggedIn();
    if (!isLoggedIn) {
      this.profile = undefined;
      this.router.navigate([LoginService.LOGIN_ROUTE]);
    } else if ((typeof(this.entity) !== 'undefined') && (typeof(this.keyColumn) !== 'undefined') &&
        (typeof(this.valueColumn) !== 'undefined')) {
      if ((typeof(this.profile) === 'undefined') || (this.user !== this.loginService.user)) {
        this.user = undefined;
        this.profile = undefined;
        this.profileObservable = new Observable(observer => {
          // get user profile from service
          this.ontimizeService.configureService({
            'session': this.loginService.getSessionInfo()
          });
          let filter = {};
          filter[this.keyColumn] = this.loginService.user;
          this.ontimizeService.query(filter, [ this.valueColumn ], this.entity)
            .subscribe(
              res => {
                this.user = this.loginService.user;
                if ((res.code === 0) && (typeof(res.data) !== 'undefined') && (res.data.length === 1) &&
                    (typeof(res.data[0]) === 'object')) {
                  this.profile = res.data[0].hasOwnProperty('JSONWEB') ? JSON.parse(res.data[0]['JSONWEB']) : {};
                } else {
                  //TODO JEE?
                }
                observer.next();
                observer.complete();
              },
              err => {
                console.log('[AuthGuardService.canActivate]: error', err);
                observer.error(err);
              }
            );
        }).share();
        this.profileObservable
          .subscribe(
            res => {
              let restricted = this._isRestricted(state.url);
              if (restricted) {
                this.router.navigate([LoginService.LOGIN_ROUTE]);
              }
              return restricted;
            },
            err => {
              this.router.navigate([LoginService.LOGIN_ROUTE]);
              return false;
            }
          );
      } else if (this._isRestricted(state.url)) {
        this.router.navigate([LoginService.LOGIN_ROUTE]);
      }
    }
    return isLoggedIn;
  }

  public isRestricted(route: string): Promise<boolean> {
    return new Promise(
      (resolve, reject) => {
        if ((typeof(this.entity) !== 'undefined') && (typeof(this.keyColumn) !== 'undefined') &&
            (typeof(this.valueColumn) !== 'undefined') && (typeof(this.profile) === 'undefined')) {
          this.profileObservable
            .subscribe(
              res => {
                resolve(this._isRestricted(route));
              },
              err => {
                reject(false);
              }
            );
        } else {
          resolve(this._isRestricted(route));
        }
      }
    );
  }

  protected _isRestricted(route: string): boolean {
    let restricted = false;
    if (typeof(this.profile) !== 'undefined' && typeof(this.profile[AuthGuardService.PROFILE_ROUTE_PROPERTY]) !== 'undefined') {
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
    return new Promise(
      (resolve, reject) => {
        if ((typeof(this.entity) !== 'undefined') && (typeof(this.keyColumn) !== 'undefined') &&
            (typeof(this.valueColumn) !== 'undefined') && (typeof(this.profile) === 'undefined')) {
          this.profileObservable
            .subscribe(
              res => {
                resolve(this._getPermissions(route, attr));
              },
              err => {
                reject(undefined);
              }
            );
        } else {
          resolve(this._getPermissions(route, attr));
        }
      }
    );
  }

  protected _getPermissions(route: string, attr: string): any {
    let permissions = undefined;
    if (typeof(this.profile) !== 'undefined' && typeof(this.profile[AuthGuardService.PROFILE_COMPONENTS_PROPERTY]) !== 'undefined' &&
        typeof(this.profile[AuthGuardService.PROFILE_COMPONENTS_PROPERTY][route]) !== 'undefined' &&
        typeof(this.profile[AuthGuardService.PROFILE_COMPONENTS_PROPERTY][route][attr]) !== 'undefined') {
      permissions = this.profile[AuthGuardService.PROFILE_COMPONENTS_PROPERTY][route][attr];
    }
    return permissions;
  }

}
