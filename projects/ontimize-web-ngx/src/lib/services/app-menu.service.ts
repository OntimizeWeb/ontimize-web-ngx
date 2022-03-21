import { Injectable, Injector } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AppConfig } from '../config/app-config';
import {
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

@Injectable({
  providedIn: 'root'
})
export class AppMenuService {

  protected router: Router;
  protected _config: AppConfig;
  protected MENU_ROOTS: MenuRootItem[];
  protected ALL_MENU_ITEMS: MenuItem[];
  protected activeItem: MenuItemRoute;

  public onClick: Subject<any> = new Subject();

  constructor(protected injector: Injector) {
    this._config = this.injector.get(AppConfig);
    this.MENU_ROOTS = this._config.getMenuConfiguration();
    this.router = this.injector.get(Router);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setActiveItem();
      }
    });

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

  isItemActive(item: MenuItemRoute): boolean {
    return this.activeItem && this.activeItem.route === item.route;
  }

  private getMenuItems(item: MenuRootItem): MenuItem[] {
    if ((item as MenuGroup).items !== undefined) {
      return (item as MenuGroup).items;
    }
    return [item];
  }

  private setActiveItem(): void {
    let activeItem: MenuItemRoute;
    const routeItems: MenuItemRoute[] = this.ALL_MENU_ITEMS.filter(item => this.getMenuItemType(item) === 'route') as MenuItemRoute[];
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
