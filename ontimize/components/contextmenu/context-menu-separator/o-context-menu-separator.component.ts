import { Component, forwardRef, OnInit } from '@angular/core';
import { OComponentMenuItems, DEFAULT_INPUTS_O_CONTEXT_MENU_ITEMS } from '../o-content-menu.class';
import { OContextMenuItemComponent } from '../o-context-menu-components';
export const DEFAULT_CONTEXT_MENU_ITEM_INPUTS = [...DEFAULT_INPUTS_O_CONTEXT_MENU_ITEMS];
@Component({
  moduleId: module.id,
  selector: 'o-context-menu-separator',
  template: ' ',
  inputs: DEFAULT_CONTEXT_MENU_ITEM_INPUTS,
  providers: [{ provide: OComponentMenuItems, useExisting: forwardRef(() => OContextMenuSeparatorComponent) }]

})

export class OContextMenuSeparatorComponent extends OContextMenuItemComponent implements OnInit {
  public type = OComponentMenuItems.TYPE_SEPARATOR_MENU;

  ngOnInit() {
    super.ngOnInit();
  }

}
