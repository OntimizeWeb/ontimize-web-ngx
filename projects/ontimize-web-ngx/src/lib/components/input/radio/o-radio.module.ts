import { NgModule } from '@angular/core';

import { ORadioComponent } from './o-radio.component';

/** @deprecated Use the standalone component directly. Import the component class instead of this module. */
@NgModule({
  imports: [ORadioComponent],
  exports: [ORadioComponent]
})
export class ORadioModule { }
