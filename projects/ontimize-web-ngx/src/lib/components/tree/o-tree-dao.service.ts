import { BehaviorSubject, Observable, of } from 'rxjs';

import { OQueryDataArgs } from '../../types/query-data-args.type';
import { OTreeFlatNode, OTreeNode } from './o-tree.component';

// @Injectable({
//   providedIn: 'root'
// })
export class OTreeDao {
  protected _isLoadingResults: boolean = false;
  protected loadingTimer;
  /** Stream that emits whenever the data has been modified. */
  dataChange = new BehaviorSubject<any[]>([]);
  sqlTypesChange = new BehaviorSubject<object>({});
  get data(): any[] { return this.dataChange.value; }

  constructor(
    private dataService: any,
    private entity: string,
    private methods: any
  ) { }
  rootLevelNodes:OTreeFlatNode[] = [];
  /**
   * Call the service query and emit data has ben modified
   */
  getQuery(queryArgs: OQueryDataArgs): Observable<any> {
    this.isLoadingResults = true;
    return this.dataService[this.methods.query].apply(this.dataService, queryArgs);
  }

  /** Initial data from database */
  // initialData(): OTreeFlatNode[] {
  //   return this.rootLevelNodes.map(node => new OTreeFlatNode(node.label, 0, true));
  // }

  // getChildren(node: string): string[] | undefined {
  //   return this.dataMap.get(node);
  // }

  // isExpandable(node: string): boolean {
  //   return this.dataMap.has(node);
  // }

  setDataArray(data: Array<any>) {
    this.dataChange.next(data);
    this.isLoadingResults = false;
    return of(data);
  }
  getChildren(node: Array<any>) {
    return [];
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
