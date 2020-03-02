import { Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { OUserInfoService } from '../services/o-user-info.service';
import { Codes } from '../util/codes';
import { LoginStorageService } from './login-storage.service';
import { PermissionsService } from './permissions/permissions.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  protected router: Router;
  protected loginStorageService: LoginStorageService;
  protected oUserInfoService: OUserInfoService;
  protected permissionsService: PermissionsService;

  constructor(protected injector: Injector) {
    this.router = this.injector.get(Router);
    this.loginStorageService = this.injector.get(LoginStorageService);
    this.oUserInfoService = this.injector.get(OUserInfoService);
    this.permissionsService = this.injector.get(PermissionsService);
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
    const isLoggedIn = this.loginStorageService.isLoggedIn();
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
    const sessionInfo = this.loginStorageService.getSessionInfo();
    // TODO query user information
    this.oUserInfoService.setUserInfo({
      username: sessionInfo.user,
      avatar: './assets/images/user_profile.png'
    });
  }
}
