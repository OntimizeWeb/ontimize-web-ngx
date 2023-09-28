import type { OUserInfoConfigurationDirective } from "./user-info-configuration/o-user-info-configuration.directive";

export abstract class OUserInfoBase{

  abstract registerUserInfoConfiguration(userInfoMenu: OUserInfoConfigurationDirective);

}