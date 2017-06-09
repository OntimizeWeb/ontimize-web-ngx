import {
  Injector,
  Injectable
} from '@angular/core';

import { AppConfig } from '../config/app-config';


export interface MenuGroup {
  id: string;
  name: string;
  icon?: string;
  items?: (MenuItem | MenuItemRoute | MenuItemAction | MenuItemLocale | MenuItemLogout)[];
}

export interface MenuItem {
  id: string;
  name: string;
  icon?: string;
}

export interface MenuItemRoute extends MenuItem {
  route: string;
}

export interface MenuItemAction extends MenuItem {
  confirm?: string;
  action(): any;
}

export interface MenuItemLocale extends MenuItem {
  locale: string;
}

export interface MenuItemLogout extends MenuItem {
  route: string;
  confirm: string;
}


@Injectable()
export class AppMenuService {

  protected _config: AppConfig;
  protected MENU_GROUPS: MenuGroup[];
  protected ALL_MENU_ITEMS: MenuItem[];

  constructor(protected injector: Injector) {
    this._config = this.injector.get(AppConfig);
    this.MENU_GROUPS = this._config.getMenuConfiguration();
    this.ALL_MENU_ITEMS = this.MENU_GROUPS.reduce((result, category) => result.concat(category.items), []);
  }

  getMenuGroups(): MenuGroup[] {
    return this.MENU_GROUPS;
  }

  getMenuGroupById(id: string): MenuGroup {
    return this.MENU_GROUPS.find(c => c.id === id);
  }

  getAllMenuItems(): MenuItem[] {
    return this.ALL_MENU_ITEMS;
  }

  getMenuItemById(id: string): MenuItem {
    return this.ALL_MENU_ITEMS.find(i => i.id === id);
  }

  getMenuItemType(item: MenuItem): string {
    let type: string;
    switch (true) {
      case ((item as MenuItemLogout).route === '/login'):
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
      default:
        type = 'default';
        break;
    }
    return type;
  }

}
