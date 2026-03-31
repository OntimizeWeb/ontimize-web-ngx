import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../../shared/shared.module';
import { OFormNavigationComponent } from '../navigation/o-form-navigation.component';
import { OFormToolbarComponent } from './o-form-toolbar.component';

@NgModule({
  declarations: [OFormNavigationComponent, OFormToolbarComponent],
  imports: [CommonModule, OSharedModule],
  exports: [OFormNavigationComponent, OFormToolbarComponent]
})
export class OFormToolbarModule { }
