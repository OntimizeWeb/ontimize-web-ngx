import { Injectable, Injector } from '@angular/core';
import { Subject } from 'rxjs';

import { AppConfig } from '../config/app-config';
import {
  MenuGroup,
  MenuItem,
  MenuItemAction,
  MenuItemLocale,
  MenuItemLogout,
  MenuItemRoute,
  MenuItemUserInfo,
} from '../interfaces/app-menu.interface';
import { MenuRootItem } from '../types/menu-root-item.type';
import { Codes } from '../util/codes';

@Injectable({
  providedIn: 'root'
})
export class AppMenuService {

  protected _config: AppConfig;
  protected MENU_ROOTS: MenuRootItem[];
  protected ALL_MENU_ITEMS: MenuItem[];
  public onClick: Subject<any> = new Subject();

  constructor(protected injector: Injector) {
    this._config = this.injector.get(AppConfig);
    this.MENU_ROOTS = this._config.getMenuConfiguration();

    this.ALL_MENU_ITEMS = [];
    for (let i = 0, len = this.MENU_ROOTS.length; i < len; i++) {
      const item: MenuRootItem = this.MENU_ROOTS[i];
      this.ALL_MENU_ITEMS = this.ALL_MENU_ITEMS.concat(this.getMenuItems(item));
    }
  }

  getMenuRoots(): MenuRootItem[] {
    return this.MENU_ROOTS;
  }

  getMenuRootById(id: string): MenuRootItem {
    return this.MENU_ROOTS.find(c => c.id === id);
  }

  getAllMenuItems(): MenuItem[] {
    return this.ALL_MENU_ITEMS;
  }

  getMenuItemById(id: string): MenuItem {
    return this.ALL_MENU_ITEMS.find(i => i.id === id);
  }

  getMenuItemType(item: MenuRootItem): string {
    let type: string;
    switch (true) {
      case ((item as MenuItemLogout).route === Codes.LOGIN_ROUTE):
        type = 'logout';
        break;
      case ((item as MenuItemRoute).route !== undefined):
        type = 'route';
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

  private getMenuItems(item: MenuRootItem): MenuItem[] {
    if ((item as MenuGroup).items !== undefined) {
      return (item as MenuGroup).items;
    }
    return [item];
  }

}
