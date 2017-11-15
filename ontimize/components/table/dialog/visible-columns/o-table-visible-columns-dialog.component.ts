import { Component, Inject, OnDestroy } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

import { DragulaService } from 'ng2-dragula/ng2-dragula';

import { OColumn } from '../../o-table.component';

export const O_TABLE_VCD_DRAGULA_BAG_NAME: string = 'o-table-vcd-list';

@Component({
  selector: 'o-table-visible-columns-dialog',
  templateUrl: 'o-table-visible-columns-dialog.component.html',
  styleUrls: ['o-table-visible-columns-dialog.component.scss']
})
export class OTableVisibleColumnsDialogComponent implements OnDestroy {

  public static O_TABLE_VCD_DRAGULA_BAG_NAME: string = O_TABLE_VCD_DRAGULA_BAG_NAME;

  columns: Array<OColumn> = [];
  protected originalColumns: Array<OColumn> = [];

  constructor(
    private dragulaService: DragulaService,
    public dialogRef: MdDialogRef<OTableVisibleColumnsDialogComponent>,
    @Inject(MD_DIALOG_DATA) data: any
  ) {
    this.dragulaService.setOptions(O_TABLE_VCD_DRAGULA_BAG_NAME, {});

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

  ngOnDestroy() {
    this.dragulaService.destroy(O_TABLE_VCD_DRAGULA_BAG_NAME);
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
