import { AfterViewInit, Component, ElementRef, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatCheckboxChange, MatDialogRef, MAT_DIALOG_DATA, MatSelectionList } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { Util } from '../../../../../util/util';
import { O_DATE_INPUT_DEFAULT_FORMATS } from '../../../../input/date-input/o-date-input.component';
import { OColumn } from '../../../o-table.component';
import { ColumnValueFilterOperator, IColumnValueFilter } from '../../header/o-table-header-components';

export interface ITableFilterByColumnDataInterface {
  value: any;
  selected: boolean;
}

@Component({
  selector: 'o-table-filter-by-column-data-dialog',
  templateUrl: 'o-table-filter-by-column-data-dialog.component.html',
  styleUrls: ['o-table-filter-by-column-data-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: O_DATE_INPUT_DEFAULT_FORMATS }
  ],
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
      switch (previousFilter.operator) {
        case ColumnValueFilterOperator.LESS_EQUAL:
        case ColumnValueFilterOperator.MORE_EQUAL:
        case ColumnValueFilterOperator.BETWEEN:
        case ColumnValueFilterOperator.EQUAL:
          this.isCustomFiter = true;
          break;
        case ColumnValueFilterOperator.IN:
        default:
          this.isCustomFiter = false;
          break;
      }
    }
    if (data.hasOwnProperty('preloadValues')) {
      this.preloadValues = data.preloadValues;
    }
    if (data.columnDataArray && Array.isArray(data.columnDataArray)) {
      this.columnData = this.getDistinctValues(data.columnDataArray, previousFilter);
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
      Observable.fromEvent(this.filter.nativeElement, 'keyup')
        .debounceTime(150).distinctUntilChanged().subscribe(() => {
          let filterValue: string = self.filter.nativeElement.value;
          filterValue = Util.normalizeString(filterValue);
          self.listData = self.columnData.filter(item => (Util.normalizeString(item.value).indexOf(filterValue) !== -1));
        });
    }
  }

  getDistinctValues(data: Array<ITableFilterByColumnDataInterface>, filter: IColumnValueFilter): Array<ITableFilterByColumnDataInterface> {
    let result: Array<ITableFilterByColumnDataInterface> = [];
    const distinctValues = Array.from(new Set(data.map(item => item.value)));
    distinctValues.forEach(item => {
      result.push({
        value: item,
        selected: filter.operator === ColumnValueFilterOperator.IN && (filter.values || []).indexOf(item) !== -1
      });
    });
    this.setCustomFilterValues(filter);
    return result;
  }

  setCustomFilterValues(filter: IColumnValueFilter): void {
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
