import { ContentChildren, Directive } from "@angular/core";
import { InputConverter } from "../../../decorators";
import { OUserInfoConfigurationItemDirective } from "../user-info-configuration-item/o-user-info-configuration-item.directive";

export const DEFAULT_INPUTS_O_USER_INFO_MENU = [
  'showProfile: show-profile',
  'showSettings: show-settings',
  'showLogout: show-logout',
];

export const DEFAULT_OUTPUTS_O_USER_INFO_MENU = [
];

@Directive({
  selector: 'o-user-info-configuration',
  inputs: DEFAULT_INPUTS_O_USER_INFO_MENU,
  outputs: DEFAULT_OUTPUTS_O_USER_INFO_MENU
})
export class OUserInfoConfigurationDirective {


  @ContentChildren(OUserInfoConfigurationItemDirective) userInfoConfigurationItems: Array<OUserInfoConfigurationItemDirective>;

  @InputConverter()
  showProfile: boolean = false;

  @InputConverter()
  showSettings: boolean = true;

  @InputConverter()
  showLogout: boolean = true;

  constructor() { }

}
