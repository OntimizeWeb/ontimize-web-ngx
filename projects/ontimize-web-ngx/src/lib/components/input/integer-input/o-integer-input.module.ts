import { NgModule } from '@angular/core';

import { OIntegerInputComponent } from './o-integer-input.component';

/** @deprecated Use the standalone component directly. Import the component class instead of this module. */
@NgModule({
  imports: [OIntegerInputComponent],
  exports: [OIntegerInputComponent]
})
export class OIntegerInputModule { }
