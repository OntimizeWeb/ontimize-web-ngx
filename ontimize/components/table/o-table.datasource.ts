import { Observable } from 'rxjs/Observable';
import { DataSource } from '@angular/cdk/collections';
import { OTableDao } from './o-table.dao';
import { OTableOptions, OColumn, OTableComponent } from './o-table.component';
import { MatSort, MatPaginator } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromEvent';

import { ITableFilterByColumnDataInterface } from './extensions/dialog/o-table-dialog-components';
import { OTableAggregateComponent } from './extensions/footer/o-table-footer-components';
import { IColumnValueFilter, OTableEditableRowComponent } from './extensions/header/o-table-header-components';

export class OTableDataSource extends DataSource<any> {

  dataTotalsChange = new BehaviorSubject<any[]>([]);
  get data(): any[] { return this.dataTotalsChange.value; }

  protected _database: OTableDao;
  protected _paginator: MatPaginator;
  protected _tableOptions: OTableOptions;
  protected _sort: MatSort;

  protected _quickFilterChange = new BehaviorSubject('');
  protected _columnValueFilterChange = new BehaviorSubject('');

  protected filteredData: any[] = [];
  protected paginator: MatPaginator;
  renderedData: any[] = [];
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
    if (this.table.oTableColumnsFilterComponent) {
      this.initializeColumnsFilters();
    }
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    let displayDataChanges: any[] = [
      this._database.dataChange
    ];

    if (!this.table.pageable) {
      displayDataChanges.push(this._sort.sortChange);

      if (this._tableOptions.filter) {
        displayDataChanges.push(this._quickFilterChange);
      }

      if (this._paginator) {
        displayDataChanges.push(this._paginator.page);
      }
    }

    if (this.table.oTableColumnsFilterComponent) {
      displayDataChanges.push(this._columnValueFilterChange);
    }

