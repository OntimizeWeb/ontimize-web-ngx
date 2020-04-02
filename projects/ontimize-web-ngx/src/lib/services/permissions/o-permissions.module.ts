import { CommonModule } from '@angular/common';
import { Injector, NgModule } from '@angular/core';

import { PermissionsGuardService } from './permissions-can-activate.guard';
import { OntimizePermissionsServiceProvider } from './permissions-service.provider';
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
  },
    OntimizePermissionsServiceProvider
  ]
})
export class OPermissionsModule { }
