import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

import { OUserInfoService } from '../services/o-user-info.service';
import { Codes } from '../util/codes';
import { AuthService } from './auth.service';
import { PermissionsService } from './permissions/permissions.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  protected router = inject(Router);
  protected authService = inject(AuthService);
  protected oUserInfoService = inject(OUserInfoService);
  protected permissionsService = inject(PermissionsService);

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

/** Functional guard wrapper for AuthGuardService. Use in route configs: `canActivate: [authGuard]` */
export const authGuard: CanActivateFn = (route, state) => {
  return inject(AuthGuardService).canActivate(route, state);
};
