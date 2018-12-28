import { EventEmitter } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material';
import { Subject, BehaviorSubject, Observable, merge } from 'rxjs';
import { map } from 'rxjs/operators';

import { Util } from '../../util/util';
import { ColumnValueFilterOperator, IColumnValueFilter, OTableEditableRowComponent } from './extensions/header/o-table-header-components';
import { OColumn, OTableComponent, OTableOptions } from './o-table.component';
import { OTableDao } from './o-table.dao';
import { OMatSort } from './extensions/sort/o-mat-sort';

export const SCROLLVIRTUAL = 'scroll';

export interface ITableOScrollEvent {
  type: string;
  data: number;
}

export class OTableScrollEvent implements ITableOScrollEvent {
  public data: number;
  public type: string;

  constructor(data: number) {
    this.data = data;
    this.type = SCROLLVIRTUAL;
  }
}

export class OTableDataSource extends DataSource<any> {
  dataTotalsChange = new BehaviorSubject<any[]>([]);
  get data(): any[] { return this.dataTotalsChange.value; }

  protected _database: OTableDao;
  protected _paginator: MatPaginator;
  protected _tableOptions: OTableOptions;
  protected _sort: OMatSort;

  protected _quickFilterChange = new BehaviorSubject('');
  protected _columnValueFilterChange = new Subject();
  protected _loadDataScrollableChange = new BehaviorSubject<OTableScrollEvent>(new OTableScrollEvent(1));

  protected filteredData: any[] = [];
  protected aggregateData: any = {};

  onRenderedDataChange: EventEmitter<any> = new EventEmitter<any>();

  //load data in scroll
  get loadDataScrollable(): number { return this._loadDataScrollableChange.getValue().data || 1; }
  set loadDataScrollable(page: number) {
    this._loadDataScrollableChange.next(new OTableScrollEvent(page));
  }

  protected _renderedData: any[] = [];
  resultsLength: number = 0;

  get quickFilter(): string { return this._quickFilterChange.value || ''; }
  set quickFilter(filter: string) {
    this._quickFilterChange.next(filter);
  }

  private columnValueFilters: Array<IColumnValueFilter> = [];

  constructor(protected table: OTableComponent) {
    super();
    this._database = table.daoTable;
    if (table.paginator) {
      this._paginator = table.matpaginator;
    }
    this._tableOptions = table.oTableOptions;
    this._sort = table.sort;
  }

  sortFunction(a: any, b: any): number {
    return this._sort.sortFunction(a, b);
  }

  get renderedData(): any[] {
    return this._renderedData;
  }

  set renderedData(arg: any[]) {
    this._renderedData = arg;
    this.onRenderedDataChange.emit();
  }

  /**
   * Connect function called by the table to retrieve one stream containing the data to render.
   */
  connect(): Observable<any[]> {
    let displayDataChanges: any[] = [
      this._database.dataChange
    ];

    if (!this.table.pageable) {

      if (this._sort) {
        displayDataChanges.push(this._sort.oSortChange);
      }

      if (this._tableOptions.filter) {
        displayDataChanges.push(this._quickFilterChange);
      }

      if (this._paginator) {
        displayDataChanges.push(this._paginator.page);
      } else {
        displayDataChanges.push(this._loadDataScrollableChange);
      }
    }

    if (this.table.oTableColumnsFilterComponent) {
      displayDataChanges.push(this._columnValueFilterChange);
    }

    return merge(...displayDataChanges).pipe(map((x: any) => {
      let data = Object.assign([], this._database.data);
      /*
        it is necessary to first calculate the calculated columns and
        then filter and sort the data
      */
      if (x instanceof OTableScrollEvent) {
        this.renderedData = data.slice(0, (x.data * OTableComponent.LIMIT_SCROLLVIRTUAL) - 1);
      } else {
        if (this.existsAnyCalculatedColumn()) {
          data = this.getColumnCalculatedData(data);
        }

        if (!this.table.pageable) {
          data = this.getColumnValueFilterData(data);
          data = this.getQuickFilterData(data);
          data = this.getSortedData(data);
        }

        this.filteredData = Object.assign([], data);

        if (this.table.pageable) {
          const totalRecordsNumber = this.table.getTotalRecordsNumber();
          this.resultsLength = totalRecordsNumber !== undefined ? totalRecordsNumber : data.length;
        } else {
          this.resultsLength = data.length;
          data = this.getPaginationData(data);
        }

        /** in pagination virtual only show OTableComponent.LIMIT items for better performance of the table */
        if (!this.table.pageable && !this.table.paginationControls && data.length > OTableComponent.LIMIT_SCROLLVIRTUAL) {
          var datapaginate = data.slice(0, (this.table.pageScrollVirtual * OTableComponent.LIMIT_SCROLLVIRTUAL) - 1);
          data = datapaginate;
        }

        this.renderedData = data;
        // If a o-table-column-aggregate exists then emit observable
        // if (this.table.showTotals) {
        //   this.dataTotalsChange.next(this.renderedData);
        // }

        this.aggregateData = this.getAggregatesData(data);
      }
      return this.renderedData;
    }));
  }

