import { NgModule } from '@angular/core';

import { OAppHeaderComponent } from './o-app-header.component';

/** @deprecated Use the standalone component directly. Import the component class instead of this module. */
@NgModule({
  imports: [OAppHeaderComponent],
  exports: [OAppHeaderComponent]
})
export class OAppHeaderModule { }