    return Observable.merge(...displayDataChanges).map(() => {
      let data = this._database.data;

      data = this.getColumnValueFilterData(data);

      if (!this.table.pageable) {
        data = this.getQuickFilterData(data);
        data = this.getSortedData(data);
      }
      data = this.getColumnCalculatedData(data);
      this.filteredData = Object.assign([], data);

      if (this.table.pageable) {
        const totalRecordsNumber = this.table.getTotalRecordsNumber();
        this.resultsLength = totalRecordsNumber !== undefined ? totalRecordsNumber : data.length;
      } else {
        this.resultsLength = data.length;
        data = this.getPaginationData(data);
      }
      this.renderedData = data;
      //if exist one o-table-column-aggregate then emit observable
      if (this.table.showTotals) {
        this.dataTotalsChange.next(this.renderedData);
      }
      //this.resultsLength = this.renderedData.length;
      return this.renderedData;
    });
  }

  /**
   * Method that get value the columns calculated
   * @param data data of the database
   */
  getColumnCalculatedData(data: any[]): any[] {
    let self = this;

    return data.map(function (row) {
      self._tableOptions.columns.map(function (ocolumn: OColumn) {

        if (ocolumn.visible && ocolumn.calculate) {
          var key = ocolumn.attr;
          let operator_calculated = ocolumn.calculate;
          let value;
          if (typeof operator_calculated === 'string') {
            value = self.transformFormula(ocolumn.calculate, row);
          } else {
            if (typeof operator_calculated === 'function') {
              value = operator_calculated(row);
            }
          }
          row[key] = isNaN(value) ? 0 : value;
        }
      });
      return row;
    });
  }

  protected transformFormula(formula, row): string {
    //1. replace columns by values of row
    this._tableOptions.visibleColumns.map(function (column) {
      formula = formula.replace(column, row[column]);
    });

    let resultFormula = '';
    //2. Transform formula
    try {
      resultFormula = (new Function('return ' + formula))();
    } catch (e) {
      console.log('Operation defined in the calculated column is incorrect ');
    }
    //3. Return result
    return resultFormula;
  }

  getQuickFilterData(data: any[]): any[] {
    let filterData = this.quickFilter;
    return data.filter((item: any) => {
      let searchStr = this.getStringSearchable(item);
      if (!this._tableOptions.filterCaseSensitive) {
        searchStr = searchStr.toLowerCase();
        filterData = filterData.toLowerCase();
      }
      return searchStr.indexOf(filterData) !== -1;
    });
  }

  getPaginationData(data: any[]): any[] {
    if (!this._paginator || isNaN(this._paginator.pageSize)) {
      return data;
    }
    let startIndex = isNaN(this._paginator.pageSize) ? 0 : this._paginator.pageIndex * this._paginator.pageSize;
    if (data.length < startIndex) {
      startIndex = 0;
      this._paginator.pageIndex = 0;
    }
    return data.splice(startIndex, this._paginator.pageSize);
  }

  disconnect() {
    // TODO
  }

  protected getStringSearchable(item) {
    return this._tableOptions.columns.map(function (v: OColumn, i, a) {
      if (typeof v.searchable !== 'undefined' && v.searchable && typeof v.visible !== 'undefined' && v.visible) {
        if (v.renderer && v.renderer.getCellData) {
          return v.renderer.getCellData(item[v.name]);
        } else {
          return item[v.name];
        }
      }
    }).join(' ');
  }

  /** Returns a sorted copy of the database data. */
  protected getSortedData(data: any[]): any[] {
    if (!this._sort.active || this._sort.direction === '') { return data; }
    this._sort.sortables.forEach((value, key) => {
      this._sort.deregister(value);
    });
    return data.sort(this.sortFunction.bind(this));
  }

  protected sortFunction(a: any, b: any) {
    let propertyA: number | string = '';
    let propertyB: number | string = '';
    [propertyA, propertyB] = [a[this._sort.active], b[this._sort.active]];

    let valueA = typeof propertyA === 'undefined' ? '' : propertyA === '' ? propertyA : isNaN(+propertyA) ? propertyA.toString().trim().toLowerCase() : +propertyA;
    let valueB = typeof propertyB === 'undefined' ? '' : propertyB === '' ? propertyB : isNaN(+propertyB) ? propertyB.toString().trim().toLowerCase() : +propertyB;
    return (valueA <= valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
  }

  /**Return data of the visible columns of the table  without rendering */
  getCurrentData(): any[] {
    return this.getData();
  }

  getCurrentAllData(): any[] {
    return this.getAllData();
  }

  /**Return data of the visible columns of the table  rendering */
  getCurrentRendererData(): any[] {
    return this.getData(true);

  }

  /**Return sql types of the current data */
  get sqlTypes(): any {
    return this._database.sqlTypes;
  }

  protected getData(render?: boolean) {
    let self = this;

    return this.renderedData.map(function (row, i, a) {
      /** render each column*/
      var obj = {};
      Object.keys(row).map(function (column, i, a) {
        self._tableOptions.columns.map(function (ocolumn: OColumn, i, a) {
          if (column === ocolumn.attr && ocolumn.visible) {
            var key = column;
            if (render && ocolumn.renderer && ocolumn.renderer.getCellData) {
              obj[key] = ocolumn.renderer.getCellData(row[column]);
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
      Object.keys(row).map(function (column, i, a) {
        self._tableOptions.columns.map(function (ocolumn: OColumn, i, a) {
          if (column === ocolumn.attr) {
            var key = column;
            if (render && ocolumn.renderer && ocolumn.renderer.getCellData) {
              obj[key] = ocolumn.renderer.getCellData(row[column]);
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
      Object.keys(row).map(function (column, i, a) {
        if (column === ocolumn && ocolumn) {
          var key = column;
          obj[key] = row[column];

        }
      });
      return obj;
    });
  }

  initializeColumnsFilters() {
    const storedFilters = this.table.getStoredColumnsFilters();
    storedFilters.forEach(filter => {
      this.columnValueFilters.push(filter);
    });
  }

  getColumnDataToFilter(column: OColumn, table: OTableComponent): ITableFilterByColumnDataInterface[] {
    const tableColumnsFilter = table.oTableColumnsFilterComponent;
    const attr = column.attr;
    let rowArray: ITableFilterByColumnDataInterface[] = [];
    // TODO multiple filters
    this._database.data.map((row, i, a) => {
      let value = tableColumnsFilter.getColumnComparisonValue(column, row[attr]);
      rowArray.push({
        value: value,
        selected: false
      });
    });
    return rowArray;
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

  clearColumnFilters() {
    this.columnValueFilters = [];
    this._columnValueFilterChange.next('');
  }

  addColumnFilter(filter: IColumnValueFilter) {
    const existingFilter = this.getColumnValueFilterByAttr(filter.attr);
    if (existingFilter) {
      const idx = this.columnValueFilters.indexOf(existingFilter);
      this.columnValueFilters.splice(idx, 1);
    }
    if (filter.values.length) {
      this.columnValueFilters.push(filter);
    }
    if (existingFilter || filter.values.length) {
      this._columnValueFilterChange.next('');
    }
  }

  getColumnValueFilterData(data: any[]): any[] {
    this.columnValueFilters.forEach(filter => {
      let filterColumnAttr = filter.attr;
      let filterValues = filter.values;
      let filterColumn = this.table.oTableOptions.columns.filter(col => {
        return col.attr === filterColumnAttr;
      })[0];
      if (filterColumn) {
        data = data.filter((item: any) => {
          var compareTo = this.table.oTableColumnsFilterComponent.getColumnComparisonValue(filterColumn, item[filterColumnAttr]);
          return (filterValues.indexOf(compareTo) !== -1);
        });
      }
    });
    return data;
  }
}

export class OTableTotalDataSource extends DataSource<any> {

  private _tableOptions: OTableOptions;
  private _datasourceData: OTableDataSource;
  constructor(table: OTableAggregateComponent) {
    super();
    this._tableOptions = table.oTableOptions;
    this._datasourceData = table.dataSource;
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    let displayDataChanges: any[];
    if (this._datasourceData) {
      displayDataChanges = [
        this._datasourceData.dataTotalsChange
      ];
    }
    return Observable.merge(...displayDataChanges).map(() => {
      let data = this._datasourceData.data;
      data = this.getTotals(data);
      return data;
    });
  }

  getTotals(data: any[]): any[] {
    var self = this;
    var obj = {};

    if (typeof this._tableOptions === 'undefined') {
      return new Array(obj);
    }

    this._tableOptions.columns.map(function (column, i) {
      let totalValue: number = 0;
      if (column.aggregate && column.visible) {
        totalValue = self.calculateAggregate(data, column);
      } else {
        return '';
      }
      var key = column.attr;
      if (totalValue > 0) {
        obj[key] = totalValue;
      } else {
        obj[key] = '';
      }
      return obj;
    });
    return new Array(obj);
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
      let data: any[] = this._datasourceData.getColumnData(column.attr);
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
        //console.log(acumulator, currentValue[column]);
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

  disconnect() {
    // TODO
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

    return Observable.merge(...displayDataChanges).map(() => {
      return [emptyData];
    });
  }

  disconnect() {
    // TODO
  }
}
