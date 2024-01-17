import { AfterViewInit, Component, ElementRef, forwardRef, Inject, Injector, OnInit, Optional, SkipSelf } from '@angular/core';
import { Observable, of } from 'rxjs';

import { ServiceResponse } from '../../../interfaces/service-response.interface';
import { OQueryDataArgs } from '../../../types/query-data-args.type';
import { ServiceUtils } from '../../../util/service.utils';
import { OFormComponent } from '../../form';
import { OTreeComponent, OTreeNode } from '../o-tree.component';
import { Util } from '../../../util/util';

@Component({
  selector: 'o-tree-node',
  template: ' '
})
export class OTreeNodeComponent extends OTreeComponent implements OnInit, AfterViewInit {


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
    this.initialize();
    this.initializeParams();
    this.queryOnBind = true;
    this.queryOnInit = false;
  }

  ngAfterViewInit(): void {
    this.visibleColumnsArray = Util.parseArray(this.visibleColumns, true);
    this.quickFilterColArray = Util.parseArray(this.quickFilterColumns, true);
  }

  public queryData(parentNode: OTreeNode, filter?: any, ovrrArgs?: OQueryDataArgs): Observable<ServiceResponse> | Observable<any> {
    const queryMethodName = this.pageable ? this.paginatedQueryMethod : this.queryMethod;
    if (!this.dataService || !(queryMethodName in this.dataService) || !this.entity) {
      return of({ data: [] });
    }
    const filterParentKeys = this.getParentKeysValues();
    if (!ServiceUtils.filterContainsAllParentKeys(filterParentKeys, this._pKeysEquiv) && !this.queryWithNullParentKeys) {
      return of({ data: [] });
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
        /**  this.cd.detectChanges() is used to update loadingSubject value (this.loadingSubject.next(true); in line 377)
         *  before using the next line and so update the oTableExpandedFooter directive and display the message
         * that there are no results when the query is aborted*/
        this.cd.detectChanges();
        this.loadingSubject.next(false);
        return of({ code: 400, data: [], message: '' });
      }

      return this.dataService[queryMethodName].apply(this.dataService, this.queryArguments) as Observable<ServiceResponse>;
    }
  }


}
