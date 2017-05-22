import {
  NgModule
} from '@angular/core';

import {
  ONTIMIZE_EXPORTS_MODULES,
  ONTIMIZE_MODULES
} from './ontimize/config/o-modules';

export * from './ontimize/config/app-config';
export * from './ontimize/config/o-providers';
export * from './ontimize/config/o-modules';
export * from './ontimize/MainLauncher';
export * from './ontimize/interfaces';
export * from './ontimize/pipes';
export * from './ontimize/services';
export * from './ontimize/decorators';
export * from './ontimize/components';
export * from './ontimize/utils';
export * from './ontimize/shared';

import { ODialogComponent } from './ontimize/components';

@NgModule({
  imports: ONTIMIZE_MODULES,
  exports: ONTIMIZE_EXPORTS_MODULES,
  entryComponents: [
    ODialogComponent
  ]
})
export class OntimizeWebModule {
}
