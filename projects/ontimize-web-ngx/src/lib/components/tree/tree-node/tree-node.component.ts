import { AfterViewInit, Component, ElementRef, forwardRef, Inject, Injector, OnInit, Optional, SkipSelf } from '@angular/core';

import { Util } from '../../../util/util';
import { OFormComponent } from '../../form';
import { OTreeComponent } from '../o-tree.component';

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



}
