import { NgModule } from '@angular/core';

import { OFormNavigationComponent } from '../navigation/o-form-navigation.component';
import { OFormToolbarComponent } from './o-form-toolbar.component';

/** @deprecated Use the standalone component directly. Import the component class instead of this module. */
@NgModule({
  imports: [OFormNavigationComponent, OFormToolbarComponent],
  exports: [OFormNavigationComponent, OFormToolbarComponent]
})
export class OFormToolbarModule { }
