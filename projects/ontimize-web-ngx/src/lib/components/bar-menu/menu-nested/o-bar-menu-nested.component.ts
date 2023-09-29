import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';

import { AppMenuService } from '../../../services/app-menu.service';
import { MenuRootItem } from '../../../types/menu-root-item.type';

export const DEFAULT_INPUTS_O_BAR_MENU_NESTED = [
  'items'
];

@Component({
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

}
