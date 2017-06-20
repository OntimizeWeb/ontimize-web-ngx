import {
  Injector,
  Injectable
} from '@angular/core';

import { AppConfig } from '../config/app-config';

export type MenuRootItem = (MenuGroup | MenuItem | MenuItemRoute | MenuItemAction | MenuItemLocale | MenuItemLogout);

export interface MenuGroup {
  id: string;
  name: string;
  icon?: string;
  items: (MenuItem | MenuItemRoute | MenuItemAction | MenuItemLocale | MenuItemLogout)[];
  opened?: boolean;
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
      case ((item as MenuGroup).items !== undefined):
        type = 'group';
        break;
      default:
        type = 'default';
        break;
    }
    return type;
  }

  private getMenuItems(item: MenuRootItem): MenuItem[] {
    if ((item as MenuGroup).items !== undefined) {
      return (item as MenuGroup).items;
    }
    return [item];
  }
}
