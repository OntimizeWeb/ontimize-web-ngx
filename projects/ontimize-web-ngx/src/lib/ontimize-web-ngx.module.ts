import { CUSTOM_ELEMENTS_SCHEMA, NgModule, Injectable } from '@angular/core';

import { OntimizeWebNgxComponent } from './ontimize-web-ngx.component';

import { OSnackBarComponent } from './components/snackbar/o-snackbar.component';
import { ODialogComponent } from './components/dialog/o-dialog.component';
import { INTERNAL_ONTIMIZE_MODULES, INTERNAL_ONTIMIZE_MODULES_EXPORTED } from './config/o-modules';

export { ONTIMIZE_MODULES } from './config/o-modules';
export { ONTIMIZE_PROVIDERS } from './config/o-providers';

export * from './config/app-config';
export * from './MainLauncher';
export * from './pipes';
export * from './services';
export * from './decorators';
export * from './directives';
export * from './components';
export * from './layouts';
export * from './utils';
export * from './shared';
export * from './validators/o-validators';
export * from './types';


@Injectable({
  providedIn: 'root',
})

@NgModule({
  declarations: [OntimizeWebNgxComponent] ,
  imports: INTERNAL_ONTIMIZE_MODULES,
  exports: [INTERNAL_ONTIMIZE_MODULES_EXPORTED, OntimizeWebNgxComponent],
  entryComponents: [
    ODialogComponent,
    OSnackBarComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OntimizeWebNgxModule { }
