import { OSharedModule } from './../../shared/shared.module';
import { OTableModule } from './../table/o-table.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OTablePivotComponent } from './table-pivot.component';
import { OTablePivotSelectFunctionDialogComponent } from './select-function-dialog/select-function-dialog.component';
import { DragDropModule } from '@angular/cdk/drag-drop';



@NgModule({
  declarations: [
    OTablePivotComponent,
    OTablePivotSelectFunctionDialogComponent
  ],
  imports: [
    CommonModule,
    OSharedModule,
    DragDropModule,
    OTableModule
  ],
  exports: [
    OTablePivotComponent,
    OTablePivotSelectFunctionDialogComponent
  ]
})
export class OTablePivotModule { }
