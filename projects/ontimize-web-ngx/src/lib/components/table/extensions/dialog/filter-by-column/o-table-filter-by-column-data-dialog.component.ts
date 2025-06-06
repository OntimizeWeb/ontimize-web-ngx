import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { MatRadioChange } from '@angular/material/radio';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { BehaviorSubject, fromEvent, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { ServiceResponse } from '../../../../../interfaces/service-response.interface';
import { ColumnValueFilterOperator, OColumnValueFilter } from '../../../../../types/table/o-column-value-filter.type';
import { TableFilterByColumnData, TableFilterByColumnDialogResult } from '../../../../../types/table/o-table-filter-by-column-data.type';
import { Codes } from '../../../../../util/codes';
import { Util } from '../../../../../util/util';
import { OTableComponent } from '../../../o-table.component';
import { OFilterColumn } from '../../header/table-columns-filter/columns/o-table-columns-filter-column.component';

import type { OColumn } from '../../../column/o-column.class';
import { OTableFilterByColumnService } from './o-table-filter-by-column.service';
import { SelectionModel } from '@angular/cdk/collections';

const CUSTOM_FILTERS_OPERATORS = [ColumnValueFilterOperator.LESS_EQUAL, ColumnValueFilterOperator.MORE_EQUAL, ColumnValueFilterOperator.BETWEEN, ColumnValueFilterOperator.EQUAL];

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

  public acceptAction = TableFilterByColumnDialogResult.ACCEPT;
  public cancelAction = TableFilterByColumnDialogResult.CANCEL;
  public clearAction = TableFilterByColumnDialogResult.CLEAR;

  column: OColumn;
  preloadValues: boolean = true;
  mode: string;
  startView: 'month' | 'year' | 'multi-year' | '';

  public onSortFilterValuesChange: EventEmitter<OFilterColumn> = new EventEmitter();
  private readonly isCustomFilterSubject = new BehaviorSubject<boolean>(false);
  isCustomFilter: Observable<boolean> = this.isCustomFilterSubject.asObservable();

  private readonly isDefaultFilterSubject = new BehaviorSubject<boolean>(false);
  isDefaultFilter: Observable<boolean> = this.isDefaultFilterSubject.asObservable();

  fcText = new UntypedFormControl();
  fcFrom = new UntypedFormControl();
  fcTo = new UntypedFormControl();

  protected columnData: TableFilterByColumnData[] = [];
  protected tableData: any[] = [];

  private readonly listDataSubject = new BehaviorSubject<TableFilterByColumnData[]>([]);
  protected _listData: Observable<TableFilterByColumnData[]> = this.listDataSubject.asObservable();

  @ViewChild('filter') filter: ElementRef;
  @ViewChild('filterValueList') filterValueList: MatSelectionList;
  public activeSortDirection: 'asc' | 'desc' | '';
  sourceData: 'current-page' | 'all-data';
  queryByFilterColumnSubscription: any;
  table: OTableComponent;
  showFilterValuesOption: boolean;
  queryMethodName: string;
  previousFilter: OColumnValueFilter;
  selection = new SelectionModel<TableFilterByColumnData>(true, [], true, this.compareOptions());

  constructor(
    public dialogRef: MatDialogRef<OTableFilterByColumnDataDialogComponent>,
    private readonly filterService: OTableFilterByColumnService,
    @Inject(MAT_DIALOG_DATA) data: { column: OColumn; table: OTableComponent }
  ) {

    if (data.column) {
      this.column = data.column;
    }
    this.table = data.table;

    this.initialize();
  }

  private initialize() {
    this.showFilterValuesOption = this.table.paginationControls;
    this.sourceData = this.table.getSourceDataByFilterColumn(this.column);

    this.mode = this.table.oTableColumnsFilterComponent ? this.table.oTableColumnsFilterComponent.mode : 'default';
    this.isDefaultFilterSubject.next(this.mode === 'default');
    this.isCustomFilterSubject.next(this.mode === 'custom');

    this.previousFilter = this.table.dataSource.getColumnValueFilterByAttr(this.column.attr) || {
      attr: undefined,
      operator: undefined,
      values: undefined,
      availableValues: undefined,
      filterExpresion: undefined,
      filterValuesInData: this.sourceData
    };

    if (Util.isDefined(this.previousFilter.operator)) {
      this.isCustomFilterSubject.next(CUSTOM_FILTERS_OPERATORS.indexOf(this.previousFilter.operator) !== -1);
    }

    this.preloadValues = this.table.oTableColumnsFilterComponent ? this.table.oTableColumnsFilterComponent.preloadValues : true;
    this.activeSortDirection = this.table.getSortFilterColumn(this.column) || '';
    this.startView = this.table.getStartViewFilterColumn(this.column) || 'month'

    const queryMethod = this.table.oTableColumnsFilterComponent?.getQueryMethodOfFilterColumn(this.column.attr);
    if (Util.isDefined(queryMethod)) {
      this.queryMethodName = queryMethod;
      this.sourceData = 'all-data';
    }
    this.getData(this.sourceData);
  }


  private parseDataAndInitializeDataList(previousFilter: OColumnValueFilter) {

    this.columnData = this.filterService.parseListData(previousFilter, this.column, this.tableData, this.table.pageable, this.sourceData);
    if(previousFilter.values && previousFilter.values.length > 0) {
      this.selection.select(...this.columnData.filter(item => previousFilter.values.indexOf(item.value) !== -1));
    }

    if (Util.isDefined(previousFilter)) {
      this.initializeCustomFilterValues(previousFilter);
    }
    this.initializeDataList(previousFilter);

  }

  ngAfterViewInit() {
    this.initializeFilterEvent();
  }

  get listData(): Observable<TableFilterByColumnData[]> {
    return this._listData;
  }

  set listData(arg: Observable<TableFilterByColumnData[]>) {
    this._listData = arg;
  }

  protected initializeDataList(filter?: OColumnValueFilter): void {
    if (this.preloadValues || (filter && filter.operator === ColumnValueFilterOperator.IN)) {
      if (this.activeSortDirection === Codes.ASC_SORT || this.activeSortDirection === Codes.DESC_SORT) {
        this.sortData();
      } else {
        this.listDataSubject.next(this.columnData.slice());
      }
    }
  }

  protected initializeFilterEvent() {
    if (this.filter) {
      fromEvent(this.filter.nativeElement, 'keyup')
        .pipe(debounceTime(150))
        .pipe(distinctUntilChanged())
        .subscribe(() => {
          let filterValue: string = this.filter.nativeElement.value;
          filterValue = Util.normalizeString(filterValue);
          if (filterValue.indexOf('*') !== -1) {
            this.listDataSubject.next(this.columnData.filter(item => new RegExp('^' + Util.normalizeString(filterValue).split('*').join('.*') + '$').test(Util.normalizeString(item.renderedValue))));
          } else {
            this.listDataSubject.next(this.columnData.filter(item => (Util.normalizeString(item.renderedValue).indexOf(filterValue) !== -1)));
          }
        });
    }
  }

  protected initializeCustomFilterValues(filter: OColumnValueFilter): void {
    switch (true) {
      case filter.operator === ColumnValueFilterOperator.EQUAL:
        if (this.isTextType()) {
          this.fcText.setValue(filter.values);
        }
        break;
      case filter.operator === ColumnValueFilterOperator.BETWEEN:
        this.fcFrom.setValue(this.isDateType() ? new Date(filter.values[0]) : filter.values[0]);
        this.fcTo.setValue(this.isDateType() ? new Date(filter.values[1]) : filter.values[1]);
        break;
      case filter.operator === ColumnValueFilterOperator.MORE_EQUAL:
        this.fcFrom.setValue(this.isDateType() ? new Date(filter.values) : filter.values);
        break;
      case filter.operator === ColumnValueFilterOperator.LESS_EQUAL:
        this.fcTo.setValue(this.isDateType() ? new Date(filter.values) : filter.values);
        break;
      default:
        break;
    }
  }


  areAllSelected(): boolean {
    return this.selection.selected.length === this.columnData.length;
  }

  isIndeterminate(): boolean {
    const selectedValues = this.selection.selected;
    return selectedValues.length > 0 && selectedValues.length !== this.columnData.length;
  }

  onSelect(event: MatSelectionListChange) {

    event.options.forEach(option => {
      const value = option.value;

      value.selected = option.selected;
      if (option.selected) {
        this.selection.select(value);
      } else {
        this.selection.deselect(value);
      }
    });
  }

  onSelectAllChange(event: MatCheckboxChange) {
    if (event.checked) {
      this.listDataSubject.getValue().forEach(item => {
        item.selected = true;
      });
      this.selection.select(...this.listDataSubject.getValue());
    } else {
      this.listDataSubject.getValue().forEach(item => {
        item.selected = false;
      });
      this.selection.clear();
    }
  }

  getColumnValuesFilter(): OColumnValueFilter {
    const filter: OColumnValueFilter = {
      attr: this.column.attr,
      operator: undefined,
      values: undefined,
      availableValues: this.previousFilter?.availableValues || undefined,
      filterExpresion: this.previousFilter?.filterExpresion || undefined,
      filterValuesInData: this.sourceData
    };

    if (!this.isCustomFilterSubject.getValue()) {
      const selectedValues:TableFilterByColumnData[] = this.selection.selected;
      if (selectedValues.length) {
        this.filterService.applySelectedValuesToFilter(this.column, this.tableData, filter, selectedValues, this.sourceData, this.table.pageable,() => this.table.getComponentFilter());

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

  clearValues() {
    if (this.isTextType()) {
      this.fcText.setValue(undefined);
    } else if (this.isDateType() || this.isNumericType()) {
      this.fcFrom.setValue(undefined);
      this.fcTo.setValue(undefined);
    }
  }

  onClickSortValues() {
    switch (this.activeSortDirection) {
      case 'asc':
        this.activeSortDirection = 'desc';
        break;
      case 'desc':
        this.activeSortDirection = '';
        break;
      default:
        this.activeSortDirection = 'asc';
        break;
    }
    this.onSortFilterValuesChange.emit(this.getFilterColumn());
    this.sortData();
  }

  protected sortData() {
    const sortedData = Object.assign([], this.columnData);
    if (this.activeSortDirection !== '') {
      this.listDataSubject.next(sortedData.sort(this.sortFunction.bind(this)));
    } else {
      this.listDataSubject.next(sortedData);
    }

  }

  protected sortFunction(a: any, b: any): number {
    let propertyA: number | string = '';
    let propertyB: number | string = '';
    [propertyA, propertyB] = [a['value'], b['value']];

    return Util.sortFunction(propertyA, propertyB, this.activeSortDirection);
  }

  onSlideChange(e: MatSlideToggleChange): void {
    this.isCustomFilterSubject.next(e.checked);

    if (!e.checked) {
      // Selection mode
      this.initializeDataList();
      setTimeout(() => {
        this.initializeFilterEvent();
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

  getFixedDimensionClass() {
    return this.mode === 'selection' || this.mode === 'default';
  }

  getSortByAlphaIcon() {
    let icon = 'ontimize:sort_by_alpha';
    if (this.activeSortDirection !== '') {
      icon += '_' + this.activeSortDirection;
    }
    return icon;
  }

  protected getFilterColumn(): OFilterColumn {
    let obj: OFilterColumn = { attr: '', sort: '', startView: '' };
    obj.attr = this.column.attr;
    obj.sort = this.activeSortDirection;
    obj.startView = this.startView;
    return obj;
  }

  public getStartedViewDatepicker(): string {
    return this.startView;
  }

  protected getTypedValue(control: UntypedFormControl): any {
    let value = control.value;
    if (this.isNumericType()) {
      value = control.value;
    }
    if (this.isDateType()) {
      value = control.value.valueOf();
    }
    return value;
  }
  onChangeDataSource(event: MatRadioChange) {
    this.table.clearColumnFilter(this.column.attr);
    this.getData(event.value);
  }

  private getData(sourceData: string) {
    if (sourceData === 'current-page') {
      /*Get filter values on the current page*/
      this.tableData = this.table.getValue();
      this.parseDataAndInitializeDataList(this.previousFilter);

    } else if (this.table.pageable) {
      /*Get filter values on the all pages*/
      this.queryByFilterColumnSubscription = this.queryByFilterColumn(this.column.attr).subscribe((res: ServiceResponse) => {
        let data = [];
        if (res.isSuccessful()) {
          data = res.data;
        }
        this.tableData = data;
        this.parseDataAndInitializeDataList(this.previousFilter);
      });
    } else {
      this.tableData = this.table.getAllValues();
      this.parseDataAndInitializeDataList(this.previousFilter);
    }
  }
  isSelected(item: TableFilterByColumnData) {
    return item.selected;
  }

  queryByFilterColumn(attr: string): Observable<ServiceResponse> | Observable<any> {

    const kv = this.previousFilter.filterExpresion || this.table.getComponentFilter();
    const av = [attr];
    let sqlTypes = {};
    if (Util.isDefined(kv) && !Util.isObjectEmpty(kv)) {
      sqlTypes = this.table.getSqlTypes();
    }

    const columnQueryArgs = [kv, av, this.table.entity, sqlTypes, undefined, undefined, undefined];
    const queryMethodName = this.queryMethodName || Codes.QUERY_METHOD;
    const service = this.table.getService();

    if (service && (queryMethodName in service) && this.table.entity) {
      return service[queryMethodName](...columnQueryArgs)
    }
    return of({});
  }

  compareOptions(): ((o1: TableFilterByColumnData, o2: TableFilterByColumnData) => boolean) | undefined {
    return (o1: TableFilterByColumnData, o2: TableFilterByColumnData) => o1?.value === o2?.value;
  };
}
