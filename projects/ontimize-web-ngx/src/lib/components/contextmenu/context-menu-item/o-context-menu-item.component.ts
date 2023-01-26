import { Component, EventEmitter, forwardRef } from '@angular/core';

import { OnExecuteTableContextEvent } from '../../../interfaces/o-table-context-onexecute.interface';
import { DEFAULT_INPUTS_O_CONTEXT_MENU_ITEMS, OComponentMenuBaseItem } from '../o-content-menu-base-item.class';

export const DEFAULT_CONTEXT_MENU_ITEM_OUTPUTS = [
  'execute'
];

export const DEFAULT_INPUTS_O_CONTEXT_MENU_ITEM = [
  ...DEFAULT_INPUTS_O_CONTEXT_MENU_ITEMS
];

@Component({
  selector: 'o-context-menu-item',
  template: ' ',
  inputs: DEFAULT_INPUTS_O_CONTEXT_MENU_ITEM,
  outputs: DEFAULT_CONTEXT_MENU_ITEM_OUTPUTS,
  providers: [{ provide: OComponentMenuBaseItem, useExisting: forwardRef(() => OContextMenuItemComponent) }]
})
export class OContextMenuItemComponent extends OComponentMenuBaseItem {

  public execute: EventEmitter<OnExecuteTableContextEvent> = new EventEmitter();
  public type = OComponentMenuBaseItem.TYPE_ITEM_MENU;

  public onClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.triggerExecute(this.data, event);
  }

  public triggerExecute(data: any, $event?: Event): void {
    if (!this.enabled) {
      return;
    }
    this.execute.emit({ event: $event, data: data });
  }
}
