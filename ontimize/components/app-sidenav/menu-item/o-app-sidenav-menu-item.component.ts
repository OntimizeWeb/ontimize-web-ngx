import { Injector, NgModule, Component, OnInit, ViewEncapsulation, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { InputConverter } from '../../../decorators';
import { OSharedModule } from '../../../shared';
import { OTranslateService, LoginService, MenuItemAction, MenuItemLocale, MenuRootItem, MenuItemUserInfo } from '../../../services';
import { OLanguageSelectorModule } from '../../language-selector/o-language-selector.component';
import { OAppSidenavComponent } from '../o-app-sidenav.component';

export const DEFAULT_INPUTS_O_APP_SIDENAV_MENU_ITEM = [
  'menuItem : menu-item',
  'menuItemType : menu-item-type',
  'sidenavOpened : sidenav-opened'
];

export const DEFAULT_OUTPUTS_O_APP_SIDENAV_MENU_ITEM = [];

@Component({
  selector: 'o-app-sidenav-menu-item',
  inputs: DEFAULT_INPUTS_O_APP_SIDENAV_MENU_ITEM,
  outputs: DEFAULT_OUTPUTS_O_APP_SIDENAV_MENU_ITEM,
  templateUrl: './o-app-sidenav-menu-item.component.html',
  styleUrls: ['./o-app-sidenav-menu-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OAppSidenavMenuItemComponent implements OnInit, AfterViewInit, OnDestroy {

  public static DEFAULT_INPUTS_O_APP_SIDENAV_MENU_ITEM = DEFAULT_INPUTS_O_APP_SIDENAV_MENU_ITEM;
  public static DEFAULT_OUTPUTS_O_APP_SIDENAV_MENU_ITEM = DEFAULT_OUTPUTS_O_APP_SIDENAV_MENU_ITEM;

  protected translateService: OTranslateService;
  protected loginService: LoginService;
  protected sidenav: OAppSidenavComponent;

  @InputConverter()
  sidenavOpened: boolean = true;
  public menuItem: MenuRootItem;
  public menuItemType: string;
  protected appSidenavToggleSubscription: Subscription;

  constructor(
    protected injector: Injector,
    protected elRef: ElementRef
  ) {
    this.translateService = this.injector.get(OTranslateService);
    this.loginService = this.injector.get(LoginService);
    this.sidenav = this.injector.get(OAppSidenavComponent);
  }

  ngOnInit() {
    // TODO
  }

  ngAfterViewInit() {
    this.setUserInfoImage();
    if (this.isUserInfoItem()) {
      this.appSidenavToggleSubscription = this.sidenav.afterSidenavToggle.subscribe((opened) => {
        if (opened) {
          this.setUserInfoImage();
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.appSidenavToggleSubscription) {
      this.appSidenavToggleSubscription.unsubscribe();
    }
  }

  protected setUserInfoImage() {
    if (this.isUserInfoItem()) {
      let imgEl = this.elRef.nativeElement.getElementsByClassName('user-info-image')[0];
      if (imgEl !== undefined) {
        const item = this.menuItem as MenuItemUserInfo;
        imgEl.setAttribute('style', 'background-image: url(\'' + item.avatar + '\')');
      }
    }
  }

  executeItemAction() {
    const actionItem = (this.menuItem as MenuItemAction);
    actionItem.action();
  }

  configureI18n() {
    const localeItem = (this.menuItem as MenuItemLocale);
    if (this.isConfiguredLang()) {
      return;
    }
    if (this.translateService) {
      this.translateService.use(localeItem.locale);
    }
  }

  isConfiguredLang() {
    const localeItem = (this.menuItem as MenuItemLocale);
    if (this.translateService) {
      return (this.translateService.getCurrentLang() === localeItem.locale);
    }
    return false;
  }

  logout() {
    this.loginService.logoutWithConfirmationAndRedirect();
  }

  onClick() {
    switch (this.menuItemType) {
      case 'action':
        this.executeItemAction();
        break;
      case 'locale':
        this.configureI18n();
        break;
      case 'logout':
        this.logout();
        break;
      default:
        break;
    }
  }

  isRouteItem(): boolean {
    return this.menuItemType === 'route';
  }

  isActionItem(): boolean {
    return this.menuItemType === 'action';
  }

  isLocaleItem(): boolean {
    return this.menuItemType === 'locale';
  }

  isLogoutItem(): boolean {
    return this.menuItemType === 'logout';
  }

  isUserInfoItem(): boolean {
    return this.menuItemType === 'user-info';
  }

  isDefaultItem(): boolean {
    return this.menuItemType === 'default';
  }
}

@NgModule({
  imports: [CommonModule, OSharedModule, OLanguageSelectorModule, RouterModule],
  declarations: [OAppSidenavMenuItemComponent],
  exports: [OAppSidenavMenuItemComponent]
})
export class OAppSidenavMenuItemModule { }
