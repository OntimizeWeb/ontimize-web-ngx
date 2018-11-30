import { Injector, Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { PermissionsService } from './permissions/permissions.service';
import { PermissionsGuardService } from './permissions/permissions-can-activate.guard';

@Injectable()
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
