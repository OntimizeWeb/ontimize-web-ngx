import { Injectable, Injector } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Util } from '../../../utils';
import { OFormLayoutManagerService } from '../../../services/o-form-layout-manager.service';
import { ShareCanActivateChildService } from '../../../services/share-can-activate-child.service';
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
      console.log(e);
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
      formLayoutManager.addDetailComponent(childRoute, state.url.substring(0, state.url.indexOf('?')));
      return false;
    }
    return true;
  }
}
