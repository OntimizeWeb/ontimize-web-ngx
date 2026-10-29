import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, CanActivateChildFn, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { OFormLayoutManagerService } from '../../../services/o-form-layout-manager.service';
import { ShareCanActivateChildService } from '../../../services/share-can-activate-child.service';
import { Util } from '../../../util/util';
import { OFormLayoutManagerComponent } from '../o-form-layout-manager.component';

@Injectable()
export class CanActivateFormLayoutChildGuard implements CanActivateChild {

  protected oFormLayoutService = inject(OFormLayoutManagerService, { optional: true });
  protected shareCanActivateChildService = inject(ShareCanActivateChildService);

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    if (!this.oFormLayoutService) {
      return true;
    }
    const formLayoutManager: OFormLayoutManagerComponent = this.oFormLayoutService.activeFormLayoutManager;
    this.oFormLayoutService.activeFormLayoutManager = undefined;
    if (formLayoutManager) {
      const oPermission = childRoute.data ? childRoute.data['oPermission'] : undefined;
      const permissionId: string = (oPermission || {})['permissionId'];
      if (Util.isDefined(permissionId)) {
        const restricted = !this.shareCanActivateChildService.canActivateChildUsingPermissions(childRoute, state);
        if (restricted) {
          return false;
        }
      }
      formLayoutManager.canAddDetailComponent().subscribe(res => {
        if (res) {
          const context = this.oFormLayoutService.context;
          formLayoutManager.addDetailComponent(childRoute, state.url.substring(0, state.url.indexOf('?')), context);
        }
      });
      return false;
    }
    return true;
  }
}

/** Functional guard wrapper for CanActivateFormLayoutChildGuard. Use in route configs: `canActivateChild: [canActivateFormLayoutChildGuard]` */
export const canActivateFormLayoutChildGuard: CanActivateChildFn = (childRoute, state) => {
  return inject(CanActivateFormLayoutChildGuard).canActivateChild(childRoute, state);
};
