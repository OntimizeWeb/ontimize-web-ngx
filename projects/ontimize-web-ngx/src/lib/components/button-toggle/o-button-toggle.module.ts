import { NgModule } from '@angular/core';

import { OButtonToggleGroupComponent } from './o-button-toggle-group/o-button-toggle-group.component';
import { OButtonToggleComponent } from './o-button-toggle.component';

/** @deprecated Use the standalone component directly. Import the component class instead of this module. */
@NgModule({
  imports: [OButtonToggleComponent, OButtonToggleGroupComponent],
  exports: [OButtonToggleComponent, OButtonToggleGroupComponent]
})
export class OButtonToggleModule { }
