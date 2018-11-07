import { Injectable, Injector } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { OFormLayoutManagerComponent } from '../o-form-layout-manager.component';
import { OFormLayoutManagerService } from '../../../services/o-form-layout-manager.service';

@Injectable()
export class CanActivateFormLayoutChildGuard implements CanActivateChild {
  protected oFormLayoutService: OFormLayoutManagerService;

  constructor(protected injector: Injector) {
    try {
      this.oFormLayoutService = this.injector.get(OFormLayoutManagerService);
    } catch (e) {
      console.log(e);
    }
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const formLayoutManager: OFormLayoutManagerComponent = this.oFormLayoutService.activeFormLayoutManager;
    this.oFormLayoutService.activeFormLayoutManager = undefined;
    if (formLayoutManager) {
      formLayoutManager.addDetailComponent(childRoute, state.url.substring(0, state.url.indexOf('?')));
      return false;
    }
    return true;
  }
}

