import { NgModule } from '@angular/core';

import { OButtonComponent } from './o-button.component';

/** @deprecated Use the standalone component directly. Import the component class instead of this module. */
@NgModule({
  imports: [OButtonComponent],
  exports: [OButtonComponent]
})
export class OButtonModule { }
