import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA, MdCheckboxChange } from '@angular/material';
import { IColumnValueFilter } from '../../../o-table.datasource';
// import { OColumn } from '../../../o-table.component';

export interface ITableFilterByColumnDataInterface {
  value: any;
  selected: boolean;
}

@Component({
  selector: 'o-table-filter-by-column-data-dialog',
  templateUrl: 'o-table-filter-by-column-data-dialog.component.html',
  styleUrls: ['o-table-filter-by-column-data-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OTableFilterByColumnDataDialogComponent {

  attr: string;
  columnData: Array<ITableFilterByColumnDataInterface> = [];

  constructor(
    public dialogRef: MdDialogRef<OTableFilterByColumnDataDialogComponent>,
    @Inject(MD_DIALOG_DATA) data: any
  ) {
    if (data.columnAttr) {
      this.attr = data.columnAttr;
    }
    let previousFilter: IColumnValueFilter = {
      attr: undefined,
      values: undefined
    };
    if (data.previousFilter) {
      previousFilter = data.previousFilter;
    }
    if (data.columnDataArray && Array.isArray(data.columnDataArray)) {
      this.columnData = this.getDistinctValues(data.columnDataArray, previousFilter);
    }
  }

  getDistinctValues(data: Array<ITableFilterByColumnDataInterface>, previousFilter: IColumnValueFilter): Array<ITableFilterByColumnDataInterface> {
    let result: Array<ITableFilterByColumnDataInterface> = [];
    const distinctValues = Array.from(new Set(data.map(item => item.value)));
    distinctValues.forEach(item => {
      result.push({
        value: item,
        selected: (previousFilter.values || []).indexOf(item) !== -1
      });
    });
    return result;
  }

  get selectedValues(): Array<ITableFilterByColumnDataInterface> {
    return this.columnData.filter(item => item.selected);
  }

  areAllSelected(): boolean {
    return this.selectedValues.length === this.columnData.length;
  }

  isIndeterminate(): boolean {
    return this.selectedValues.length > 0 && this.selectedValues.length !== this.columnData.length;
  }

  onSelectAllChange(event: MdCheckboxChange) {
    this.columnData.forEach((item: ITableFilterByColumnDataInterface) => {
      item.selected = event.checked;
    });
  }

  getColumnValuesFilter(): IColumnValueFilter {
    return {
      attr: this.attr,
      values: this.selectedValues.map((item) => item.value)
    };
  }
}
