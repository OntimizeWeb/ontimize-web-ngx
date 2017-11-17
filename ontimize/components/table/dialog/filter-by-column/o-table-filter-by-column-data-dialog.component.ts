import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA, MdCheckboxChange } from '@angular/material';

// import { OColumn } from '../../o-table.component';

export interface ITableFilterByColumnDataInterface {
  value: any;
  renderedValue: any;
}

@Component({
  selector: 'o-table-filter-by-column-data-dialog',
  templateUrl: 'o-table-filter-by-column-data-dialog.component.html',
  styleUrls: ['o-table-filter-by-column-data-dialog.component.scss'],
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class OTableFilterByColumnDataDialogComponent {

  attr: string;
  columnData: Array<ITableFilterByColumnDataInterface> = [];
  // protected originalColumns: Array<OColumn> = [];

  selectedValues = [];

  constructor(
    public dialogRef: MdDialogRef<OTableFilterByColumnDataDialogComponent>,
    @Inject(MD_DIALOG_DATA) data: any
  ) {
    // if (data.columnsData && Array.isArray(data.columnsData)) {

    // }
    if (data.columnAttr) {
      this.attr = data.columnAttr;
    }
    if (data.columnDataArray && Array.isArray(data.columnDataArray)) {
      this.columnData = data.columnDataArray;
    }
    //   data.columnsData.forEach((colData: OColumn) => {
    //     let column = Object.assign(new OColumn(), colData);
    //     this.originalColumns.push(column);
    //     if (data.columnArray.includes(colData.attr)) {
    //       this.columns.push(column);
    //     }
    //   });
  }

  areAllSelected(): boolean {
    return this.selectedValues.length === this.columnData.length;
  }

  isIndeterminate(): boolean {
    return this.selectedValues.length > 0 && this.selectedValues.length !== this.columnData.length;
  }

  onSelectAllChange(event: MdCheckboxChange) {
    let selected = [];
    if (event.checked) {
      this.columnData.forEach((item: ITableFilterByColumnDataInterface) => {
        selected.push(item);
      });
    }
    this.selectedValues = selected;
  }

  isRecordChecked(record: ITableFilterByColumnDataInterface): boolean {
    return this.selectedValues.indexOf(record) !== -1;
  }

  onRecordSelectionChange(event: MdCheckboxChange, record: ITableFilterByColumnDataInterface) {
    if (event.checked) {
      this.selectedValues.push(record);
    } else {
      this.selectedValues.splice(this.selectedValues.indexOf(record), 1);
    }
  }
}
