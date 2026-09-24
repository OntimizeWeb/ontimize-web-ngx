import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { NgClass } from '@angular/common';

import { MenuSection } from '../../../interfaces/app-menu.interface';
import { AppMenuService } from '../../../services/app-menu.service';
import { MenuRootItem } from '../../../types/menu-root-item.type';
import { OBarMenuGroupComponent } from '../menu-group/o-bar-menu-group.component';
import { OBarMenuItemComponent } from '../menu-item/o-bar-menu-item.component';
import { OLocaleBarMenuItemComponent } from '../locale-menu-item/o-locale-bar-menu-item.component';

export const DEFAULT_INPUTS_O_BAR_MENU_NESTED = [
  'items'
];

@Component({
  standalone: true,
  imports: [NgClass, OBarMenuGroupComponent, OLocaleBarMenuItemComponent, OBarMenuItemComponent, OBarMenuNestedComponent],
  selector: 'o-bar-menu-nested',
  templateUrl: './o-bar-menu-nested.component.html',
  inputs: DEFAULT_INPUTS_O_BAR_MENU_NESTED,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OBarMenuNestedComponent {

  public appMenuService: AppMenuService;
  public items: MenuRootItem[];

  constructor(
    protected injector: Injector
  ) {
    this.appMenuService = this.injector.get(AppMenuService);
  }

  /**
   * Menu sections have no equivalent in the bar menu, so they are rendered as regular menu groups.
   */
  getItemType(item: MenuRootItem): string {
    const type = this.appMenuService.getMenuItemType(item);
    return type === 'section' ? 'group' : type;
  }

  isItemVisible(item: MenuRootItem): boolean {
    return this.appMenuService.isMenuSection(item)
      ? this.appMenuService.isSectionVisible(item as MenuSection)
      : this.appMenuService.isVisible(item);
  }

}
