import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ONTIMIZE_DIRECTIVES } from '../config/o-directives';
import { ColumnsFilterPipe } from '../pipes/columns-filter.pipe';
import { OCurrencyPipe } from '../pipes/o-currency.pipe';
import { OIconPipe } from '../pipes/o-icon.pipe';
import { OIntegerPipe } from '../pipes/o-integer.pipe';
import { OMomentPipe } from '../pipes/o-moment.pipe';
import { OPercentPipe } from '../pipes/o-percentage.pipe';
import { ORealPipe } from '../pipes/o-real.pipe';
import { OTranslateModule } from '../pipes/o-translate.pipe';
import { OrderByPipe } from '../pipes/order-by.pipe';
import { ODialogComponent } from './components/dialog/o-dialog.component';
import { Error403Component } from './components/error403/o-error-403.component';
import { OSnackBarComponent } from './components/snackbar/o-snackbar.component';
import { OErrorComponent } from './components/validation/o-error.component';
import { OValidatorComponent } from './components/validation/o-validator.component';
import { OCustomMaterialModule } from './material/custom.material.module';
import { OMatErrorModule } from './material/o-mat-error/o-mat-error.module';

@NgModule({
  imports: [
    CommonModule,
    OTranslateModule,
    FlexLayoutModule,
    OCustomMaterialModule,
    OMatErrorModule
  ],
  declarations: [
    ColumnsFilterPipe,
    OrderByPipe,
    OIntegerPipe,
    ORealPipe,
    OMomentPipe,
    OCurrencyPipe,
    OPercentPipe,
    OIconPipe,
    ONTIMIZE_DIRECTIVES,
    Error403Component,
    ODialogComponent,
    OErrorComponent,
    OValidatorComponent,
    OSnackBarComponent
  ],
  exports: [
    FlexLayoutModule,
    OMatErrorModule,
    FormsModule,
    ReactiveFormsModule,
    OTranslateModule,
    ColumnsFilterPipe,
    OrderByPipe,
    OIntegerPipe,
    ORealPipe,
    OMomentPipe,
    OCurrencyPipe,
    OPercentPipe,
    OIconPipe,
    ONTIMIZE_DIRECTIVES,
    OCustomMaterialModule,
    Error403Component,
    OErrorComponent,
    OValidatorComponent,
    OSnackBarComponent
  ],
  entryComponents: [Error403Component]
})
export class OSharedModule {
}
