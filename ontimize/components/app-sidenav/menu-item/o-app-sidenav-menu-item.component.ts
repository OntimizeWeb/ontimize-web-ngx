import { Injector, NgModule, Component, ViewEncapsulation, ElementRef, AfterViewInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Util } from '../../../utils';
import { InputConverter } from '../../../decorators';
import { OSharedModule } from '../../../shared';
import { OAppLayoutComponent } from '../../../layouts';
import { OTranslateService, LoginService, MenuItemAction, MenuItemLocale, MenuRootItem, MenuItemUserInfo, MenuItemRoute } from '../../../services';
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OAppSidenavMenuItemComponent implements AfterViewInit, OnDestroy {
  public static DEFAULT_INPUTS_O_APP_SIDENAV_MENU_ITEM = DEFAULT_INPUTS_O_APP_SIDENAV_MENU_ITEM;
  public static DEFAULT_OUTPUTS_O_APP_SIDENAV_MENU_ITEM = DEFAULT_OUTPUTS_O_APP_SIDENAV_MENU_ITEM;

  protected translateService: OTranslateService;
  protected loginService: LoginService;
  protected sidenav: OAppSidenavComponent;
  protected router: Router;

  @InputConverter()
  sidenavOpened: boolean = true;
  public menuItem: MenuRootItem;
  public menuItemType: string;
  protected appSidenavToggleSubscription: Subscription;
  protected oAppLayoutComponent: OAppLayoutComponent;

  constructor(
    protected injector: Injector,
    protected elRef: ElementRef,
    protected cd: ChangeDetectorRef
  ) {
    this.translateService = this.injector.get(OTranslateService);
    this.loginService = this.injector.get(LoginService);
    this.sidenav = this.injector.get(OAppSidenavComponent);
    this.oAppLayoutComponent = this.injector.get(OAppLayoutComponent);
    this.router = this.injector.get(Router);
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

  navigate() {
    const route = (this.menuItem as MenuItemRoute).route;
    if (this.router.url !== route) {
      this.router.navigate([route]);
    }
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
      case 'route':
        this.navigate();
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

  get useFlagIcons(): boolean {
    return this.oAppLayoutComponent && this.oAppLayoutComponent.useFlagIcons;
  }

  isActiveItem(): boolean {
    if (!this.isRouteItem()) {
      return false;
    }
    const route = (this.menuItem as MenuItemRoute).route;
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }

  get tooltip(): string {
    let result = this.translateService.get(this.menuItem.name);
    if (Util.isDefined(this.menuItem.tooltip)) {
      result += ': ' + this.translateService.get(this.menuItem.tooltip);
    }
    return result;
  }
}

@NgModule({
  imports: [CommonModule, OSharedModule, OLanguageSelectorModule, RouterModule],
  declarations: [OAppSidenavMenuItemComponent],
  exports: [OAppSidenavMenuItemComponent]
})
export class OAppSidenavMenuItemModule { }
