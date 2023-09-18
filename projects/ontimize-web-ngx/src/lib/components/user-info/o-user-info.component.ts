import { Component, ElementRef, Injector, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { BooleanInputConverter } from '../../decorators';
import { AuthService } from '../../services/auth.service';
import { DialogService } from '../../services/dialog.service';
import { OUserInfoService, UserInfo } from '../../services/o-user-info.service';
import { OUserInfoConfigurationDirective } from './user-info-configuration/o-user-info-configuration.directive';

export const DEFAULT_INPUTS_O_USER_INFO = [
  'showProfile: show-profile',
  'showSettings: show-settings',
  'showLogout: show-logout'
];

export const DEFAULT_OUTPUTS_O_USER_INFO = [];

@Component({
  selector: 'o-user-info',
  inputs: DEFAULT_INPUTS_O_USER_INFO,
  outputs: DEFAULT_OUTPUTS_O_USER_INFO,
  templateUrl: './o-user-info.component.html',
  styleUrls: ['./o-user-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-user-info]': 'true'
  }
})
export class OUserInfoComponent implements OnDestroy {

  protected dialogService: DialogService;
  protected authService: AuthService;
  protected oUserInfoService: OUserInfoService;

  userInfoSubscription: Subscription;
  protected userInfo: UserInfo;

  @BooleanInputConverter()
  public showLogout: boolean = true;

  @BooleanInputConverter()
  public showSettings: boolean = true;

  @BooleanInputConverter()
  public showProfile: boolean = false;

  public userInfoConfiguration: OUserInfoConfigurationDirective;

  constructor(
    protected elRef: ElementRef,
    protected injector: Injector,
    protected router: Router
  ) {
    this.dialogService = this.injector.get(DialogService);
    this.authService = this.injector.get(AuthService);
    this.oUserInfoService = this.injector.get(OUserInfoService);

    this.userInfo = this.oUserInfoService.getUserInfo();
    this.userInfoSubscription = this.oUserInfoService.getUserInfoObservable().subscribe(res => {
      this.userInfo = res;
    });
  }

  ngOnDestroy() {
    this.userInfoSubscription.unsubscribe();
  }

  onLogoutClick() {
    this.authService.logoutWithConfirmation();
  }

  onSettingsClick() {
    this.router.navigate(['main/settings']);
  }

  onProfileClick() {
    this.router.navigate(['main/profile']);
  }

  get existsUserInfo(): boolean {
    return this.userInfo !== undefined;
  }

  get avatar(): string {
    return this.userInfo ? this.userInfo.avatar : undefined;
  }

  get username(): string {
    return this.userInfo ? this.userInfo.username : undefined;
  }

  registerUserInfoConfiguration(userInfoMenu: OUserInfoConfigurationDirective) {
    this.userInfoConfiguration = userInfoMenu;
    this.updateInputsByConfiguration();
  }

  private updateInputsByConfiguration() {
    this.showLogout = this.userInfoConfiguration ? this.userInfoConfiguration.showLogout : this.showLogout;
    this.showProfile = this.userInfoConfiguration ? this.userInfoConfiguration.showProfile : this.showProfile;
    this.showSettings = this.userInfoConfiguration ? this.userInfoConfiguration.showSettings : this.showSettings;
  }

}
