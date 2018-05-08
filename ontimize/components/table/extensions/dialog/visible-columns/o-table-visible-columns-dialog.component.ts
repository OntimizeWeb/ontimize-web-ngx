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
      data.columnArray.forEach(colAttr => {
        const oColData = data.columnsData.find((oCol: OColumn) => oCol.attr === colAttr);
        if (oColData) {
          let column = Object.assign(new OColumn(), oColData);
          this.originalColumns.push(column);
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
