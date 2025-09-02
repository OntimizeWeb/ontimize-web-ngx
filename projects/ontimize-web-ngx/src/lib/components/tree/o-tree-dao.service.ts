import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { OTreeFlatNode } from '../../types/tree-flat-node.type';
import { ServiceResponse } from '../../interfaces/service-response.interface';
import { ServiceUtils } from '../../util/service.utils';
import { Util } from '../../util/util';


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

  queryNodeChildren(flatNode: OTreeFlatNode, recursive:boolean): Observable<ServiceResponse> {
    const component = recursive ? flatNode.node : flatNode.childNode;
    const queryMethodName = component.pageable
      ? component.paginatedQueryMethod
      : component.queryMethod;


    const entity = component.entity;
    const service: any = component.getDataService();

    if (!service || !(queryMethodName in service) || !entity) {
      return of({ data: [] } as ServiceResponse);
    }

    let filter;
    if (component.recursive) {
      const parentItem = ServiceUtils.getParentKeysFromForm(component.getParentKeysEquivalence(), component.getForm());
      filter = parentItem ?? {};
      filter[component.parentColumn] = flatNode.data[component.getKeys()[0]];
    } else {
      filter = ServiceUtils.getFilterUsingParentKeys(
        flatNode.data,
        flatNode.childNode.getParentKeysEquivalence()
      );
    }

    const queryArgs = [
      filter,
      Util.parseArray(component.columns, true),
      component.entity,
      null,
      flatNode.offset ?? 0,
      component.recursive ? component.queryRows : flatNode.childNode.queryRows
    ];

    return service[queryMethodName](...queryArgs) as Observable<ServiceResponse>;
  }

}
