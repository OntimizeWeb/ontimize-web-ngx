import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../../shared/shared.module';
import { OColumnCollapsibleComponent } from './o-column-collapsible.component';

@NgModule({
  declarations: [OColumnCollapsibleComponent],
  imports: [CommonModule, OSharedModule],
  exports: [OColumnCollapsibleComponent]
})
export class OColumnCollapsibleModule { }
