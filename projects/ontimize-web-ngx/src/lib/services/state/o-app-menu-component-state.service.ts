import { Injectable } from '@angular/core';

import { OAppSidenavComponent } from '../../components/app-sidenav/o-app-sidenav.component';
import { OAppSidenavComponentStateClass } from './o-app-menu-component-state.class';
import { AbstractComponentStateService } from './o-component-state.service';
import { MenuGroup } from '../../interfaces/app-menu.interface';
import { MenuRootItem } from '../../types/menu-root-item.type';

@Injectable()
export class OAppSidenavComponentStateService extends AbstractComponentStateService<OAppSidenavComponentStateClass, OAppSidenavComponent> {


  initialize(component: OAppSidenavComponent) {
    this.state = new OAppSidenavComponentStateClass();
    super.initialize(component);
  }

  initializeState(state: OAppSidenavComponentStateClass) {
    super.initializeState(state);
  }

  storeMenu() {
    this.state.menu = this.getMenuState(this.component.menuRootArray);
    this.localStorageService.updateComponentStorage(this.component, this.component.getRouteKey());
  }

  /**
   * Collects the `opened` state of every menu group of the menu, at any level, so groups nested
   * inside a menu section are also stored.
   */
  protected getMenuState(items: MenuRootItem[]): { id: string, opened: boolean }[] {
    return (items || []).reduce((acc: { id: string, opened: boolean }[], item: MenuGroup) => {
      if (item.opened !== undefined) {
        acc.push({ id: item.id, opened: item.opened });
      }
      return acc.concat(this.getMenuState(item.items));
    }, []);
  }

}
