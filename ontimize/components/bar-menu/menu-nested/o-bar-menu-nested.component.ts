import { Component, Injector, ViewEncapsulation, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMenuService, MenuRootItem } from '../../../services/app-menu.service';
import { OBarMenuGroupModule } from '../menu-group/o-bar-menu-group.component';
import { OBarMenuItemModule } from '../menu-item/o-bar-menu-item.component';

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

  public static DEFAULT_INPUTS_O_BAR_MENU = DEFAULT_INPUTS_O_BAR_MENU_NESTED;

  private appMenuService: AppMenuService;
  public items: MenuRootItem[];

  constructor(
    protected injector: Injector) {
    this.appMenuService = this.injector.get(AppMenuService);
  }

  getValueOfAttr(menu: Object, attr: string) {
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

@NgModule({
  declarations: [OBarMenuNestedComponent],
  imports: [CommonModule, OBarMenuGroupModule, OBarMenuItemModule],
  exports: [OBarMenuNestedComponent]
})
export class OBarMenuNestedModule {
}
