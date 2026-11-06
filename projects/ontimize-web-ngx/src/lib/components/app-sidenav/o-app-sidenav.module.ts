import { NgModule } from '@angular/core';

import { OAppSidenavComponent } from './o-app-sidenav.component';

/** @deprecated Use the standalone component directly. Import the component class instead of this module. */
@NgModule({
  imports: [OAppSidenavComponent],
  exports: [OAppSidenavComponent]
})
export class OAppSidenavModule { }
