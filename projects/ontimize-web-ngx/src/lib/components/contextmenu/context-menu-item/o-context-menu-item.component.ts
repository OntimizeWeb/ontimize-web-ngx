import { Component, EventEmitter, forwardRef, OnInit } from '@angular/core';

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
  moduleId: module.id,
  selector: 'o-context-menu-item',
  template: ' ',
  inputs: DEFAULT_INPUTS_O_CONTEXT_MENU_ITEM,
  outputs: DEFAULT_CONTEXT_MENU_ITEM_OUTPUTS,
  providers: [{ provide: OComponentMenuItems, useExisting: forwardRef(() => OContextMenuItemComponent) }]
})
export class OContextMenuItemComponent extends OComponentMenuItems implements OnInit {

  public execute: EventEmitter<{ event: Event, data: any }> = new EventEmitter();
  public type = OComponentMenuItems.TYPE_ITEM_MENU;
  public icon: string;
  public data: any;
  public label: string;
  public enabled: boolean | ((item: any) => boolean) = true;
  public svgIcon: string;
  protected oenabled;

  public ngOnInit(): void {
    this.enabled = this.parseInput(this.oenabled, true);
  }

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

}
