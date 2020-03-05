import { Component, Injector, ViewEncapsulation } from '@angular/core';

import { AppMenuService, MenuRootItem } from '../../../services/app-menu.service';

export const DEFAULT_INPUTS_O_BAR_MENU_NESTED = [
  'items'
];

@Component({
  selector: 'o-bar-menu-nested',
  templateUrl: './o-bar-menu-nested.component.html',
  inputs: DEFAULT_INPUTS_O_BAR_MENU_NESTED,
  encapsulation: ViewEncapsulation.None
})
export class OBarMenuNestedComponent {

  private appMenuService: AppMenuService;
  public items: MenuRootItem[];

  constructor(
    protected injector: Injector) {
    this.appMenuService = this.injector.get(AppMenuService);
  }

  getValueOfAttr(menu: object, attr: string) {
    let valAttr = '';
    if (menu.hasOwnProperty(attr)) {
      valAttr = menu[attr];
    }
    return valAttr;
  }

  isMenuGroup(item: any): boolean {
    return this.appMenuService.getMenuItemType(item) === 'group';
  }
}
