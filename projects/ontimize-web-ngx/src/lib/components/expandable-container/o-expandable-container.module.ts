import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../shared/shared.module';
import { OExpandableContainerComponent } from './o-expandable-container.component';

@NgModule({
  imports: [CommonModule, OSharedModule],
  exports: [OExpandableContainerComponent],
  declarations: [
   OExpandableContainerComponent
  ],

})
export class OExpandableContainerModule { }
