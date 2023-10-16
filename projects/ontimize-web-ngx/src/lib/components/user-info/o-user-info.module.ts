import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OSharedModule } from '../../shared/shared.module';
import { OUserInfoComponent } from './o-user-info.component';
import { OUserInfoConfigurationItemDirective } from './user-info-configuration-item/o-user-info-configuration-item.directive';
import { OUserInfoConfigurationDirective } from './user-info-configuration/o-user-info-configuration.directive';

@NgModule({
  declarations: [OUserInfoComponent, OUserInfoConfigurationDirective, OUserInfoConfigurationItemDirective],
  imports: [CommonModule, OSharedModule, RouterModule],
  exports: [OUserInfoComponent, OUserInfoConfigurationDirective, OUserInfoConfigurationItemDirective]
})
export class OUserInfoModule { }
