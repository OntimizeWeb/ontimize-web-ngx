import { Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { OFormLayoutManagerService } from '../../../services/o-form-layout-manager.service';
import { ShareCanActivateChildService } from '../../../services/share-can-activate-child.service';
import { Util } from '../../../util/util';
import { OFormLayoutManagerComponent } from '../o-form-layout-manager.component';

@Injectable()
export class CanActivateFormLayoutChildGuard implements CanActivateChild {

  protected oFormLayoutService: OFormLayoutManagerService;
  protected shareCanActivateChildService: ShareCanActivateChildService;

  constructor(protected injector: Injector) {
    this.shareCanActivateChildService = this.injector.get(ShareCanActivateChildService);
    try {
      this.oFormLayoutService = this.injector.get(OFormLayoutManagerService);
    } catch (e) {
      console.error(e);
    }
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
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
          formLayoutManager.addDetailComponent(childRoute, state.url.substring(0, state.url.indexOf('?')));
        }
      });
      return false;
    }
    return true;
  }
}
