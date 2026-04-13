import { NgModule } from '@angular/core';

import { ORowComponent } from './o-row.component';

/** @deprecated Use the standalone component directly. Import the component class instead of this module. */
@NgModule({
  imports: [ORowComponent],
  exports: [ORowComponent]
})
export class ORowModule { }
