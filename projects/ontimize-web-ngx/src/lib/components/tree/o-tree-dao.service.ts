import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';

import { OTreeFlatNode } from './o-tree.component';

@Injectable()
export class OTreeDao {
  protected _isLoadingResults: boolean = false;
  protected loadingTimer;
  /** Stream that emits whenever the data has been modified. */
  dataChange = new BehaviorSubject<any[]>([]);
  sqlTypesChange = new BehaviorSubject<object>({});
  get data(): any[] { return this.dataChange.value; }

  rootLevelNodes: OTreeFlatNode[] = [];
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<OTreeFlatNode, any>();

  setDataArray(data: Array<any>) {
    this.dataChange.next(data);
    return of(data);
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
