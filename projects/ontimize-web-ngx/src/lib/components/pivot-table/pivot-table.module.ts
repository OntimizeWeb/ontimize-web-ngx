import { OSharedModule } from '../../shared/shared.module';
import { OTableModule } from '../table/o-table.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OPivotTableComponent } from './pivot-table.component';
import { OPivotTableSelectFunctionDialogComponent } from './select-function-dialog/select-function-dialog.component';
import { DragDropModule } from '@angular/cdk/drag-drop';



@NgModule({
  declarations: [
    OPivotTableComponent,
    OPivotTableSelectFunctionDialogComponent
  ],
  imports: [
    CommonModule,
    OSharedModule,
    DragDropModule,
    OTableModule
  ],
  exports: [
    OPivotTableComponent,
    OPivotTableSelectFunctionDialogComponent
  ]
})
export class OPivotTableModule { }
