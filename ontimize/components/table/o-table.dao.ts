import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { OServiceComponent } from '../o-service-component.class';
import { Util } from '../../util/util';


export class OTableDao {

  public isLoadingResults:boolean = false;

  /** Stream that emits whenever the data has been modified. */
  dataChange = new BehaviorSubject<any[]>([]);
  get data(): any[] { return this.dataChange.value; }


  constructor(private service: OServiceComponent, private method: any, private queryArgs: Array<any>) { }

  /**
   * Call the service query
   */
  getQuery() {

    this.isLoadingResults = false;
    let dataArray: any[];
    this.service[this.method].apply(this.service, this.queryArgs)
      .subscribe(
      res => {
        let data = undefined;
        if (Util.isArray(res)) {
          data = res;
        } else if ((res.code === 0) && Util.isArray(res.data)) {
          data = (res.data !== undefined) ? res.data : [];

        }

        this.dataChange.next(data);
        this.isLoadingResults = true;
        return Observable.of(dataArray);
      },
      err => {
        dataArray = [];
        this.dataChange.next(dataArray);
        this.isLoadingResults = true;
      }
      );

  }
}
