import { Component, EventEmitter, OnInit, forwardRef } from '@angular/core';
import { OComponentMenuItems, DEFAULT_INPUTS_O_CONTEXT_MENU_ITEMS } from '../o-content-menu.class';

export const DEFAULT_CONTEXT_MENU_ITEM_OUTPUTS = [
  'execute'
];

export const DEFAULT_CONTEXT_MENU_ITEM_INPUTS = [...DEFAULT_INPUTS_O_CONTEXT_MENU_ITEMS];
@Component({
  moduleId: module.id,
  selector: 'o-context-menu-item',
  template: ' ',
  inputs: DEFAULT_CONTEXT_MENU_ITEM_INPUTS,
  outputs: DEFAULT_CONTEXT_MENU_ITEM_OUTPUTS,
  providers: [{ provide: OComponentMenuItems, useExisting: forwardRef(() => OContextMenuItemComponent) }]

})
export class OContextMenuItemComponent extends OComponentMenuItems implements OnInit {

  public execute: EventEmitter<{ event: Event, data: any }> = new EventEmitter();
  public type = OComponentMenuItems.TYPE_ITEM_MENU;

  public onClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.triggerExecute(this.data, event);
  }

  public triggerExecute(data: any, $event?: Event): void {
    if (this.disabled) {
      return;
    }
    this.execute.emit({ event: $event, data: data });
  }



}
