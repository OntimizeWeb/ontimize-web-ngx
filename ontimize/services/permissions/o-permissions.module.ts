import { CommonModule } from '@angular/common';
import { Injector, NgModule } from '@angular/core';

import { OSharedModule } from '../../shared';
import { permissionsServiceFactory } from '../factories';
import { Error403Component } from './error403/o-error-403.component';
import { OntimizePermissionsService } from './ontimize-permissions.service';
import { PermissionsGuardService } from './permissions-can-activate.guard';
import { PermissionsService } from './permissions.service';

export function getPermissionsServiceProvider(injector: Injector) {
  return new PermissionsService(injector);
}

export * from './error403/o-error-403.component';
export * from './ontimize-ee-permissions.service';
export * from './ontimize-permissions.service';
export * from './permissions-can-activate.guard';
export * from './permissions.service';

@NgModule({
  declarations: [Error403Component],
  imports: [CommonModule, OSharedModule],
  exports: [Error403Component],
  entryComponents: [Error403Component],
  providers: [{
    provide: PermissionsGuardService,
    useClass: PermissionsGuardService
  }, {
    provide: PermissionsService,
    useFactory: getPermissionsServiceProvider,
    deps: [Injector]
  }, {
    provide: OntimizePermissionsService,
    useFactory: permissionsServiceFactory,
    deps: [Injector]
  }]
})
export class OPermissionsModule { }
