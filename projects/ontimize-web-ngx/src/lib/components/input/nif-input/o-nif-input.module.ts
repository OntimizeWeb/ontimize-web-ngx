import { NgModule } from '@angular/core';

import { ONIFInputComponent } from './o-nif-input.component';

/** @deprecated Use the standalone component directly. Import the component class instead of this module. */
@NgModule({
  imports: [ONIFInputComponent],
  exports: [ONIFInputComponent]
})
export class ONIFInputModule { }
