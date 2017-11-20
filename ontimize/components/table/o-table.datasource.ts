import { Observable } from 'rxjs/Observable';
import { DataSource } from '@angular/cdk/collections';
import { OTableDao } from './o-table.dao';
import { OTableOptions, OColumn, OTableComponent } from './o-table.component';
import { ITableFilterByColumnDataInterface } from './extensions/dialog/o-table-dialog-components';
import { MdSort, MdPaginator } from '@angular/material';
// import { OTablePaginatorComponent } from './extensions/footer/paginator/o-table-paginator.component';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromEvent';

export interface IColumnValueFilter {
  attr: string;
  values: any[];
}

export class OTableDataSource extends DataSource<any> {
  private _database: OTableDao;
  private _paginator: MdPaginator;
  private _tableOptions: OTableOptions;
  private _sort: MdSort;

  protected _quickFilterApplied = new BehaviorSubject('');
  protected _databaseChangeApplied = new BehaviorSubject('');
  protected _paginationChangeApplied = new BehaviorSubject('');

  protected _quickFilterChange = new BehaviorSubject('');
  protected _columnValueFilterChange = new BehaviorSubject('');

  protected filteredData: any[] = [];
  protected paginator: MdPaginator;
  renderedData: any[] = [];
  resultsLength: number = 0;

  get quickFilter(): string { return this._quickFilterChange.value; }
  set quickFilter(filter: string) {
    this._quickFilterChange.next(filter);
  }

  private columnValueFilters: Array<IColumnValueFilter> = [];

  constructor(protected table: OTableComponent) {
    super();
    this._database = table.daoTable;
    if (table.paginator) {
      this._paginator = table.paginator.mdpaginator;
    }
    this._tableOptions = table.oTableOptions;
    this._sort = table.sort;
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    let displayDataChanges: any[] = [
      this._databaseChangeApplied,
      this._sort.mdSortChange
    ];

    const self = this;

    this._database.dataChange.subscribe(() => {
      self.dataBaseDataChange();
    });

    if (this._tableOptions.filter) {
      this._quickFilterChange.subscribe(() => {
        self.applyQuickFilter();
      });
      displayDataChanges.push(this._quickFilterApplied);
    }

    if (this._paginator) {
      this._paginator.page.subscribe(() => {
        self.applyPaginationChange();
      });
      displayDataChanges.push(this._paginationChangeApplied);
    }

    if (this.table.oTableColumnsFilterComponent) {
      displayDataChanges.push(this._columnValueFilterChange);
    }

    return Observable.merge(...displayDataChanges).map(() => {
      // Sort filtered data
      this.renderedData = this.sortData(this.renderedData.slice());
      this.resultsLength = this.renderedData.length;
      return this.renderedData;
    });
  }

  dataBaseDataChange() {
    this.renderedData = this._database.data;
    this._databaseChangeApplied.next('');
  }

  applyQuickFilter() {
    let filterData = this.quickFilter;
    this.renderedData = this._database.data;
    this.renderedData = this.renderedData.slice().filter((item: any) => {
      let searchStr = this.getStringSearchable(item);
      if (!this._tableOptions.filterCaseSensitive) {
        searchStr = searchStr.toLowerCase();
        filterData = filterData.toLowerCase();
      }
      return searchStr.indexOf(filterData) !== -1;
    });
    this._quickFilterApplied.next('');
  }

  applyPaginationChange() {
    if (this._paginator && !isNaN(this._paginator.pageSize)) {
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      // let data: any = this.getDatabaseData();
      this.renderedData = this.renderedData.splice(startIndex, this._paginator.pageSize);
      this._paginationChangeApplied.next('');
    }
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
  protected sortData(data: any[]): any[] {
    if (!this._sort.active || this._sort.direction === '') { return data; }
    this._sort.sortables.forEach((value, key) => {
      this._sort.deregister(value);
    });
    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';
      [propertyA, propertyB] = [a[this._sort.active], b[this._sort.active]];

      let valueA = typeof propertyA === 'undefined' ? '' : propertyA === '' ? propertyA : isNaN(+propertyA) ? propertyA.toString().trim() : +propertyA;
      let valueB = typeof propertyB === 'undefined' ? '' : propertyB === '' ? propertyB : isNaN(+propertyB) ? propertyB.toString().trim() : +propertyB;
      return (valueA <= valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });

  }

  /**Return data of the visible columns of the table  without rendering */
  getCurrentData(): any[] {
    return this.getData();
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

  getColumnValueFilter(attr: string): IColumnValueFilter {
    return this.columnValueFilters.filter(item => item.attr === attr)[0];
  }

  clearColumnFilters() {
    this.columnValueFilters = [];
    this.applyColumnValueFilter();
  }

  addColumnFilter(filter: IColumnValueFilter) {
    const existingFilter = this.getColumnValueFilter(filter.attr);
    let triggerFiltering = false;
    if (existingFilter) {
      triggerFiltering = true;
      const idx = this.columnValueFilters.indexOf(existingFilter);
      if (filter.values.length) {
        this.columnValueFilters.splice(idx, 1, filter);
      } else {
        this.columnValueFilters.splice(idx, 1);
      }
    } else if (filter.values.length) {
      triggerFiltering = true;
      this.columnValueFilters.push(filter);
    }
    if (triggerFiltering) {
      this.applyColumnValueFilter();
    }
  }

  applyColumnValueFilter() {
    this.renderedData = this._database.data;

    this.columnValueFilters.forEach(filter => {
      let filterColumnAttr = filter.attr;
      let filterValues = filter.values;
      let filterColumn = this.table.oTableOptions.columns.filter(col => {
        return col.attr === filterColumnAttr;
      })[0];
      if (filterColumn) {
        this.renderedData = this.renderedData.slice().filter((item: any) => {
          var compareTo = this.table.oTableColumnsFilterComponent.getColumnComparisonValue(filterColumn, item[filterColumnAttr]);
          return (filterValues.indexOf(compareTo) !== -1);
        });
      }
    });
    this._columnValueFilterChange.next('');
  }


}
