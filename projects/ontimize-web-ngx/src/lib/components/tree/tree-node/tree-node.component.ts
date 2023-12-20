import { Component, ElementRef, forwardRef, Inject, Injector, OnInit, Optional, SkipSelf } from '@angular/core';

import { Util } from '../../../util/util';
import { OFormComponent } from '../../form';
import { OTreeComponent } from '../o-tree.component';

@Component({
  selector: 'o-tree-node',
  template: ' '
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

}
