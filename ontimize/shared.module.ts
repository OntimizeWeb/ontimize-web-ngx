// ,  // ModuleWithProviders
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdTooltipModule } from '@angular/material';

import {
  ColumnsFilterPipe,
  OrderByPipe,
  OIntegerPipe,
  ORealPipe
} from './pipes';

import { ODialogComponent } from './components/dialog/o-dialog.component';

import { ONTIMIZE_DIRECTIVES } from './config/o-directives';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ColumnsFilterPipe,
    OrderByPipe,
    OIntegerPipe,
    ORealPipe,
    ONTIMIZE_DIRECTIVES
  ],
  entryComponents: [
    ODialogComponent
  ],
  exports: [
    CommonModule,
    ColumnsFilterPipe,
    OrderByPipe,
    OIntegerPipe,
    ORealPipe,
    ONTIMIZE_DIRECTIVES,
    MdTooltipModule
  ]
})
export class OSharedModule {
  // static forRoot(): ModuleWithProviders {
  //   return {
  //     ngModule: OSharedModule,
  //     providers: []
  //   };
  // }
}
