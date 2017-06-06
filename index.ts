import { NgModule } from '@angular/core';

import {
  INTERNAL_ONTIMIZE_MODULES_EXPORTED,
  INTERNAL_ONTIMIZE_MODULES
} from './ontimize/config/o-modules';

export { ONTIMIZE_MODULES } from './ontimize/config/o-modules';
export { ONTIMIZE_PROVIDERS } from './ontimize/config/o-providers';

export * from './ontimize/config/app-config';
export * from './ontimize/MainLauncher';
export * from './ontimize/pipes';
export * from './ontimize/services';
export * from './ontimize/decorators';
export * from './ontimize/components';
export * from './ontimize/utils';
export * from './ontimize/shared';

import { ODialogComponent } from './ontimize/components';

@NgModule({
  imports: INTERNAL_ONTIMIZE_MODULES,
  exports: INTERNAL_ONTIMIZE_MODULES_EXPORTED,
  entryComponents: [
    ODialogComponent
  ]
})
export class OntimizeWebModule {
}
