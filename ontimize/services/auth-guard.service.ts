import { Injector, Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoginService, OUserInfoService } from '../services';
import { Codes } from '../utils';
import { ProfileService, IProfileService, OComponentPermissions } from './profile.service';

@Injectable()
export class AuthGuardService implements CanActivate, IProfileService {

  protected router: Router;
  protected loginService: LoginService;
  protected oUserInfoService: OUserInfoService;
  protected profileService: ProfileService;

  constructor(protected injector: Injector) {
    this.router = this.injector.get(Router);
    this.loginService = this.injector.get(LoginService);
    this.oUserInfoService = this.injector.get(OUserInfoService);
    this.profileService = this.injector.get(ProfileService);
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
    let isLoggedIn = this.loginService.isLoggedIn();
    let result: Promise<boolean> | boolean = isLoggedIn;
    if (!isLoggedIn) {
      this.profileService.restart();
      this.router.navigate([Codes.LOGIN_ROUTE]);
    }
    // else
    // TODO por si la ruta estuviera restringida, posible funcionalidad en el futuro?
    //   this.profileObservable.subscribe(res => {
    //     let restricted = this._isRestricted(state.url);
    //     if (restricted) {
    //       this.router.navigate([Codes.LOGIN_ROUTE]);
    //     }
    //     return restricted;
    //   }, err => {
    //     this.router.navigate([Codes.LOGIN_ROUTE]);
    //     return false;
    //   });
    // } else if (this._isRestricted(state.url)) {
    //   this.router.navigate([Codes.LOGIN_ROUTE]);
    // }
    if (isLoggedIn) {
      this.setUserInformation();
      if (!this.profileService.hasPermissions()) {
        result = this.profileService.getUserPermissionsAsPromise();
      }
    }
    return result;
  }

  setUserInformation() {
    const sessionInfo = this.loginService.getSessionInfo();
    // TODO query user information
    this.oUserInfoService.setUserInfo({
      username: sessionInfo.user,
      avatar: './assets/images/user_profile.png'
    });
  }

  isRestricted(route: string): boolean {
    return this.profileService.isRestricted(route);
  }

  getPermissions(parentAttr: string, attr: string): OComponentPermissions {
    return this.profileService.getPermissions(parentAttr, attr);
  }

}
