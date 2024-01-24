import { OTreeNodeComponent } from './tree-node/tree-node.component';
import { CdkTreeModule } from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../shared/shared.module';
import { OTreeComponent } from './o-tree.component';
import { OSearchInputModule } from '../input/search-input/o-search-input.module';
import { MatTreeModule } from '@angular/material/tree';
import { OTreeMenuComponent } from './header/tree-menu/o-tree-menu.component';

@NgModule({
  declarations: [OTreeNodeComponent,OTreeComponent, OTreeMenuComponent],
  imports: [CommonModule, OSearchInputModule, OSharedModule, CdkTreeModule, MatTreeModule],
  exports: [OTreeComponent, OTreeNodeComponent],
})
export class OTreeModule { }
