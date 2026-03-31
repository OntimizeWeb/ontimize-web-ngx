import { CommonModule } from '@angular/common';
import { Injector, NgModule } from '@angular/core';

import { permissionsServiceFactory } from '../factories';
import { OntimizePermissionsService } from './ontimize-permissions.service';
import { PermissionsGuardService } from './permissions-can-activate.guard';
import { PermissionsService } from './permissions.service';

export function getPermissionsServiceProvider(injector: Injector) {
  return new PermissionsService(injector);
}

@NgModule({
  imports: [CommonModule],
  providers: [
    { provide: PermissionsGuardService, useClass: PermissionsGuardService },
    { provide: OntimizePermissionsService, useFactory: permissionsServiceFactory, deps: [Injector] }
  ]
})
export class OPermissionsModule { }
