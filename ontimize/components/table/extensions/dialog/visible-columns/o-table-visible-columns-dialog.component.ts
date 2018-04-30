import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { OColumn } from '../../../o-table.component';
import { DragDropService } from 'ng2-dnd';

@Component({
  selector: 'o-table-visible-columns-dialog',
  templateUrl: 'o-table-visible-columns-dialog.component.html',
  styleUrls: ['o-table-visible-columns-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DragDropService],
  host: {
    '[class.o-table-visible-columns-dialog]': 'true'
  }
})
export class OTableVisibleColumnsDialogComponent {

  columns: Array<OColumn> = [];
  protected originalColumns: Array<OColumn> = [];

  constructor(
    public dialogRef: MatDialogRef<OTableVisibleColumnsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    if (data.columnArray && Array.isArray(data.columnArray) && data.columnsData && Array.isArray(data.columnsData)) {
      data.columnsData.forEach((colData: OColumn) => {
        let column = Object.assign(new OColumn(), colData);
        this.originalColumns.push(column);
        if (data.columnArray.includes(colData.attr)) {
          this.columns.push(column);
        }
      });
    }
  }

  getVisibleColumns(): Array<string> {
    return this.columns.filter(col => col.visible).map(col => col.name);
  }

  getColumnsData(): Array<OColumn> {
    this.originalColumns.forEach(column => {
      Object.assign(column, this.columns.find(c => column.attr === c.attr));
    });
    this.originalColumns.sort((a, b) => this.columns.indexOf(a) - this.columns.indexOf(b));
    return this.originalColumns;
  }

  onClickColumn(col: OColumn): void {
    col.visible = !col.visible;
  }

}
