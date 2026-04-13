import { NgModule } from '@angular/core';

import { OTextInputComponent } from './o-text-input.component';

/** @deprecated Use the standalone component directly. Import the component class instead of this module. */
@NgModule({
  imports: [OTextInputComponent],
  exports: [OTextInputComponent]
})
export class OTextInputModule {
}
