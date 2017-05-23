import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  ColumnsFilterPipe,
  OrderByPipe,
  OIntegerPipe,
  ORealPipe,
  // OTranslatePipe,
  OTranslateModule
} from '../pipes';

// import { ODialogComponent } from '../components/dialog/o-dialog.component';
import { ONTIMIZE_DIRECTIVES } from '../config/o-directives';

import { OCustomMaterialModule } from './custom.material.module';

@NgModule({
  // imports: [
  //   CommonModule,
  //   FormsModule,
  //   ReactiveFormsModule,
  //   OCustomMaterialModule,
  //   OTranslateModule
  // ],
  declarations: [
    ColumnsFilterPipe,
    OrderByPipe,
    OIntegerPipe,
    ORealPipe,
    // OTranslatePipe,
    ONTIMIZE_DIRECTIVES
  ],
  // entryComponents: [
  //   ODialogComponent
  // ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    OTranslateModule,
    ColumnsFilterPipe,
    OrderByPipe,
    OIntegerPipe,
    ORealPipe,
    ONTIMIZE_DIRECTIVES,
    OCustomMaterialModule
  ]
})
export class OSharedModule {
}
