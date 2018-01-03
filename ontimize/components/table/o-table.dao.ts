import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class OTableDao {

  public isLoadingResults: boolean = false;

  /** Stream that emits whenever the data has been modified. */
  dataChange = new BehaviorSubject<any[]>([]);
  sqlTypesChange = new BehaviorSubject<Object>({});
  get data(): any[] { return this.dataChange.value; }
  get sqlTypes(): Object { return this.sqlTypesChange.value; }

  constructor(private dataService: any, private entity: string, private method: any) {
  }

  /**
   * Call the service query and emit data has ben modified
   */
  getQuery(queryArgs: any): Observable<any> {
    this.isLoadingResults = false;
    return this.dataService[this.method].apply(this.dataService, queryArgs);

  }

  removeQuery(deletedMethod: string, filters: any): Observable<any> {
    return (Observable as any).from(filters).map(kv => this.dataService[deletedMethod](kv, this.entity)).mergeAll();
  }
  /**
   * set data array and emit data has ben modified
   * @param data
   */
  setDataArray(data: Array<any>) {
    this.dataChange.next(data);
    this.isLoadingResults = true;
    return Observable.of(data);
  }

  setAsincronColumn(value: Array<any>, rowData: any) {
    //Object.assign(this.data[rowIndex], value);
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
}
