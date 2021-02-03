import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OSharedModule } from '../../shared/shared.module';
import { OUserInfoComponent } from './o-user-info.component';
import { OUserInfoConfigurationItemComponent } from './user-info-configuration-item/o-user-info-configuration-item.component';
import { OUserInfoConfigurationComponent } from './user-info-configuration/o-user-info-configuration.component';

@NgModule({
  declarations: [OUserInfoComponent, OUserInfoConfigurationComponent, OUserInfoConfigurationItemComponent],
  imports: [CommonModule, OSharedModule, RouterModule],
  exports: [OUserInfoComponent, OUserInfoConfigurationComponent, OUserInfoConfigurationItemComponent]
})
export class OUserInfoModule { }
