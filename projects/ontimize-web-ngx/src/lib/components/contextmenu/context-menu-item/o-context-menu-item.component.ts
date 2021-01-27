import { Component, EventEmitter, forwardRef, OnInit } from '@angular/core';
import { OnExecuteTableContextEvent } from '../../../interfaces/o-table-context-onexecute.interface';

import { DEFAULT_INPUTS_O_CONTEXT_MENU_ITEMS, OComponentMenuItems } from '../o-content-menu.class';

export const DEFAULT_CONTEXT_MENU_ITEM_OUTPUTS = [
  'execute'
];

export const DEFAULT_INPUTS_O_CONTEXT_MENU_ITEM = [
  ...DEFAULT_INPUTS_O_CONTEXT_MENU_ITEMS,
  'icon',
  'data',
  'label',
  'oenabled: enabled',
  'svgIcon: svg-icon'];

@Component({
  selector: 'o-context-menu-item',
  template: ' ',
  inputs: DEFAULT_INPUTS_O_CONTEXT_MENU_ITEM,
  outputs: DEFAULT_CONTEXT_MENU_ITEM_OUTPUTS,
  providers: [{ provide: OComponentMenuItems, useExisting: forwardRef(() => OContextMenuItemComponent) }]
})
export class OContextMenuItemComponent extends OComponentMenuItems{

  public execute: EventEmitter<OnExecuteTableContextEvent> = new EventEmitter();
  public type = OComponentMenuItems.TYPE_ITEM_MENU;
  public icon: string;
  public data: any;
  public label: string;
  public enabled: boolean | ((item: any) => boolean) = true;
  public svgIcon: string;

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

  public get disabled(): boolean {
    if (this.enabled instanceof Function) {
      return !this.enabled(this.data);
    }
    return !this.enabled;
  }

  public get isVisible(): boolean {
    if (this.ovisible instanceof Function) {
      return this.ovisible(this.data);
    }
    return this.ovisible;
  }

  public set oenabled(value: (boolean | ((item: any) => boolean))) {
    if (value instanceof Function) {
      this.enabled = value;
    } else {
      this.enabled = this.parseInput(value, true);
    }
  }

}
