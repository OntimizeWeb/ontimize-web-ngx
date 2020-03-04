import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatCheckboxChange, MatDialogRef, MatSelectionList, MatSlideToggleChange } from '@angular/material';
import { BehaviorSubject, fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { ColumnValueFilterOperator, OColumnValueFilter } from '../../../../../types/o-column-value-filter.type';
import { TableFilterByColumnData } from '../../../../../types/o-table-filter-by-column-data.type';
import { Util } from '../../../../../util/util';
import { OColumn } from '../../../../../interfaces/o-column.interface';

@Component({
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
  mode: string;
  private isCustomFilterSubject = new BehaviorSubject<boolean>(false);
  isCustomFilter: Observable<boolean> = this.isCustomFilterSubject.asObservable();

  private isDefaultFilterSubject = new BehaviorSubject<boolean>(false);
  isDefaultFilter: Observable<boolean> = this.isDefaultFilterSubject.asObservable();

  fcText = new FormControl();
  fcFrom = new FormControl();
  fcTo = new FormControl();

  protected columnData: Array<TableFilterByColumnData> = [];
  protected tableData: Array<any> = [];
  protected _listData: Array<TableFilterByColumnData>;

  @ViewChild('filter', { static: false }) filter: ElementRef;
  @ViewChild('filterValueList', { static: false }) filterValueList: MatSelectionList;

  constructor(
    public dialogRef: MatDialogRef<OTableFilterByColumnDataDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    if (data.column) {
      this.column = data.column;
    }
    let previousFilter: OColumnValueFilter = {
      attr: undefined,
      operator: undefined,
      values: undefined
    };
    if (data.mode) {
      this.isDefaultFilterSubject.next(data.mode === 'default');
      this.isCustomFilterSubject.next(data.mode === 'custom');
      this.mode = data.mode;
    }

    if (data.previousFilter) {
      previousFilter = data.previousFilter;
      this.isCustomFilterSubject.next([ColumnValueFilterOperator.LESS_EQUAL, ColumnValueFilterOperator.MORE_EQUAL, ColumnValueFilterOperator.BETWEEN, ColumnValueFilterOperator.EQUAL].indexOf(previousFilter.operator) !== -1);
    }
    if (data.hasOwnProperty('preloadValues')) {
      this.preloadValues = data.preloadValues;
    }
    if (data.tableData && Array.isArray(data.tableData)) {
      this.tableData = data.tableData;
      this.getDistinctValues(data.tableData, previousFilter);
      this.initializeCustomFilterValues(previousFilter);
      this.initializeDataList(previousFilter);
    }
    if (data.mode) {
      this.mode = data.mode;
    }
  }

  ngAfterViewInit() {
    this.initializeFilterEvent();
  }

  get listData(): Array<TableFilterByColumnData> {
    return this._listData;
  }

  set listData(arg: Array<TableFilterByColumnData>) {
    this._listData = arg;
  }

  initializeDataList(filter?: OColumnValueFilter): void {
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

  initializeCustomFilterValues(filter: OColumnValueFilter): void {
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

  get selectedValues(): Array<TableFilterByColumnData> {
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

  getDistinctValues(data: Array<any>, filter: OColumnValueFilter): void {
    const colRenderedValues = this.getColumnDataUsingRenderer();
    const colValues: any[] = data.map(elem => elem[this.column.attr]);

    colRenderedValues.forEach((renderedValue, i) => {
      if (!this.columnData.find(item => item.renderedValue === renderedValue)) {
        this.columnData.push({
          renderedValue: renderedValue,
          value: colValues[i],
          selected: filter.operator === ColumnValueFilterOperator.IN && (filter.values || []).indexOf(renderedValue) !== -1,
          // storing the first index where this renderedValue is obtained. In the template of this component the column renderer will obtain the
          // row value of this index
          tableIndex: i
        });
      }
    });
  }

  getColumnValuesFilter(): OColumnValueFilter {
    const filter = {
      attr: this.column.attr,
      operator: undefined,
      values: undefined
    };

    if (!this.isCustomFilterSubject.getValue()) {
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
        const fromValue = this.getTypedValue(this.fcFrom);
        const toValue = this.getTypedValue(this.fcTo);
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

  onSlideChange(e: MatSlideToggleChange): void {
    this.isCustomFilterSubject.next(e.checked);

    if (!e.checked) {
      // Selection mode
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

  getFixedDimensionClass() {
    return this.mode === 'selection' || this.mode === 'default';
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

  protected getColumnDataUsingRenderer() {
    const useRenderer = this.column.renderer && this.column.renderer.getCellData;
    return this.tableData.map((row) => useRenderer ? this.column.renderer.getCellData(row[this.column.attr], row) : row[this.column.attr]);
  }
}
