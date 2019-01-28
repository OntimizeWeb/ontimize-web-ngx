import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Injector, NgModule, OnDestroy, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { Util } from '../../../utils';
import { OSharedModule } from '../../../shared';
import { InputConverter } from '../../../decorators';
import { OAppLayoutComponent } from '../../../layouts';
import { PermissionsUtils } from '../../../util/permissions';
import { OAppSidenavComponent } from '../o-app-sidenav.component';
import { DialogService, LoginService, OTranslateService, OPermissions, PermissionsService, OUserInfoService } from '../../../services';
import { OLanguageSelectorModule } from '../../language-selector/o-language-selector.component';
import { MenuItemAction, MenuItemLocale, MenuItemLogout, MenuItemRoute, MenuItemUserInfo, MenuRootItem } from '../../../services/app-menu.service';

export const DEFAULT_INPUTS_O_APP_SIDENAV_MENU_ITEM = [
  'menuItem : menu-item',
  'menuItemType : menu-item-type',
  'sidenavOpened : sidenav-opened',
  'disabled'
];

export const DEFAULT_OUTPUTS_O_APP_SIDENAV_MENU_ITEM = [
  'onClick'
];

@Component({
  moduleId: module.id,
  selector: 'o-app-sidenav-menu-item',
  inputs: DEFAULT_INPUTS_O_APP_SIDENAV_MENU_ITEM,
  outputs: DEFAULT_OUTPUTS_O_APP_SIDENAV_MENU_ITEM,
  templateUrl: './o-app-sidenav-menu-item.component.html',
  styleUrls: ['./o-app-sidenav-menu-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.o-app-sidenav-menu-item]': 'true',
    '[attr.disabled]': 'disabled'
  }
})
export class OAppSidenavMenuItemComponent implements OnInit, AfterViewInit, OnDestroy {

  public static DEFAULT_INPUTS_O_APP_SIDENAV_MENU_ITEM = DEFAULT_INPUTS_O_APP_SIDENAV_MENU_ITEM;
  public static DEFAULT_OUTPUTS_O_APP_SIDENAV_MENU_ITEM = DEFAULT_OUTPUTS_O_APP_SIDENAV_MENU_ITEM;

  public onClick: EventEmitter<any> = new EventEmitter<any>();

  protected translateService: OTranslateService;
  protected loginService: LoginService;
  protected dialogService: DialogService;
  protected permissionsService: PermissionsService;
  protected oUserInfoService: OUserInfoService;
  protected userInfoSubscription: Subscription;

  protected sidenav: OAppSidenavComponent;
  protected router: Router;

  menuItem: MenuRootItem;
  menuItemType: string;
  @InputConverter()
  sidenavOpened: boolean = true;
  @InputConverter()
  disabled: boolean = false;

  protected appSidenavToggleSubscription: Subscription;
  protected routerSubscription: Subscription;
  protected oAppLayoutComponent: OAppLayoutComponent;

  protected permissions: OPermissions;
  protected mutationObserver: MutationObserver;

  hidden: boolean;
  constructor(
    protected injector: Injector,
    protected elRef: ElementRef,
    protected cd: ChangeDetectorRef
  ) {
    this.translateService = this.injector.get(OTranslateService);
    this.loginService = this.injector.get(LoginService);
    this.dialogService = this.injector.get(DialogService);
    this.permissionsService = this.injector.get(PermissionsService);
    this.oUserInfoService = this.injector.get(OUserInfoService);
    this.sidenav = this.injector.get(OAppSidenavComponent);
    this.oAppLayoutComponent = this.injector.get(OAppLayoutComponent);
    this.router = this.injector.get(Router);
    this.routerSubscription = this.router.events.subscribe(() => {
      this.cd.detectChanges();
    });
  }

  ngOnInit() {
    this.parsePermissions();
  }

  ngAfterViewInit() {
    if (this.isUserInfoItem()) {
      this.setUserInfoImage();
      this.appSidenavToggleSubscription = this.sidenav.sidenav.openedChange.subscribe((opened) => {
        if (opened) {
          this.setUserInfoImage();
        }
      });
      this.userInfoSubscription = this.oUserInfoService.getUserInfoObservable().subscribe(res => {
        if (Util.isDefined(res.avatar) && this.sidenav.sidenav.opened) {
          (this.menuItem as MenuItemUserInfo).avatar = res.avatar;
          this.setUserInfoImage();
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.appSidenavToggleSubscription) {
      this.appSidenavToggleSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
    if (this.userInfoSubscription) {
      this.userInfoSubscription.unsubscribe();
    }
  }

  protected parsePermissions() {
    // if oattr in form, it can have permissions
    this.permissions = this.permissionsService.getMenuPermissions(this.menuItem.id);
    if (!Util.isDefined(this.permissions)) {
      return;
    }
    this.hidden = this.permissions.visible === false;
    if (!this.disabled) {
      // if the disabled input is true it means that its parent is disabled using permissions
      this.disabled = this.permissions.enabled === false;
    }

    if (this.disabled) {
      this.mutationObserver = PermissionsUtils.registerDisabledChangesInDom(this.elRef.nativeElement, {
        checkStringValue: true
      });
    }
  }

  protected setUserInfoImage() {
    let imgEl = this.elRef.nativeElement.getElementsByClassName('o-user-info-image')[0];
    if (imgEl !== undefined) {
      const item = this.menuItem as MenuItemUserInfo;
      imgEl.setAttribute('style', 'background-image: url(\'' + item.avatar + '\')');
    }
    this.cd.detectChanges();
  }

  executeItemAction() {
    const actionItem = (this.menuItem as MenuItemAction);
    if (Util.parseBoolean(actionItem.confirm, false)) {
      this.dialogService.confirm('CONFIRM', actionItem.confirmText || 'MESSAGES.CONFIRM_ACTION').then(result => result ? actionItem.action() : null);
    } else {
      actionItem.action();
    }
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
    const menuItem = (this.menuItem as MenuItemLogout);
    if (Util.parseBoolean(menuItem.confirm, true)) {
      this.loginService.logoutWithConfirmationAndRedirect();
    } else {
      this.loginService.logoutAndRedirect();
    }
  }

  navigate() {
    const route = (this.menuItem as MenuItemRoute).route;
    if (this.router.url !== route) {
      this.router.navigate([route]);
    }
  }

  triggerClick(e: Event) {
    if (this.disabled) {
      return;
    }
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
    this.onClick.emit(e);
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
  imports: [CommonModule, OLanguageSelectorModule, OSharedModule, RouterModule],
  declarations: [OAppSidenavMenuItemComponent],
  exports: [OAppSidenavMenuItemComponent]
})
export class OAppSidenavMenuItemModule { }
