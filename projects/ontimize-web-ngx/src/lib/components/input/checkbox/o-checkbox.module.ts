import { NgModule } from '@angular/core';

import { OCheckboxComponent } from './o-checkbox.component';

/** @deprecated Use the standalone component directly. Import the component class instead of this module. */
@NgModule({
  imports: [OCheckboxComponent],
  exports: [OCheckboxComponent]
})
export class OCheckboxModule { }
