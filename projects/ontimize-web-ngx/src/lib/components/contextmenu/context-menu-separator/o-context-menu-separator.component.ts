import { Component, forwardRef } from '@angular/core';

import { OComponentMenuBaseItem } from '../o-content-menu-base-item.class';

export const DEFAULT_CONTEXT_MENU_ITEM_INPUTS = [
  'attr',
  'ovisible: visible'
];

@Component({
  selector: 'o-context-menu-separator',
  template: ' ',
  inputs: DEFAULT_CONTEXT_MENU_ITEM_INPUTS,
  providers: [{ provide: OComponentMenuBaseItem, useExisting: forwardRef(() => OContextMenuSeparatorComponent) }]
})
export class OContextMenuSeparatorComponent extends OComponentMenuBaseItem  {

  public type = OComponentMenuBaseItem.TYPE_SEPARATOR_MENU;

}
