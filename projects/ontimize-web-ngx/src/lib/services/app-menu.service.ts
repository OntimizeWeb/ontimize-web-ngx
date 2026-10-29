import { inject, Injectable } from '@angular/core';
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
  MenuItemUserInfo,
  MenuSection
} from '../interfaces/app-menu.interface';
import { MenuRootItem } from '../types/menu-root-item.type';
import { OPermissions } from '../types/o-permissions.type';
import { Codes } from '../util/codes';
import { Util } from '../util/util';
import { PermissionsService } from './permissions/permissions.service';

export interface MenuClickEvent {
  idMenu: string;
  opened?: boolean; // Only for menu groups, indicates if the group is opened or closed
}

export interface PermissionMenuChangedEvent {
  menuRoots: MenuRootItem[];
  allMenuItems: MenuRootItem[];
}

@Injectable({
  providedIn: 'root'
})
export class AppMenuService {

  protected router = inject(Router);
  protected _config = inject(AppConfig);
  protected MENU_ROOTS: MenuRootItem[];
  protected ALL_MENU_ITEMS: MenuRootItem[];
  protected activeItem: MenuItemRoute;
  protected permissionsService = inject(PermissionsService);
  protected sectionsChecked: boolean = false;

  public onClick: Subject<MenuClickEvent> = new Subject<MenuClickEvent>;
  public onPermissionMenuChanged: Subject<PermissionMenuChangedEvent> = new Subject<PermissionMenuChangedEvent>();

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setActiveItem();
      }
    });

    this.setMenuItemsByMenuConfiguration();

    this.permissionsService.onChangePermissions.subscribe(x => {
      this.mergeMenuItemsWithPermissions();
      this.onPermissionMenuChanged.next({
        menuRoots: this.MENU_ROOTS,
        allMenuItems: this.ALL_MENU_ITEMS
      })
    });

  }

  setMenuItemsByMenuConfiguration() {
    const defaultMenuConfiguration = this.cloneMenuItems(this._config.getMenuConfiguration());
    this.MENU_ROOTS = defaultMenuConfiguration;
    this.ALL_MENU_ITEMS = [];
    for (let i = 0, len = this.MENU_ROOTS.length; i < len; i++) {
      const item: MenuRootItem = this.MENU_ROOTS[i];
      this.ALL_MENU_ITEMS = this.ALL_MENU_ITEMS.concat(this.getMenuItems(item));
      if (!this.sectionsChecked) {
        this.warnNotAllowedSections((item as MenuGroup).items);
      }
    }
    this.sectionsChecked = true;
  }

  mergeMenuItemsWithPermissions() {

    this.setMenuItemsByMenuConfiguration();
    const permissionsMenu = this.permissionsService.getAllMenuPermissions();

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
      case (item.type === 'section'):
        type = 'section';
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

  isMenuSection(item: MenuRootItem): boolean {
    return this.getMenuItemType(item) === 'section';
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

  /**
   * Returns whether the item is visible taking into account both its menu configuration
   * and its menu permissions.
   */
  isVisibleByPermissions(item: MenuCommonItem): boolean {
    if (!this.isVisible(item)) {
      return false;
    }
    const itemPermissions: OPermissions = this.permissionsService.getMenuPermissions(item.id);
    return !Util.isDefined(itemPermissions) || itemPermissions.visible !== false;
  }

  /**
   * A menu section is visible when it is not hidden itself and it has, at least, one visible item.
   * Sections whose items are all hidden are not rendered so no empty titles are displayed.
   */
  isSectionVisible(section: MenuSection): boolean {
    if (!this.isVisibleByPermissions(section)) {
      return false;
    }
    const items = section.items || [];
    return items.some(item => this.isVisibleByPermissions(item));
  }

  private getMenuItems(item: MenuRootItem): MenuRootItem[] {
    const menuGroup = item as MenuGroup;
    const items = menuGroup.items;
    if (this.isMenuSection(item)) {
      /*
        The section itself must be included so its permissions are merged as any other menu entry,
        and its items are root entries only grouped under a title, so all of them are included too.
      */
      return (items || []).reduce((acc: MenuRootItem[], child: MenuRootItem) => {
        const descendants = this.getMenuItems(child).filter(descendant => descendant !== child);
        return acc.concat(child, descendants);
      }, [item]);
    }
    if (items !== undefined) {
      if (this.isMenuGroupRoute(menuGroup)) {
        return [item].concat(items)
      }
      return items;
    }
    return [item];
  }

  /**
   * Deep clones the menu configuration so the permissions applied over the menu entries never
   * modify the original configuration. `Object.assign` is used instead of a JSON copy in order
   * to keep the `action` functions of the action menu items.
   */
  private cloneMenuItems(items: MenuRootItem[]): MenuRootItem[] {
    return (items || []).map((item: MenuRootItem) => {
      const clonedItem = Object.assign({}, item) as MenuGroup;
      if (Util.isDefined((item as MenuGroup).items)) {
        clonedItem.items = this.cloneMenuItems((item as MenuGroup).items) as MenuGroup['items'];
      }
      return clonedItem;
    });
  }

  /**
   * Menu sections are only supported at the root level of the menu configuration, they are
   * ignored anywhere else.
   */
  private warnNotAllowedSections(items: MenuRootItem[]): void {
    (items || []).forEach(item => {
      if (this.isMenuSection(item)) {
        console.warn(`[AppMenuService]: menu section '${item.id}' is not placed at the root level of the menu configuration and will be ignored.`);
      }
      this.warnNotAllowedSections((item as MenuGroup).items);
    });
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
