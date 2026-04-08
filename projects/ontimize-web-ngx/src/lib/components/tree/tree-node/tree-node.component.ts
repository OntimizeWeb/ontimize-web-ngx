import { AfterViewInit, Component, ElementRef, forwardRef, Inject, Injector, OnInit, Optional, SkipSelf } from '@angular/core';

import { OntimizeServiceProvider } from '../../../services/factories';
import { Util } from '../../../util/util';
import { OFormComponent } from '../../form';
import { OTreeComponent } from '../o-tree.component';
import { O_TREE_NODE_TOKEN } from '../o-tree-tokens';

@Component({
  standalone: true,
  imports: [],
  selector: 'o-tree-node',
  template: ' ',
  providers: [
    OntimizeServiceProvider,
    { provide: O_TREE_NODE_TOKEN, useExisting: forwardRef(() => OTreeNodeComponent) }
  ]
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



}
