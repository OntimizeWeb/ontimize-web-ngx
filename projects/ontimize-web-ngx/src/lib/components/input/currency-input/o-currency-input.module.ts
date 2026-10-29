import { NgModule } from '@angular/core';

import { OCurrencyInputComponent } from './o-currency-input.component';

/** @deprecated Use the standalone component directly. Import the component class instead of this module. */
@NgModule({
  imports: [OCurrencyInputComponent],
  exports: [OCurrencyInputComponent]
})
export class OCurrencyInputModule { }
