import { Component, ContentChildren, forwardRef, Inject, QueryList, ViewEncapsulation } from "@angular/core";
import { InputConverter } from "../../../decorators";
import { OUserInfoConfigurationItemComponent } from "../user-info-configuration-item/o-user-info-configuration-item.component";

export const DEFAULT_INPUTS_O_USER_INFO_MENU = [
  'showProfile: show-profile',
  'showSettings: show-settings',
  'showLogout: show-logout',
];

export const DEFAULT_OUTPUTS_O_USER_INFO_MENU = [
  'onClick'
];

@Component({
  selector: 'o-user-info-configuration',
  inputs: DEFAULT_INPUTS_O_USER_INFO_MENU,
  template: ``,
  outputs: DEFAULT_OUTPUTS_O_USER_INFO_MENU,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-user-info-menu]': 'true'
  }
})
export class OUserInfoConfigurationComponent {


  @ContentChildren(OUserInfoConfigurationItemComponent) userInfoConfigurationItems: Array<OUserInfoConfigurationItemComponent>;

  @InputConverter()
  showProfile: boolean = false;

  @InputConverter()
  showSettings: boolean = true;

  @InputConverter()
  showLogout: boolean = true;

  constructor() { }


}
