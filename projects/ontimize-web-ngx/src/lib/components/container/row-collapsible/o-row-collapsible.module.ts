import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../../shared/shared.module';
import { ORowCollapsibleComponent } from './o-row-collapsible.component';

@NgModule({
  declarations: [ORowCollapsibleComponent],
  imports: [CommonModule, OSharedModule],
  exports: [ORowCollapsibleComponent]
})
export class ORowCollapsibleModule { }
