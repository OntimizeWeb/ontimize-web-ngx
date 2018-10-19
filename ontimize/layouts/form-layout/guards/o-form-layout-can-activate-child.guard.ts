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
    if (this.oFormLayoutManager) {
      if (this.oFormLayoutManager.ignoreCanDeactivate()) {
        return true;
      }
      this.oFormLayoutManager.addDetailComponent(childRoute, state.url.substring(0, state.url.indexOf('?')));
      return false;
    }
    return true;
  }

  get oFormLayoutManager(): OFormLayoutManagerComponent {
    return this.oFormLayoutService.activeFormLayoutManager;
  }
}

