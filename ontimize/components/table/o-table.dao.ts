import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Util } from '../../util/util';
import { Injector } from '@angular/core';
import { OntimizeService } from '../../services';


export class OTableDao {

  public isLoadingResults: boolean = false;

  /** Stream that emits whenever the data has been modified. */
  dataChange = new BehaviorSubject<any[]>([]);
  get data(): any[] { return this.dataChange.value; }
  dataService: any;

  constructor(private injector: Injector, private service: string, private entity: string, private method: any) {
    this.configureService();
  }

  /**
  * Method what its configure  call service
  */
  configureService() {

    this.dataService = this.injector.get(OntimizeService);

    if (Util.isDataService(this.service)) {
      let serviceCfg = this.dataService.getDefaultServiceConfiguration(this.service);
      if (this.entity) {
        serviceCfg['entity'] = this.entity;
      }
      this.dataService.configureService(serviceCfg);
    }
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
