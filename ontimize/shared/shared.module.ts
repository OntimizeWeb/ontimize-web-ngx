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

@NgModule({
  imports: [
    FlexLayoutModule
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
