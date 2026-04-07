import { NgModule } from '@angular/core';

import { OFormNavigationComponent } from '../navigation/o-form-navigation.component';
import { OFormToolbarComponent } from './o-form-toolbar.component';

@NgModule({
  imports: [OFormNavigationComponent, OFormToolbarComponent],
  exports: [OFormNavigationComponent, OFormToolbarComponent]
})
export class OFormToolbarModule { }
