import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, CanActivateChildFn, Router, RouterStateSnapshot } from '@angular/router';

import { Util } from '../../util/util';
import { ShareCanActivateChildService } from '../share-can-activate-child.service';
import { SnackBarService } from '../snackbar.service';
import { PermissionsService } from './permissions.service';

@Injectable()
export class PermissionsGuardService implements CanActivateChild {

  protected router = inject(Router);
  protected permissionsService = inject(PermissionsService);
  protected snackBarService = inject(SnackBarService);
  protected shareCanActivateChildService = inject(ShareCanActivateChildService);

  constructor() {
    this.shareCanActivateChildService.setPermissionsGuard(this);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let restricted: boolean = false;
    const oPermission = childRoute.data ? childRoute.data['oPermission'] : undefined;
    const permissionId: string = (oPermission || {})['permissionId'];
    if (Util.isDefined(permissionId)) {
      restricted = this.permissionsService.isPermissionIdRouteRestricted(permissionId);
      if (restricted) {
        let msg = 'MESSAGES.NAVIGATION_NOT_ALLOWED_PERMISSION';
        const route: string = oPermission['restrictedPermissionsRedirect'];
        if (Util.isDefined(route)) {
          msg = 'MESSAGES.NAVIGATION_REDIRECTED_PERMISSION';
          this.router.navigate([route]);
        }
        this.snackBarService.open(msg);
      }
    }
    return !restricted;
  }

}

/** Functional guard wrapper for PermissionsGuardService. Use in route configs: `canActivateChild: [permissionsGuard]` */
export const permissionsGuard: CanActivateChildFn = (childRoute, state) => {
  return inject(PermissionsGuardService).canActivateChild(childRoute, state);
};
