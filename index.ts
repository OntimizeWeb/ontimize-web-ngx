import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { ODialogComponent, OSnackBarComponent } from './ontimize/components';
import { INTERNAL_ONTIMIZE_MODULES, INTERNAL_ONTIMIZE_MODULES_EXPORTED } from './ontimize/config/o-modules';

export { ONTIMIZE_MODULES } from './ontimize/config/o-modules';
export { ONTIMIZE_PROVIDERS } from './ontimize/config/o-providers';

export * from './ontimize/config/app-config';
export * from './ontimize/MainLauncher';
export * from './ontimize/pipes';
export * from './ontimize/services';
export * from './ontimize/decorators';
export * from './ontimize/directives';
export * from './ontimize/components';
export * from './ontimize/layouts';
export * from './ontimize/utils';
export * from './ontimize/shared';
export * from './ontimize/validators/o-validators';
export * from './ontimize/types';

@NgModule({
  imports: INTERNAL_ONTIMIZE_MODULES,
  exports: INTERNAL_ONTIMIZE_MODULES_EXPORTED,
  entryComponents: [
    ODialogComponent,
    OSnackBarComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OntimizeWebModule { }
