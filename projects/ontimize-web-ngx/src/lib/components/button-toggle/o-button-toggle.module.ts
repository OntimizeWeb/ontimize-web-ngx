import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OSharedModule } from '../../shared/shared.module';
import { OButtonToggleComponent } from './o-button-toggle.component';
import { OButtonToggleGroupComponent } from './o-button-toggle-group/o-button-toggle-group.component';

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
