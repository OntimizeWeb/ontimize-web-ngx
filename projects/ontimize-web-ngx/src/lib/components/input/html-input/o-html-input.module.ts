import { NgModule } from '@angular/core';

import { OHTMLInputComponent } from './o-html-input.component';

/** @deprecated Use the standalone component directly. Import the component class instead of this module. */
@NgModule({
  imports: [OHTMLInputComponent],
  exports: [OHTMLInputComponent]
})
export class OHTMLInputModule { }
