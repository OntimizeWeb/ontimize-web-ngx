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

@NgModule({
  imports: ONTIMIZE_MODULES,
  exports: ONTIMIZE_EXPORTS_MODULES
})
export class OntimizeWebModule {
}
