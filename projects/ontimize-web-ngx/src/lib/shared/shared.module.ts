import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';

import { ColumnsFilterPipe } from '../pipes/columns-filter.pipe';
import { OrderByPipe } from '../pipes/order-by.pipe';
import { OIntegerPipe } from '../pipes/o-integer.pipe';
import { ORealPipe } from '../pipes/o-real.pipe';
import { OTranslateModule } from '../pipes/o-translate.pipe';
import { OMomentPipe } from '../pipes/o-moment.pipe';
import { OCurrencyPipe } from '../pipes/o-currency.pipe';
import { OPercentPipe } from '../pipes/o-percentage.pipe';

import { ONTIMIZE_DIRECTIVES } from '../config/o-directives';
import { OCustomMaterialModule } from './material/custom.material.module';
import { OMatErrorModule } from './material/o-mat-error/o-mat-error';
import { Error403Component } from './components/error403/o-error-403.component';
import { ODialogComponent } from './components/dialog/o-dialog.component';
import { OValidatorComponent } from './components/validation/o-validator.component';
import { OSnackBarComponent } from './components/snackbar/o-snackbar.component';

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
    ONTIMIZE_DIRECTIVES,
    Error403Component,
    ODialogComponent,
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
    ONTIMIZE_DIRECTIVES,
    OCustomMaterialModule,
    Error403Component,
    OValidatorComponent,
    OSnackBarComponent
  ],
  entryComponents: [Error403Component]
})
export class OSharedModule {
}
