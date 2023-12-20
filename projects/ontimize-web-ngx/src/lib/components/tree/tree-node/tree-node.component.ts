import { Component, ElementRef, forwardRef, Inject, Injector, OnInit, Optional, SkipSelf } from '@angular/core';

import { Util } from '../../../util/util';
import { OFormComponent } from '../../form';
import { OTreeComponent, OTreeNode } from '../o-tree.component';
import { ServiceUtils } from '../../../util/service.utils';
import { ServiceResponse } from '../../../interfaces/service-response.interface';
import { OQueryDataArgs } from '../../../types/query-data-args.type';
import { Observable } from 'rxjs';

@Component({
  selector: 'o-tree-node',
  template: ' ',
  inputs: [
    'parentNodeKeys:parent-node-keys'
  ]
})
export class OTreeNodeComponent extends OTreeComponent implements OnInit {

  constructor(
    public injector: Injector,
    elRef: ElementRef,
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    @Optional() @Inject(forwardRef(() => OTreeComponent)) public oTree: OTreeComponent,
    @SkipSelf() @Optional() public parentNode: OTreeNodeComponent
  ) {
    super(injector, elRef, form);
  }

  ngOnInit() {
    super.initialize();
    this.queryOnBind = true;
    this.queryOnInit = false;

    if (Util.isDefined(this.parentNode)) {
      console.log('ngOnInit - this.parentNode', this.parentNode);
      //this.parentNode.registerChildNode(this);
    } else if (Util.isDefined(this.oTree)) {
      this.oTree.registerTreeNode(this);
      console.log('ngOnInit - this.parentNode', this.oTree);
    }
  }

  public queryData(parentNode: OTreeNode, filter?: any, ovrrArgs?: OQueryDataArgs): void {
    const queryMethodName = this.pageable ? this.paginatedQueryMethod : this.queryMethod;
    if (!this.dataService || !(queryMethodName in this.dataService) || !this.entity) {
      return;
    }
    const filterParentKeys = this.getParentKeysValues();
    if (!ServiceUtils.filterContainsAllParentKeys(filterParentKeys, this._pKeysEquiv) && !this.queryWithNullParentKeys) {
      this.setData([], []);
    } else {
      if (this.querySubscription) {
        this.querySubscription.unsubscribe();
      }
      this.loadingSubject.next(true);

      // ensuring false value
      this.abortQuery.next(false);

      this.queryArguments = this.getQueryArguments(filter, ovrrArgs);

      if (this.abortQuery.value) {
        this.state.queryRecordOffset = 0;
        this.state.totalQueryRecordsNumber = 0;
        this.setDataArray(parentNode, [], []);
        /**  this.cd.detectChanges() is used to update loadingSubject value (this.loadingSubject.next(true); in line 377)
         *  before using the next line and so update the oTableExpandedFooter directive and display the message
         * that there are no results when the query is aborted*/
        this.cd.detectChanges();
        this.loadingSubject.next(false);
        return;
      }

      this.querySubscription = (this.dataService[queryMethodName].apply(this.dataService, this.queryArguments) as Observable<ServiceResponse>)
        .subscribe((res: ServiceResponse) => {
          let data;
          this.sqlTypes = undefined;
          if (Util.isArray(res)) {
            data = res;
            this.sqlTypes = {};
          } else if (res.isSuccessful()) {
            const arrData = (res.data !== undefined) ? res.data : [];
            data = Util.isArray(arrData) ? arrData : [];
            this.sqlTypes = res.sqlTypes;
            if (this.pageable) {
              this.updatePaginationInfo(res);
            }
          }

          this.setDataArray(parentNode, data);
          this.loadingSubject.next(false);
        }, err => {
          this.setDataArray(parentNode, []);
          this.loadingSubject.next(false);
          if (Util.isDefined(this.queryFallbackFunction)) {
            this.queryFallbackFunction(err);
          } else {
            this.oErrorDialogManager.openErrorDialog(err);
            console.error(err);
          }
        });
    }
  }
  setDataArray(parentNode: OTreeNode, data: any, sqlTypes?: any) {
    const index = this.oTree.dataSource.data.indexOf(parentNode.data);
    this.oTree.setDataArray(data, index+1);

  }

}
