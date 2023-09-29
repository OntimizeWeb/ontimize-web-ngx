import { Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';

import { Util } from '../../util/util';
import { ShareCanActivateChildService } from '../share-can-activate-child.service';
import { SnackBarService } from '../snackbar.service';
import { PermissionsService } from './permissions.service';

@Injectable()
export class PermissionsGuardService implements CanActivateChild {

  protected router: Router;
  protected permissionsService: PermissionsService;
  protected snackBarService: SnackBarService;
  protected shareCanActivateChildService: ShareCanActivateChildService;

  constructor(protected injector: Injector) {
    this.router = this.injector.get(Router);
    this.permissionsService = this.injector.get(PermissionsService);
    this.snackBarService = this.injector.get(SnackBarService);
    this.shareCanActivateChildService = this.injector.get(ShareCanActivateChildService);
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
