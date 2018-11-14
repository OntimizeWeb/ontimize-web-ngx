import { Component, EventEmitter, OnInit, forwardRef } from '@angular/core';
import { Highlightable } from '@angular/cdk/a11y';
import { OComponentMenu, DEFAULT_INPUTS_O_CONTEXT_MENU_ITEMS } from '../o-content-menu.class';

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
  providers: [{ provide: OComponentMenu, useExisting: forwardRef(() => OContextMenuItemComponent) }]

})
export class OContextMenuItemComponent extends OComponentMenu implements Highlightable, OnInit {

  public execute: EventEmitter<{ event: Event, data: any }> = new EventEmitter();
  public type = 'item';

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

  public setActiveStyles(): void {
    this.isActive = true;
  }

  public setInactiveStyles(): void {
    this.isActive = false;
  }

}
