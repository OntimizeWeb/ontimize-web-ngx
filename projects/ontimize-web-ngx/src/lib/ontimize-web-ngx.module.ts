import { CUSTOM_ELEMENTS_SCHEMA, NgModule, Injectable } from '@angular/core';

import { OntimizeWebNgxComponent } from './ontimize-web-ngx.component';

import { OSnackBarComponent } from './shared/components/snackbar/o-snackbar.component';
import { ODialogComponent } from './shared/components/dialog/o-dialog.component';
import { INTERNAL_ONTIMIZE_MODULES, INTERNAL_ONTIMIZE_MODULES_EXPORTED } from './config/o-modules';

@Injectable({
  providedIn: 'root'
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
