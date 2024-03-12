import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OPivotTableFunction } from '../../../types';

@Component({
  selector: 'o-table-pivot-select-function-dialog',
  templateUrl: './select-function-dialog.component.html',
  styleUrls: ['./select-function-dialog.component.scss'],
})
export class OPivotTableSelectFunctionDialogComponent {
  public selectedFunction: string;
  public functions: { id: string, value: string }[] = [
    { id: 'COUNT', value: 'DIALOG.SELECT_FUNCTION.SUM' },
    { id: 'SUM', value: 'DIALOG.SELECT_FUNCTION.SUM' },
    { id: 'AVERAGE', value: 'DIALOG.SELECT_FUNCTION.AVG' },
    { id: 'MAX', value: 'DIALOG.SELECT_FUNCTION.MAX' },
    { id: 'MIN', value: 'DIALOG.SELECT_FUNCTION.MIN' }];
  constructor(
    public dialogo: MatDialogRef<OPivotTableSelectFunctionDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public aggregateFunction: OPivotTableFunction) {
    this.selectedFunction = aggregateFunction.type;
  }

  public save(): void {
    this.dialogo.close({ column: this.aggregateFunction.column, type: this.selectedFunction });
  }

}
