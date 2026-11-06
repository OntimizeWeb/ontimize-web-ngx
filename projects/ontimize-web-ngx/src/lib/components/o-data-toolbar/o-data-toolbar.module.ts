import { NgModule } from '@angular/core';

import { ODataToolbarComponent } from './o-data-toolbar.component';

/** @deprecated Use the standalone component directly. Import the component class instead of this module. */
@NgModule({
  imports: [ODataToolbarComponent],
  exports: [ODataToolbarComponent]
})
export class ODataToolbarModule { }
