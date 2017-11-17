import { Observable } from 'rxjs/Observable';
import { DataSource } from '@angular/cdk/collections';
import { OTableDao } from './o-table.dao';
import { OTableOptions, OColumn } from './o-table.component';
import { ITableFilterByColumnDataInterface } from './extensions/dialog/o-table-dialog-components';
import { MdSort, MdPaginator } from '@angular/material';
import { OTablePaginatorComponent } from './extensions/footer/paginator/o-table-paginator.component';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromEvent';


export class OTableDataSource extends DataSource<any> {


  protected _filterChange = new BehaviorSubject('');
  protected _sqlTypes: any;
  protected filteredData: any[] = [];
  protected paginator: MdPaginator;
  renderedData: any[] = [];
  resultsLength: number = 0;


  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

  constructor(private _database: OTableDao, private _paginator: OTablePaginatorComponent, private tableOptions: OTableOptions, private _sort: MdSort) {
    super();
    this.paginator = _paginator ? _paginator.mdpaginator : null;
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    let displayDataChanges: any[] = [
      this._database.dataChange,
      this._sort.mdSortChange
    ];

    if (this.tableOptions.filter) {
      displayDataChanges.push(this._filterChange);
    }
    if (this.paginator) {
      displayDataChanges.push(this.paginator.page);
    }

    return Observable.merge(...displayDataChanges).map(() => {

      let data: any = this._database.data;
      this.renderedData = data.data ? data.data : [];
      this._sqlTypes = data.sqlTypes ? data.sqlTypes : [];

      // Filter data
      if (this.tableOptions.filter) {
        let filterData = this.filter;
        this.renderedData = this.renderedData.slice().filter((item: any) => {
          let searchStr = this.getStringSearchable(item);
          if (!this.tableOptions.filterCaseSensitive) {
            searchStr = searchStr.toLowerCase();
            filterData = filterData.toLowerCase();
          }

          return searchStr.indexOf(filterData) !== -1;
        });
      }

      // Sort filtered data
      if (this.paginator && !isNaN(this.paginator.pageSize)) {
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        this.renderedData = this.renderedData.splice(startIndex, this.paginator.pageSize);
      } else {
        this.renderedData = this.sortData(this.renderedData.slice());
      }

      this.resultsLength = this.renderedData.length;
      return this.renderedData;
    });



  }

  disconnect() { }

  protected getStringSearchable(item) {
    return this.tableOptions.columns.map(function (v: OColumn, i, a) {
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
    return this._sqlTypes;
  }

  protected getData(render?: boolean) {
    let self = this;

    return this.renderedData.map(function (row, i, a) {
      /** render each column*/
      var obj = {};
      Object.keys(row).map(function (column, i, a) {
        self.tableOptions.columns.map(function (ocolumn: OColumn, i, a) {
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

  getColumnDataToFilter(column: OColumn): ITableFilterByColumnDataInterface[] {
    const attr = column.attr;
    let rowArray: ITableFilterByColumnDataInterface[] = [];
    this.renderedData.map((row, i, a) => {
      rowArray.push({
        value: row[attr],
        renderedValue: column.renderer ? column.renderer.getCellData(row[attr]) : row[attr]
      });
    });
    return rowArray;
  }

}
