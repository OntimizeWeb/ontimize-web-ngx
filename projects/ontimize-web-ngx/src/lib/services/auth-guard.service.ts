import { Injector, Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoginService, OUserInfoService } from '../services';
import { Codes } from '../utils';
import { PermissionsService } from './permissions/permissions.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  protected router: Router;
  protected loginService: LoginService;
  protected oUserInfoService: OUserInfoService;
  protected permissionsService: PermissionsService;

  constructor(protected injector: Injector) {
    this.router = this.injector.get(Router);
    this.loginService = this.injector.get(LoginService);
    this.oUserInfoService = this.injector.get(OUserInfoService);
    this.permissionsService = this.injector.get(PermissionsService);
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
    let isLoggedIn = this.loginService.isLoggedIn();
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
    const sessionInfo = this.loginService.getSessionInfo();
    // TODO query user information
    this.oUserInfoService.setUserInfo({
      username: sessionInfo.user,
      avatar: './assets/images/user_profile.png'
    });
  }
}
