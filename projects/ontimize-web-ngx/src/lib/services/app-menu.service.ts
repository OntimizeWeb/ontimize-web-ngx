import { PermissionsService } from './permissions/permissions.service';
import { Injectable, Injector } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AppConfig } from '../config/app-config';
import {
  MenuCommonItem,
  MenuGroup,
  MenuItem,
  MenuItemAction,
  MenuItemLocale,
  MenuItemLogout,
  MenuItemRoute,
  MenuItemUserInfo
} from '../interfaces/app-menu.interface';
import { MenuRootItem } from '../types/menu-root-item.type';
import { Codes } from '../util/codes';
import { Util } from '../util/util';

@Injectable({
  providedIn: 'root'
})
export class AppMenuService {

  protected router: Router;
  protected _config: AppConfig;
  protected MENU_ROOTS: MenuRootItem[];
  protected ALL_MENU_ITEMS: MenuRootItem[];
  protected activeItem: MenuItemRoute;
  protected permissionsService: PermissionsService;

  public onClick: Subject<any> = new Subject();
  public onPermissionMenuChanged: Subject<void> = new Subject();

  constructor(protected injector: Injector) {
    this._config = this.injector.get(AppConfig);
    this.router = this.injector.get(Router);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setActiveItem();
      }
    });

    this.setMenuItemsByMenuConfiguration();

    this.permissionsService = this.injector.get(PermissionsService);
    this.permissionsService.onChangePermissions.subscribe(x => {
      this.mergeMenuItemsWithPermissions();
      this.onPermissionMenuChanged.next()
    });

  }

  setMenuItemsByMenuConfiguration() {
    /*
      spread operator (...) in array multi-level not works
      JSON.parse and JSON.stringify are the specific methods used for multi-level deep copying
    */
    const defaultMenuConfiguration = JSON.parse(JSON.stringify(this._config.getMenuConfiguration()));
    this.MENU_ROOTS = defaultMenuConfiguration;
    this.ALL_MENU_ITEMS = [];
    for (let i = 0, len = this.MENU_ROOTS.length; i < len; i++) {
      const item: MenuRootItem = this.MENU_ROOTS[i];
      this.ALL_MENU_ITEMS = this.ALL_MENU_ITEMS.concat(this.getMenuItems(item));
    }
  }

  mergeMenuItemsWithPermissions() {

    this.setMenuItemsByMenuConfiguration();
    const permissionsMenu = this.permissionsService.getMenuPermissions();

    if (Util.isDefined(permissionsMenu)) {
      this.MENU_ROOTS = [...this.MENU_ROOTS.map(menu => {
        const indexPermission = permissionsMenu.findIndex(permission => permission.attr === menu.id);
        if (indexPermission > -1) {
          menu.visible = permissionsMenu[indexPermission].visible;
        }
        return menu;
      })];

      this.ALL_MENU_ITEMS = [...this.ALL_MENU_ITEMS.map(menu => {
        const indexPermission = permissionsMenu.findIndex(permission => permission.attr === menu.id);
        if (indexPermission > -1) {
          menu.visible = permissionsMenu[indexPermission].visible;
        }
        return menu;
      })];
    }
  }

  getMenuRoots(): MenuRootItem[] {
    return this.MENU_ROOTS;
  }

  getMenuRootById(id: string): MenuRootItem {
    return this.MENU_ROOTS.find(c => c.id === id);
  }

  getAllMenuItems(): MenuRootItem[] {
    return this.ALL_MENU_ITEMS;
  }

  getMenuItemById(id: string): MenuItem | MenuGroup {
    return this.ALL_MENU_ITEMS.find(i => i.id === id);
  }

  getMenuItemType(item: MenuRootItem): string {
    let type: string;
    switch (true) {
      case ((item as MenuItemLogout).route === Codes.LOGIN_ROUTE):
        type = 'logout';
        break;
      case ((item as MenuItemAction).action !== undefined):
        type = 'action';
        break;
      case ((item as MenuItemLocale).locale !== undefined):
        type = 'locale';
        break;
      case ((item as MenuItemUserInfo).user !== undefined):
        type = 'user-info';
        break;
      case ((item as MenuGroup).items !== undefined):
        type = 'group';
        break;
      default:
        type = 'default';
        break;
    }
    return type;
  }

  isMenuGroup(item: MenuRootItem): boolean {
    return this.getMenuItemType(item) === 'group';
  }

  isMenuGroupRoute(item: MenuRootItem): boolean {
    return this.getMenuItemType(item) === 'group' && item.hasOwnProperty('route');
  }

  isItemActive(item: MenuItemRoute): boolean {
    return this.activeItem && this.activeItem.route === item.route;
  }

  isRouteItem(item: MenuItemRoute): boolean {
    return Util.isDefined(item.route);
  }

  isVisible(item: MenuCommonItem): boolean {
    return !Util.isDefined(item.visible) || (Util.isDefined(item.visible) && item.visible);
  }

  private getMenuItems(item: MenuRootItem): MenuRootItem[] {
    const menuGroup = item as MenuGroup;
    const items = menuGroup.items;
    if (items !== undefined) {
      if (this.isMenuGroupRoute(menuGroup)) {
        return [item].concat(items)
      }
      return items;
    }
    return [item];
  }

  private setActiveItem(): void {
    let activeItem: MenuItemRoute;
    const routeItems: MenuItemRoute[] = this.ALL_MENU_ITEMS.filter(item => this.isRouteItem(item)) as MenuItemRoute[];
    const pathMatchFullItems = routeItems.filter(item => item.pathMatch === 'full');
    if (pathMatchFullItems.length > 0) {
      activeItem = pathMatchFullItems.find(item => item.route === this.router.url);
    }
    if (!activeItem) {
      activeItem = routeItems.find(item => this.router.url.startsWith(item.route));
    }
    this.activeItem = activeItem;
  }

}
