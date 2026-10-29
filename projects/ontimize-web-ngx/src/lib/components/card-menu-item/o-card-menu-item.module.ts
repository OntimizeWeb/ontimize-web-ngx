import { NgModule } from '@angular/core';

import { OCardMenuItemComponent } from './o-card-menu-item.component';

/** @deprecated Use the standalone component directly. Import the component class instead of this module. */
@NgModule({
  imports: [OCardMenuItemComponent],
  exports: [OCardMenuItemComponent]
})
export class OCardMenuItemModule { }
