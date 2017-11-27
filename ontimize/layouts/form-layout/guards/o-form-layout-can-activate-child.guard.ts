import { Injectable, Injector } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { OFormLayoutManagerComponent } from '../o-form-layout-manager.component';
import { OFormLayoutManagerService } from '../../../services/o-form-layout-manager.service';

@Injectable()
export class CanActivateFormLayoutChildGuard implements CanActivateChild {
  protected oFormLayoutManager: OFormLayoutManagerComponent;
  protected oFormLayoutService: OFormLayoutManagerService;

  constructor(protected injector: Injector) {
    try {
      this.oFormLayoutService = this.injector.get(OFormLayoutManagerService);
      const self = this;
      this.oFormLayoutService.getOFormLayoutManagerObservable().subscribe(comp => {
        if (comp) {
          self.oFormLayoutManager = comp;
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.oFormLayoutManager) {
      this.oFormLayoutManager.addDetailComponent(childRoute);
    }
    return false;
  }

  setFormLayoutManager(manager: OFormLayoutManagerComponent) {
    this.oFormLayoutManager = manager;
  }
}