  getAggregatesData(data: any[]): any {
    var self = this;
    var obj = {};

    if (typeof this._tableOptions === 'undefined') {
      return obj;
    }

    this._tableOptions.columns.forEach((column: OColumn) => {
      let totalValue = '';
      if (column.aggregate && column.visible) {
        totalValue = self.calculateAggregate(data, column);
      }
      var key = column.attr;
      obj[key] = totalValue;
    });

    return obj;
  }

  /**
   * Method that get value the columns calculated
   * @param data data of the database
   */
  getColumnCalculatedData(data: any[]): any[] {
    const self = this;
    const calculatedCols = this._tableOptions.columns.filter((oCol: OColumn) => oCol.visible && oCol.calculate !== undefined);
    return data.map((row: any) => {
      calculatedCols.forEach((oColumn: OColumn) => {
        let value;
        if (typeof oColumn.calculate === 'string') {
          value = self.transformFormula(oColumn.calculate, row);
        } else if (typeof oColumn.calculate === 'function') {
          value = oColumn.calculate(row);
        }
        row[oColumn.attr] = isNaN(value) ? 0 : value;
      });
      return row;
    });
  }

  protected transformFormula(formulaArg, row): string {
    let formula = formulaArg;
    // 1. replace columns by values of row
    const columnsAttr = this._tableOptions.columns.map((oCol: OColumn) => oCol.attr);
    columnsAttr.forEach((column: string) => {
      formula = formula.replace(column, row[column]);
    });

    let resultFormula = '';
    // 2. Transform formula
    try {
      resultFormula = (new Function('return ' + formula))();
    } catch (e) {
      console.log('Operation defined in the calculated column is incorrect ');
    }
    // 3. Return result
    return resultFormula;
  }

  getQuickFilterData(data: any[]): any[] {
    let filterData = this.quickFilter;
    if (filterData !== undefined && filterData.length > 0) {
      return data.filter((item: any) => {
        let searchStr = this.getStringSearchable(item);
        if (!this._tableOptions.filterCaseSensitive) {
          searchStr = searchStr.toLowerCase();
          filterData = filterData.toLowerCase();
        }
        return searchStr.indexOf(filterData) !== -1;
      });
    } else {
      return data;
    }
  }

  getPaginationData(data: any[]): any[] {
    if (!this._paginator || isNaN(this._paginator.pageSize)) {
      return data;
    }
    let startIndex = isNaN(this._paginator.pageSize) ? 0 : this._paginator.pageIndex * this._paginator.pageSize;
    if (data.length > 0 && data.length < startIndex) {
      startIndex = 0;
      this._paginator.pageIndex = 0;
    }
    return data.splice(startIndex, this._paginator.pageSize);
  }

  disconnect() {
    // TODO
  }

  protected getStringSearchable(item) {
    return this._tableOptions.columns.map((oCol: OColumn) => {
      if (oCol.searching && oCol.visible) {
        let filterValue = item[oCol.attr];
        if (oCol.renderer && oCol.renderer.getCellData) {
          filterValue = oCol.renderer.getCellData(filterValue, item);
        }
        return filterValue;
      }
    }).join(' ');
  }

  /** Returns a sorted copy of the database data. */
  protected getSortedData(data: any[]): any[] {
    return this._sort.getSortedData(data);
  }

  /**
   * Returns the data the table stores. No filters are applied.
   */
  getTableData(): any[] {
    return this._database.data;
  }

