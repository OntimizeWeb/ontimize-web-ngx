import { NgModule } from '@angular/core';

import { OExpandableContainerComponent } from './o-expandable-container.component';

/** @deprecated Use the standalone component directly. Import the component class instead of this module. */
@NgModule({
  imports: [OExpandableContainerComponent],
  exports: [OExpandableContainerComponent]
})
export class OExpandableContainerModule { }
