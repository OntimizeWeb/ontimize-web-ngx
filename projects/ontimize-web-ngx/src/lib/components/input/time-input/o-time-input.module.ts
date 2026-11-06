import { NgModule } from '@angular/core';

import { OTimeInputComponent } from './o-time-input.component';

/** @deprecated Use the standalone component directly. Import the component class instead of this module. */
@NgModule({
  imports: [OTimeInputComponent],
  exports: [OTimeInputComponent]
})
export class OTimeInputModule { }
