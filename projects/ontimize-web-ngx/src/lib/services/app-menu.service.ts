import { Injector, Injectable } from '@angular/core';
import { Codes } from '../utils';
import { AppConfig } from '../config/app-config';

export type MenuRootItem = (MenuGroup | MenuItemRoute | MenuItemAction | MenuItemLocale | MenuItemLogout | MenuItemUserInfo | MenuItem);

export interface MenuGroup {
  id: string;
  name: string;
  icon?: string;
  items: (MenuItemRoute | MenuItemAction | MenuItemLocale | MenuItemLogout | MenuItemUserInfo | MenuGroup | MenuItem)[];
  opened?: boolean;
  tooltip?: string;
  class?:string;
}

export interface MenuItem {
  id: string;
  name: string;
  tooltip?: string;
  icon?: string;
  image?: string;
  component?: any;
  class?:string;
  'component-inputs'?: Object;
  'show-in-card-menu'?: boolean;
}

export interface MenuItemRoute extends MenuItem {
  route: string;
}

export interface MenuItemAction extends MenuItem {
  confirm?: string;
  confirmText?: string;
  action(): any;
}

export interface MenuItemLocale extends MenuItem {
  locale: string;
}

export interface MenuItemLogout extends MenuItem {
  route: string;
  confirm: string;
}

export interface MenuItemUserInfo extends MenuItem {
  user: string;
  avatar: string;
}

@Injectable()
export class AppMenuService {

  protected _config: AppConfig;
  protected MENU_ROOTS: MenuRootItem[];
  protected ALL_MENU_ITEMS: MenuItem[];

  constructor(protected injector: Injector) {
    this._config = this.injector.get(AppConfig);
    this.MENU_ROOTS = this._config.getMenuConfiguration();

    this.ALL_MENU_ITEMS = [];
    for (let i = 0, len = this.MENU_ROOTS.length; i < len; i++) {
      let item: MenuRootItem = this.MENU_ROOTS[i];
      this.ALL_MENU_ITEMS = this.ALL_MENU_ITEMS.concat(this.getMenuItems(item));
    }
    //this.ALL_MENU_ITEMS = this.MENU_ROOTS.reduce((result, category) => result.concat(category.items), []);
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
