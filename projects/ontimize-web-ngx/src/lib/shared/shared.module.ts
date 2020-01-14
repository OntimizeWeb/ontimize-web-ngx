import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { FlexLayoutModule } from '@angular/flex-layout';
import { OMatErrorModule } from './material/o-mat-error/o-mat-error';
export * from './material/o-mat-error/o-mat-error';

@NgModule({
  imports: [
    FlexLayoutModule,
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
    ONTIMIZE_DIRECTIVES
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
    OCustomMaterialModule
  ]
})
export class OSharedModule {
}
