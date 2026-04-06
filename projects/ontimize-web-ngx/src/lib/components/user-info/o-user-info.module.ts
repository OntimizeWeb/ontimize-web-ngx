import { NgModule } from '@angular/core';

import { OUserInfoComponent } from './o-user-info.component';
import { OUserInfoConfigurationItemDirective } from './user-info-configuration-item/o-user-info-configuration-item.directive';
import { OUserInfoConfigurationDirective } from './user-info-configuration/o-user-info-configuration.directive';

@NgModule({
  imports: [OUserInfoComponent, OUserInfoConfigurationDirective, OUserInfoConfigurationItemDirective],
  exports: [OUserInfoComponent, OUserInfoConfigurationDirective, OUserInfoConfigurationItemDirective]
})
export class OUserInfoModule { }
