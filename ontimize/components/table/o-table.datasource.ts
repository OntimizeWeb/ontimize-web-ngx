import { Observable } from 'rxjs/Observable';
import { DataSource } from '@angular/cdk/collections';
import { OTableDao } from './o-table.dao';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class OTableDataSource extends DataSource<any> {
  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

  resultsLength: number = 0;

  constructor(private _database: OTableDao) {
    super();
   
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    return this._database.dataChange;

  }

  disconnect() { };

 


}
