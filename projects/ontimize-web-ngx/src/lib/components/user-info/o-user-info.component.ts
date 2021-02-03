import { Component, ElementRef, Injector, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { InputConverter } from '../../decorators';

import { DialogService } from '../../services/dialog.service';
import { LoginService } from '../../services/login.service';
import { OUserInfoService, UserInfo } from '../../services/o-user-info.service';
import { OUserInfoConfigurationItemComponent } from './user-info-configuration-item/o-user-info-configuration-item.component';
import { OUserInfoConfigurationComponent } from './user-info-configuration/o-user-info-configuration.component';

export const DEFAULT_INPUTS_O_USER_INFO = [
  'showProfile: show-profile',
  'showSettings: show-settings',
  'showLogout: show-logout',
  'showMenu: show-menu',
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
  protected loginService: LoginService;
  protected oUserInfoService: OUserInfoService;

  userInfoSubscription: Subscription;
  protected userInfo: UserInfo;

  @InputConverter()
  public showLogout: boolean = true;;

  @InputConverter()
  public showSettings: boolean = true;;

  @InputConverter()
  public showProfile: boolean = false;;

  @InputConverter()
  public showMenu: boolean = false;



  public userInfoConfigurationArray: Array<OUserInfoConfigurationItemComponent> = []
  public userInfoConfiguration: OUserInfoConfigurationComponent;

  constructor(
    protected elRef: ElementRef,
    protected injector: Injector,
    protected router: Router
  ) {
    this.dialogService = this.injector.get(DialogService);
    this.loginService = this.injector.get(LoginService);
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
    this.loginService.logoutWithConfirmationAndRedirect();
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


  registerUserInfoConfiguration(userInfoMenu: OUserInfoConfigurationComponent) {
    this.userInfoConfiguration = userInfoMenu;
    this.updateInputsByConfiguration();
  }

  private updateInputsByConfiguration() {
    this.showLogout = this.userInfoConfiguration.showLogout ? this.userInfoConfiguration.showLogout : this.showLogout;
    this.showProfile = this.userInfoConfiguration.showProfile ? this.userInfoConfiguration.showProfile : this.showProfile;
    this.showSettings = this.userInfoConfiguration.showSettings ? this.userInfoConfiguration.showSettings : this.showSettings;
  }

}
