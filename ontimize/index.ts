import { NgModule } from '@angular/core';

import {
  INTERNAL_ONTIMIZE_MODULES_EXPORTED,
  INTERNAL_ONTIMIZE_MODULES
} from './config/o-modules';

export { ONTIMIZE_MODULES } from './config/o-modules';
export { ONTIMIZE_PROVIDERS } from './config/o-providers';

export * from './config/app-config';
export * from './MainLauncher';
export * from './pipes';
export * from './services';
export * from './decorators';
export * from './components';
export * from './layouts';
export * from './utils';
export * from './shared';
export * from './validators/o-validators';

import { ODialogComponent } from './components';

@NgModule({
  imports: INTERNAL_ONTIMIZE_MODULES,
  exports: INTERNAL_ONTIMIZE_MODULES_EXPORTED,
  entryComponents: [
    ODialogComponent
  ]
})
export class OntimizeWebModule {
}
