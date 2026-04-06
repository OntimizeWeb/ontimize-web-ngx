import { NgModule } from '@angular/core';

import { OButtonToggleGroupComponent } from './o-button-toggle-group/o-button-toggle-group.component';
import { OButtonToggleComponent } from './o-button-toggle.component';

@NgModule({
  imports: [OButtonToggleComponent, OButtonToggleGroupComponent],
  exports: [OButtonToggleComponent, OButtonToggleGroupComponent]
})
export class OButtonToggleModule { }
