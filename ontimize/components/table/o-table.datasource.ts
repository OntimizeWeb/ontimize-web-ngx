import { Observable } from 'rxjs/Observable';
import { DataSource } from '@angular/cdk/collections';
import { OTableDao } from './o-table.dao';
import { OTableOptions, OColumn } from './o-table.component';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class OTableDataSource extends DataSource<any> {
  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

  filteredData: any[] = [];
  renderedData: any[] = [];
  resultsLength: number = 0;

  constructor(private _database: OTableDao, private tableOptions: OTableOptions) {
    super();

  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    let displayDataChanges: any[] = [
      this._database.dataChange,
    ];

    if (this.tableOptions.filter)
      displayDataChanges.push(this._filterChange);


    return Observable.merge(...displayDataChanges).map(() => {

      this.renderedData = this._database.data;

      // Filter data
      if (this.tableOptions.filter) {
        let filterData = this.filter;
        this.renderedData = this.renderedData.slice().filter((item: any) => {
          let searchStr = this.getStringSearchable(item);
          if (!this.tableOptions.filterCanseSentive) {
            searchStr = searchStr.toLowerCase();
            filterData = filterData.toLowerCase();
          }

          return searchStr.indexOf(filterData) != -1;
        });
      }

      this.resultsLength = this.renderedData.length
      return this.renderedData;
    });

  }

  disconnect() { };

  getStringSearchable(item) {
    return this.tableOptions.columns.map(function (v: OColumn, i, a) {
      if (typeof v.searchable != 'undefined' && v.searchable
        && typeof v.visible != 'undefined' && v.visible)
        return item[v.name];
    }).join(" ");
  }

}
