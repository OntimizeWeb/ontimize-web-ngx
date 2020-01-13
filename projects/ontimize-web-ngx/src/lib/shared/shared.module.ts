import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  ColumnsFilterPipe,
  OrderByPipe,
  OIntegerPipe,
  ORealPipe,
  OTranslateModule,
  OMomentPipe,
  OCurrencyPipe,
  OPercentPipe
} from '../pipes';

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
