import { AfterViewInit, Component, ElementRef, Inject, ViewChild, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { MatCheckboxChange, MatDialogRef, MAT_DIALOG_DATA, MatSelectionList } from '@angular/material';
import { FormControl } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { Util } from '../../../../../util/util';
import { OColumn } from '../../../o-table.component';
import { ColumnValueFilterOperator, IColumnValueFilter } from '../../header/o-table-header-components';

export interface ITableFilterByColumnDataInterface {
  value: any;
  selected: boolean;
}

@Component({
  moduleId: module.id,
  selector: 'o-table-filter-by-column-data-dialog',
  templateUrl: 'o-table-filter-by-column-data-dialog.component.html',
  styleUrls: ['o-table-filter-by-column-data-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.o-filter-by-column-dialog]': 'true'
  }
})
export class OTableFilterByColumnDataDialogComponent implements AfterViewInit {

  column: OColumn;
  preloadValues: boolean = true;
  isCustomFiter: boolean = false;

  fcText = new FormControl();
  fcFrom = new FormControl();
  fcTo = new FormControl();

  protected columnData: Array<ITableFilterByColumnDataInterface> = [];
  protected tableData: Array<any> = [];
  protected _listData: Array<ITableFilterByColumnDataInterface>;

  @ViewChild('filter') filter: ElementRef;
  @ViewChild('filterValueList') filterValueList: MatSelectionList;

  constructor(
    public dialogRef: MatDialogRef<OTableFilterByColumnDataDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    if (data.column) {
      this.column = data.column;
    }
    let previousFilter: IColumnValueFilter = {
      attr: undefined,
      operator: undefined,
      values: undefined
    };
    if (data.previousFilter) {
      previousFilter = data.previousFilter;
      this.isCustomFiter = [ColumnValueFilterOperator.LESS_EQUAL, ColumnValueFilterOperator.MORE_EQUAL, ColumnValueFilterOperator.BETWEEN, ColumnValueFilterOperator.EQUAL].indexOf(previousFilter.operator) !== -1;
    }
    if (data.hasOwnProperty('preloadValues')) {
      this.preloadValues = data.preloadValues;
    }
    if (data.tableData && Array.isArray(data.tableData)) {
      this.getDistinctValues(data.tableData, previousFilter);
      this.initializeCustomFilterValues(previousFilter);
      this.initializeDataList(previousFilter);
    }
  }

  ngAfterViewInit() {
    this.initializeFilterEvent();
  }

  get listData(): Array<ITableFilterByColumnDataInterface> {
    return this._listData;
  }

  set listData(arg: Array<ITableFilterByColumnDataInterface>) {
    this._listData = arg;
  }

  initializeDataList(filter?: IColumnValueFilter): void {
    if (this.preloadValues || (filter && filter.operator === ColumnValueFilterOperator.IN)) {
      this.listData = this.columnData.slice();
    }
  }

  initializeFilterEvent() {
    if (this.filter) {
      const self = this;
      fromEvent(this.filter.nativeElement, 'keyup')
        .pipe(debounceTime(150))
        .pipe(distinctUntilChanged())
        .subscribe(() => {
          let filterValue: string = self.filter.nativeElement.value;
          filterValue = Util.normalizeString(filterValue);
          if (filterValue.indexOf('*') !== -1) {
            self.listData = self.columnData.filter(item => new RegExp('^' + Util.normalizeString(filterValue).split('*').join('.*') + '$').test(Util.normalizeString(item.value)));
          } else {
            self.listData = self.columnData.filter(item => (Util.normalizeString(item.value).indexOf(filterValue) !== -1));
          }
        });
    }
  }

  initializeCustomFilterValues(filter: IColumnValueFilter): void {
    if (filter.operator !== ColumnValueFilterOperator.IN) {
      if (ColumnValueFilterOperator.EQUAL === filter.operator) {
        if (this.isTextType()) {
          this.fcText.setValue(filter.values);
        }
      }
      if (filter.operator === ColumnValueFilterOperator.BETWEEN) {
        if (this.isDateType()) {
          this.fcFrom.setValue(new Date(filter.values[0]));
          this.fcTo.setValue(new Date(filter.values[1]));
        } else {
          this.fcFrom.setValue(filter.values[0]);
          this.fcTo.setValue(filter.values[1]);
        }
      } else {
        if (filter.operator === ColumnValueFilterOperator.MORE_EQUAL) {
          if (this.isDateType()) {
            this.fcFrom.setValue(new Date(filter.values));
          } else {
            this.fcFrom.setValue(filter.values);
          }
        }
        if (filter.operator === ColumnValueFilterOperator.LESS_EQUAL) {
          if (this.isDateType()) {
            this.fcTo.setValue(new Date(filter.values));
          } else {
            this.fcTo.setValue(filter.values);
          }
        }
      }
    }
  }

  get selectedValues(): Array<ITableFilterByColumnDataInterface> {
    return this.filterValueList ? this.filterValueList.selectedOptions.selected : [];
  }

  areAllSelected(): boolean {
    return this.selectedValues.length === this.columnData.length;
  }

  isIndeterminate(): boolean {
    return this.selectedValues.length > 0 && this.selectedValues.length !== this.columnData.length;
  }

  onSelectAllChange(event: MatCheckboxChange) {
    if (event.checked) {
      this.filterValueList.selectAll();
    } else {
      this.filterValueList.deselectAll();
    }
  }

  getDistinctValues(data: Array<any>, filter: IColumnValueFilter): void {
    let colValues: any[] = data.map(elem => elem[this.column.attr]);
    colValues.forEach((value, i) => {
      if (this.columnData.find(item => item.value === value) === undefined) {
        this.columnData.push({
          value: value,
          selected: filter.operator === ColumnValueFilterOperator.IN && (filter.values || []).indexOf(value) !== -1
        });
        this.tableData.push(data[i]);
      }
    });
  }

  getColumnValuesFilter(): IColumnValueFilter {
    let filter = {
      attr: this.column.attr,
      operator: undefined,
      values: undefined
    };

    if (!this.isCustomFiter) {
      if (this.selectedValues.length) {
        filter.operator = ColumnValueFilterOperator.IN;
        filter.values = this.selectedValues.map((item) => item.value);
      }
    } else {
      if (this.fcText.value) {
        filter.operator = ColumnValueFilterOperator.EQUAL;
        filter.values = this.getTypedValue(this.fcText);
      }
      if (this.fcFrom.value && this.fcTo.value) {
        filter.operator = ColumnValueFilterOperator.BETWEEN;
        let fromValue = this.getTypedValue(this.fcFrom);
        let toValue = this.getTypedValue(this.fcTo);
        filter.values = fromValue <= toValue ? [fromValue, toValue] : [toValue, fromValue];
      } else {
        if (this.fcFrom.value) {
          filter.operator = ColumnValueFilterOperator.MORE_EQUAL;
          filter.values = this.getTypedValue(this.fcFrom);
        }
        if (this.fcTo.value) {
          filter.operator = ColumnValueFilterOperator.LESS_EQUAL;
          filter.values = this.getTypedValue(this.fcTo);
        }
      }
    }
    return filter;
  }

  onSlideChange(e: Event): void {
    this.isCustomFiter = !this.isCustomFiter;
    if (!this.isCustomFiter) {
      this.initializeDataList();
      const self = this;
      setTimeout(() => {
        self.initializeFilterEvent();
      }, 0);
    }
  }

  isTextType(): boolean {
    return !this.isNumericType() && !this.isDateType();
  }

  isNumericType(): boolean {
    return ['integer', 'real', 'currency'].indexOf(this.column.type) !== -1;
  }

  isDateType(): boolean {
    return 'date' === this.column.type;
  }

  getRowValue(i: number): any {
    return this.tableData[i];
  }

  protected getTypedValue(control: FormControl): any {
    let value = control.value;
    if (this.isNumericType()) {
      value = control.value;
    }
    if (this.isDateType()) {
      value = control.value.valueOf();
    }
    return value;
  }

}
