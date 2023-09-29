import { BehaviorSubject, merge, Observable, of } from 'rxjs';

import { OQueryDataArgs } from '../../../types/query-data-args.type';


export class OTableDao {

  usingStaticData: boolean = false;

  protected loadingTimer;
  protected _isLoadingResults: boolean = false;

  /** Stream that emits whenever the data has been modified. */
  dataChange = new BehaviorSubject<any[]>([]);
  sqlTypesChange = new BehaviorSubject<object>({});
  get data(): any[] { return this.dataChange.value; }
  get sqlTypes(): object { return this.sqlTypesChange.value; }

  constructor(
    private dataService: any,
    private entity: string,
    private methods: any
  ) { }

  /**
   * Call the service query and emit data has ben modified
   */
  getQuery(queryArgs: OQueryDataArgs): Observable<any> {
    this.isLoadingResults = true;
    return this.dataService[this.methods.query].apply(this.dataService, queryArgs);
  }

  removeQuery(filters: any, sqlTypes?: object): Observable<any> {
    return merge(...filters.map((kv => this.dataService[this.methods.delete](kv, this.entity, sqlTypes))));
  }

  insertQuery(av: object, sqlTypes?: object): Observable<any> {
    if (this.usingStaticData) {
      this.data.push(av);
      return of(this.data);
    } else {
      return this.dataService[this.methods.insert](av, this.entity, sqlTypes);
    }
  }

  updateQuery(kv: object, av: object, sqlTypes?: object): Observable<any> {
    if (this.usingStaticData) {
      // Only to simulate the service response, the model change is done in the editor
      return of([]);
    } else {
      return this.dataService[this.methods.update](kv, av, this.entity, sqlTypes);
    }
  }

  /**
   * Set data array and emit data has ben modified
   * @param data
   */
  setDataArray(data: Array<any>) {
    this.dataChange.next(data);
    this.isLoadingResults = false;
    return of(data);
  }

  setAsynchronousColumn(value: Array<any>, rowData: any) {
    // Object.assign(this.data[rowIndex], value);
    let index = null;
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i] === rowData) {
        index = i;
        break;
      }
    }
    if (index !== null) {
      Object.assign(this.data[index], value);
    }
  }

  get isLoadingResults(): boolean {
    return this._isLoadingResults;
  }

  set isLoadingResults(val: boolean) {
    if (val) {
      this.cleanTimer();
      this.loadingTimer = setTimeout(() => {
        this._isLoadingResults = val;
      }, 500);
    } else {
      this.cleanTimer();
      this._isLoadingResults = val;
    }
  }

  protected cleanTimer() {
    if (this.loadingTimer) {
      clearTimeout(this.loadingTimer);
    }
  }

}
