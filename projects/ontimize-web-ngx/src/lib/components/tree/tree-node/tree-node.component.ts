import { AfterViewInit, Component, ElementRef, forwardRef, Inject, Injector, OnInit, Optional, SkipSelf } from '@angular/core';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

import { ServiceResponse } from '../../../interfaces/service-response.interface';
import { OntimizeServiceProvider } from '../../../services/factories';
import { ServiceUtils } from '../../../util/service.utils';
import { Util } from '../../../util/util';
import { OFormComponent } from '../../form';
import { OTreeComponent } from '../o-tree.component';
import { OTreeFlatNode } from '../../../types/tree-flat-node.type';

@Component({
  selector: 'o-tree-node',
  template: ' ',
  providers: [OntimizeServiceProvider]
})
export class OTreeNodeComponent extends OTreeComponent implements OnInit, AfterViewInit {

  constructor(
    public injector: Injector,
    elementRef: ElementRef,
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    @Optional() @Inject(forwardRef(() => OTreeComponent)) public parentComponent: OTreeComponent,
    @SkipSelf() @Optional() public parentNode: OTreeNodeComponent
  ) {
    super(injector, elementRef, form);
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
    this.setDatasource();
  }


  public childQueryData(flatNode: OTreeFlatNode): Observable<ServiceResponse> | Observable<any> {
    const queryMethodName = flatNode.node.pageable ? this.paginatedQueryMethod : this.queryMethod;
    if (!this.dataService || !(queryMethodName in this.dataService) || !this.entity) {
      return of({ data: [] });
    }
    const parentItem = ServiceUtils.getParentKeysFromForm(this._pKeysEquiv, this.form);
    let filter
    if (this.recursive) {
      filter = parentItem ?? {};
      filter[this.parentColumn] = flatNode.data[this.keysArray[0]]
    } else {
      filter = ServiceUtils.getFilterUsingParentKeys(flatNode.data, flatNode.childNode._pKeysEquiv);
    }

    let queryArguments = [filter, this.colArray, this.entity, null, flatNode.offset??0, flatNode.childNode.queryRows];

    return this.dataService[queryMethodName](...queryArguments) as Observable<ServiceResponse>;
  }
}
