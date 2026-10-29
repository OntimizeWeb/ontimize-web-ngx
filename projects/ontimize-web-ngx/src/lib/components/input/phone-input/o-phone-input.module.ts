import { NgModule } from '@angular/core';

import { OPhoneInputComponent } from './o-phone-input.component';

/** @deprecated Use the standalone component directly. Import the component class instead of this module. */
@NgModule({
  imports: [OPhoneInputComponent],
  exports: [OPhoneInputComponent]
})
export class OPhoneInputModule { }
