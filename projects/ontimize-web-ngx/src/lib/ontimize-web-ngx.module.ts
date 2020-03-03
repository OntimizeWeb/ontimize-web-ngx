import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { INTERNAL_ONTIMIZE_MODULES, INTERNAL_ONTIMIZE_MODULES_EXPORTED } from './config/o-modules';
import { ODialogComponent } from './shared/components/dialog/o-dialog.component';
import { OSnackBarComponent } from './shared/components/snackbar/o-snackbar.component';

@NgModule({
  declarations: [],
  imports: INTERNAL_ONTIMIZE_MODULES,
  exports: [INTERNAL_ONTIMIZE_MODULES_EXPORTED],
  entryComponents: [
    ODialogComponent,
    OSnackBarComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OntimizeWebModule { }
