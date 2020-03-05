import { Component, forwardRef, OnInit } from '@angular/core';

import { OContextMenuItemComponent } from '../context-menu-item/o-context-menu-item.component';
import { DEFAULT_INPUTS_O_CONTEXT_MENU_ITEMS, OComponentMenuItems } from '../o-content-menu.class';

export const DEFAULT_CONTEXT_MENU_ITEM_INPUTS = [
  ...DEFAULT_INPUTS_O_CONTEXT_MENU_ITEMS
];

@Component({
  selector: 'o-context-menu-separator',
  template: ' ',
  inputs: DEFAULT_CONTEXT_MENU_ITEM_INPUTS,
  providers: [{ provide: OComponentMenuItems, useExisting: forwardRef(() => OContextMenuSeparatorComponent) }]
})
export class OContextMenuSeparatorComponent extends OContextMenuItemComponent implements OnInit {

  public type = OComponentMenuItems.TYPE_SEPARATOR_MENU;

  public ngOnInit(): void {
    super.ngOnInit();
  }

}
