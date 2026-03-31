import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../shared/shared.module';
import { OButtonToggleGroupComponent } from './o-button-toggle-group/o-button-toggle-group.component';
import { OButtonToggleComponent } from './o-button-toggle.component';

@NgModule({
  declarations: [
    OButtonToggleComponent,
    OButtonToggleGroupComponent
  ],
  imports: [
    CommonModule,
    OSharedModule
  ],
  exports: [
    OButtonToggleComponent,
    OButtonToggleGroupComponent
  ]
})
export class OButtonToggleModule { }
