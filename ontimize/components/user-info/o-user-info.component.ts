import { Injector, ElementRef, Component, OnDestroy, NgModule, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { OSharedModule } from '../../shared';
import { DialogService, OUserInfoService, UserInfo, LoginService } from '../../services';
import { OLanguageSelectorModule } from '../language-selector/o-language-selector.component';
// import { AppConfig } from '../../config/app-config';

export const DEFAULT_INPUTS_O_USER_INFO = [];

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
  public static DEFAULT_INPUTS_O_USER_INFO = DEFAULT_INPUTS_O_USER_INFO;
  public static DEFAULT_OUTPUTS_O_USER_INFO = DEFAULT_OUTPUTS_O_USER_INFO;

  protected dialogService: DialogService;
  protected loginService: LoginService;
  protected oUserInfoService: OUserInfoService;

  userInfoSubscription: Subscription;
  protected userInfo: UserInfo;

  // protected sidenavMode: boolean = false;
  // appSidenav: any;
  // protected translateService: OTranslateService;
  // protected _config: AppConfig;
  // protected availableLangs: string[];

  constructor(
    protected elRef: ElementRef,
    protected injector: Injector,
    private router: Router
  ) {
    this.dialogService = this.injector.get(DialogService);
    // this.translateService = this.injector.get(OTranslateService);
    this.loginService = this.injector.get(LoginService);
    this.oUserInfoService = this.injector.get(OUserInfoService);

    this.userInfo = this.oUserInfoService.getUserInfo();
    this.userInfoSubscription = this.oUserInfoService.getUserInfoObservable().subscribe(res => {
      this.userInfo = res;
    });

    // this._config = this.injector.get(AppConfig);
    // this.availableLangs = this._config.getConfiguration().applicationLocales;
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

  get existsUserInfo(): boolean {
    return this.userInfo !== undefined;
  }

  get avatar(): string {
    return this.userInfo ? this.userInfo.avatar : undefined;
  }

  get username(): string {
    return this.userInfo ? this.userInfo.username : undefined;
  }

  // getFlagClass(lang: string) {
  //   const flagName = (lang !== 'en') ? lang : 'gb';
  //   return 'flag-icon-' + flagName;
  // }

  // getAvailableLangs(): string[] {
  //   return this.availableLangs;
  // }

  // configureI18n(lang: any) {
  //   if (this.translateService && this.translateService.getCurrentLang() !== lang) {
  //     this.translateService.use(lang);
  //   }
  // }

  // getCurrentLang(): string {
  //   return this.translateService.getCurrentLang();
  // }
}

@NgModule({
  declarations: [OUserInfoComponent],
  imports: [OSharedModule, CommonModule, OLanguageSelectorModule, RouterModule],
  exports: [OUserInfoComponent]
})
export class OUserInfoModule { }
