import { Injectable, Injector, Type } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { OUserInfoService } from '../services/o-user-info.service';
import { Codes } from '../util/codes';
import { AuthService } from './auth.service';
import { PermissionsService } from './permissions/permissions.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  protected router: Router;
  protected authService: AuthService;
  protected oUserInfoService: OUserInfoService;
  protected permissionsService: PermissionsService;

  constructor(protected injector: Injector) {
    this.router = this.injector.get<Router>(Router as Type<Router>);
    this.authService = this.injector.get<AuthService>(AuthService as Type<AuthService>);
    this.oUserInfoService = this.injector.get<OUserInfoService>(OUserInfoService as Type<OUserInfoService>);
    this.permissionsService = this.injector.get<PermissionsService>(PermissionsService as Type<PermissionsService>);
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
    const isLoggedIn = this.authService.isLoggedIn();
    let result: Promise<boolean> | boolean = isLoggedIn;
    if (!isLoggedIn) {
      this.permissionsService.restart();
      this.router.navigate([Codes.LOGIN_ROUTE]);
    }
    if (isLoggedIn) {
      this.setUserInformation();
      if (!this.permissionsService.hasPermissions()) {
        result = this.permissionsService.getUserPermissionsAsPromise();
      }
    }
    return result;
  }

  setUserInformation() {
    const sessionInfo = this.authService.getSessionInfo();
    // TODO query user information
    this.oUserInfoService.setUserInfo({
      username: sessionInfo.user,
      avatar: './assets/images/user_profile.png'
    });
  }

}
