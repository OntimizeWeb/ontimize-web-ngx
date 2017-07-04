import {
  Injector,
  ElementRef,
  Component,
  OnDestroy,
  NgModule,
  ViewEncapsulation
} from '@angular/core';

import {
  Router,
  RouterModule
} from '@angular/router';

import { Subscription } from 'rxjs/Subscription';
import { OSharedModule } from '../../shared';
import { CommonModule } from '@angular/common';

import {
  DialogService,
  OUserInfoService,
  UserInfo,
  LoginService
} from '../../services';

export const DEFAULT_INPUTS_O_USER_INFO = [];

export const DEFAULT_OUTPUTS_O_USER_INFO = [];

@Component({
  selector: 'o-user-info',
  inputs: DEFAULT_INPUTS_O_USER_INFO,
  outputs: DEFAULT_OUTPUTS_O_USER_INFO,
  template: require('./o-user-info.component.html'),
  styles: [require('./o-user-info.component.scss')],
  encapsulation: ViewEncapsulation.None
})

export class OUserInfoComponent implements OnDestroy {
  public static DEFAULT_INPUTS_O_USER_INFO = DEFAULT_INPUTS_O_USER_INFO;
  public static DEFAULT_OUTPUTS_O_USER_INFO = DEFAULT_OUTPUTS_O_USER_INFO;

  protected dialogService: DialogService;
  protected loginService: LoginService;
  protected oUserInfoService: OUserInfoService;

  userInfoSubscription: Subscription;
  protected userInfo: UserInfo;

  constructor(
    protected elRef: ElementRef,
    protected injector: Injector,
    private router: Router
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
}

@NgModule({
  declarations: [OUserInfoComponent],
  imports: [OSharedModule, CommonModule, RouterModule],
  exports: [OUserInfoComponent],
})
export class OUserInfoModule { }
