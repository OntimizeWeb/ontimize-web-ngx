import { NgModule } from '@angular/core';

import { OColumnComponent } from './o-column.component';

/** @deprecated Use the standalone component directly. Import the component class instead of this module. */
@NgModule({
  imports: [OColumnComponent],
  exports: [OColumnComponent]
})
export class OColumnModule { }