  /** Return data of the visible columns of the table without rendering */
  getCurrentData(): any[] {
    return this.getData();
  }

  getCurrentAllData(): any[] {
    return this.getAllData();
  }

  /** Return data of the visible columns of the table  rendering */
  getCurrentRendererData(): any[] {
    return this.getRenderedData(this.renderedData);
  }

  /** Return sql types of the current data */
  get sqlTypes(): any {
    return this._database.sqlTypes;
  }

  protected getData() {
    return this.renderedData;
  }

  public getRenderedData(data) {
    let self = this;
    return data.map(function (row, i, a) {
      /** render each column*/
      var obj = {};
      Object.keys(row).forEach(function (column, i, a) {
        self._tableOptions.columns.forEach(function (ocolumn: OColumn, i, a) {
          if (column === ocolumn.attr && ocolumn.visible) {
            var key = column;
            if (ocolumn.renderer && ocolumn.renderer.getCellData) {
              obj[key] = ocolumn.renderer.getCellData(row[column], row);
            } else {
              obj[key] = row[column];
            }
          }
        });
      });
      return obj;
    });
  }


  protected getAllData(render?: boolean) {
    let self = this;
    return this.filteredData.map(function (row, i, a) {
      /** render each column*/
      var obj = {};
      Object.keys(row).forEach(function (column, i, a) {
        self._tableOptions.columns.forEach(function (ocolumn: OColumn, i, a) {
          if (column === ocolumn.attr) {
            var key = column;
            if (render && ocolumn.renderer && ocolumn.renderer.getCellData) {
              obj[key] = ocolumn.renderer.getCellData(row[column], row);
            } else {
              obj[key] = row[column];
            }
          }
        });
      });
      return obj;
    });
  }

  public getColumnData(ocolumn: string) {
    return this.renderedData.map(function (row, i, a) {
      /** render each column*/
      var obj = {};
      Object.keys(row).forEach(function (column, i, a) {
        if (column === ocolumn && ocolumn) {
          var key = column;
          obj[key] = row[column];

        }
      });
      return obj;
    });
  }

  initializeColumnsFilters(filters: IColumnValueFilter[]) {
    this.columnValueFilters = [];
    filters.forEach(filter => {
      this.columnValueFilters.push(filter);
    });
    if (!this.table.pageable) {
      this._columnValueFilterChange.next();
    }
  }

  isColumnValueFilterActive(): boolean {
    return this.columnValueFilters.length !== 0;
  }

  getColumnValueFilters(): IColumnValueFilter[] {
    return this.columnValueFilters;
  }

  getColumnValueFilterByAttr(attr: string): IColumnValueFilter {
    return this.columnValueFilters.filter(item => item.attr === attr)[0];
  }

  clearColumnFilters(trigger: boolean = true) {
    this.columnValueFilters = [];
    if (trigger) {
      this._columnValueFilterChange.next();
    }
  }

  addColumnFilter(filter: IColumnValueFilter) {
    const existingFilter = this.getColumnValueFilterByAttr(filter.attr);
    if (existingFilter) {
      const idx = this.columnValueFilters.indexOf(existingFilter);
      this.columnValueFilters.splice(idx, 1);
    }

    if (
      (ColumnValueFilterOperator.IN === filter.operator && filter.values.length > 0) ||
      (ColumnValueFilterOperator.EQUAL === filter.operator && filter.values) ||
      (ColumnValueFilterOperator.BETWEEN === filter.operator && filter.values.length === 2) ||
      ((ColumnValueFilterOperator.LESS_EQUAL === filter.operator || ColumnValueFilterOperator.MORE_EQUAL === filter.operator) && filter.values)
    ) {
      this.columnValueFilters.push(filter);
    }

    // If the table is paginated, filter will be applied on remote query
    if (!this.table.pageable) {
      this._columnValueFilterChange.next();
    }
  }

