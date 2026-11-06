import { NgModule } from '@angular/core';

import { OTreeComponent } from './o-tree.component';
import { OTreeMenuComponent } from './header/tree-menu/o-tree-menu.component';
import { OTreeNodeComponent } from './tree-node/tree-node.component';

/** @deprecated Use the standalone component directly. Import the component class instead of this module. */
@NgModule({
  imports: [OTreeNodeComponent, OTreeComponent, OTreeMenuComponent],
  exports: [OTreeComponent, OTreeNodeComponent],
})
export class OTreeModule { }
