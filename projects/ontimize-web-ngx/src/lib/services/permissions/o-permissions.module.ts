import { NgModule, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionsGuardService } from './permissions-can-activate.guard';
import { OntimizePermissionsService } from './ontimize-permissions.service';
import { permissionsServiceFactory } from './permissions-service.provider';
import { PermissionsService } from './permissions.service';

export function getPermissionsServiceProvider(injector: Injector) {
  return new PermissionsService(injector);
}

@NgModule({
  imports: [CommonModule],
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