  getColumnValueFilterData(data: any[]): any[] {
    this.columnValueFilters.forEach(filter => {
      switch (filter.operator) {
        case ColumnValueFilterOperator.IN:
          let filterColumn = this.table.oTableOptions.columns.filter(col => col.attr === filter.attr)[0];
          if (filterColumn) {
            data = data.filter((item: any) => {
              return (filter.values.indexOf(item[filter.attr]) !== -1);
            });
          }
          break;
        case ColumnValueFilterOperator.EQUAL:
          if (filter.values.indexOf('*') !== -1) {
            data = data.filter(item => new RegExp('^' + Util.normalizeString(filter.values).split('*').join('.*') + '$').test(Util.normalizeString(item[filter.attr])));
          } else {
            data = data.filter(item => (Util.normalizeString(item[filter.attr]).indexOf(Util.normalizeString(filter.values)) !== -1));
          }
          break;
        case ColumnValueFilterOperator.BETWEEN:
          data = data.filter(item => item[filter.attr] >= filter.values[0] && item[filter.attr] <= filter.values[1]);
          break;
        case ColumnValueFilterOperator.MORE_EQUAL:
          data = data.filter(item => item[filter.attr] >= filter.values);
          break;
        case ColumnValueFilterOperator.LESS_EQUAL:
          data = data.filter(item => item[filter.attr] <= filter.values);
          break;
      }
    });
    return data;
  }

  getAggregateData(column: OColumn) {
    var obj = {};
    var totalValue = '';

    if (typeof this._tableOptions === 'undefined') {
      return new Array(obj);
    }
    totalValue = this.aggregateData[column.attr];
    return totalValue;
  }

  calculateAggregate(data: any[], column: OColumn): any {
    let resultAggregate;
    let operator = column.aggregate.operator;
    if (typeof operator === 'string') {
      switch (operator.toLowerCase()) {
        case 'count':
          resultAggregate = this.count(column.attr, data);
          break;
        case 'min':
          resultAggregate = this.min(column.attr, data);
          break;
        case 'max':
          resultAggregate = this.max(column.attr, data);
          break;
        case 'avg':
          resultAggregate = this.avg(column.attr, data);
          break;
        default:
          resultAggregate = this.sum(column.attr, data);
          break;
      }
    } else {
      let data: any[] = this.getColumnData(column.attr);
      if (typeof operator === 'function') {
        resultAggregate = operator(data);
      }
    }
    return resultAggregate;
  }

  sum(column, data): number {
    let value = 0;
    if (data) {
      value = data.reduce(function (acumulator, currentValue) {
        return acumulator + (isNaN(currentValue[column]) ? 0 : currentValue[column]);
      }, value);
    }
    return value;
  }

  count(column, data): number {
    let value = 0;
    if (data) {
      value = data.reduce(function (acumulator, currentValue, currentIndex) {
        return acumulator + 1;
      }, 0);
    }
    return value;
  }

  avg(column, data): number {
    return this.sum(column, data) / this.count(column, data);
  }

  min(column, data): number {
    const tempMin = data.map(x => x[column]);
    return Math.min(...tempMin);
  }

  max(column, data): number {
    const tempMin = data.map(x => x[column]);
    return Math.max(...tempMin);
  }

  protected existsAnyCalculatedColumn(): boolean {
    return this._tableOptions.columns.find((oCol: OColumn) => oCol.calculate !== undefined) !== undefined;
  }

  updateRenderedRowData(rowData: any) {
    const tableKeys = this.table.getKeys();
    let record = this.renderedData.find((data: any) => {
      let found = true;
      for (let i = 0, len = tableKeys.length; i < len; i++) {
        const key = tableKeys[i];
        if (data[key] !== rowData[key]) {
          found = false;
          break;
        }
      }
      return found;
    });
    if (Util.isDefined(record)) {
      Object.assign(record, rowData);
    }
  }
}


export class OTableEditableRowDataSource extends DataSource<any> {

  protected _tableOptions: OTableOptions;
  protected _datasourceData: OTableDataSource;

  constructor(protected editableRowTable: OTableEditableRowComponent) {
    super();
    this._tableOptions = editableRowTable.oTableOptions;
    this._datasourceData = editableRowTable.tableDataSource;
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    let displayDataChanges: any[];
    if (this._datasourceData) {
      displayDataChanges = [
        this._datasourceData.dataTotalsChange
      ];
    }

    let emptyData = {};
    this._tableOptions.visibleColumns.forEach(col => {
      emptyData[col] = '';
    });

    return merge(...displayDataChanges).pipe(map(() => {
      return [emptyData];
    }));
  }

  disconnect() {
    // TODO
  }

}
