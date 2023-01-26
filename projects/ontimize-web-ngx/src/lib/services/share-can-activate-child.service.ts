import { Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

import { PermissionsGuardService } from './permissions/permissions-can-activate.guard';
import { PermissionsService } from './permissions/permissions.service';

@Injectable({
  providedIn: 'root'
})
export class ShareCanActivateChildService {

  protected router: Router;
  protected permissionsService: PermissionsService;
  protected permissionsGuard: PermissionsGuardService;

  constructor(protected injector: Injector) {
    this.router = this.injector.get(Router);
    this.permissionsService = this.injector.get(PermissionsService);
  }

  setPermissionsGuard(guard: PermissionsGuardService) {
    this.permissionsGuard = guard;
  }

  canActivateChildUsingPermissions(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.permissionsGuard) {
      return this.permissionsGuard.canActivateChild(childRoute, state);
    }
    return true;
  }
}
