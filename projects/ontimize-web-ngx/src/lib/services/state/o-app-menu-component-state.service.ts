import { Injectable } from '@angular/core';

import { OAppSidenavComponent } from '../../components/app-sidenav/o-app-sidenav.component';
import { OAppSidenavComponentStateClass } from './o-app-menu-component-state.class';
import { AbstractComponentStateService } from './o-component-state.service';
import { MenuGroup } from '../../interfaces/app-menu.interface';

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
    let menuState = this.component.menuRootArray
      .filter((group: MenuGroup) => group.opened !== undefined)
      .reduce((acc: { id: string, opened: boolean }[], group: MenuGroup) => {
        acc.push({ id: group.id, opened: group.opened });
        return acc;
      }, []);

    this.state.menu = menuState;
    this.localStorageService.updateComponentStorage(this.component, this.component.getRouteKey());
  }

}
