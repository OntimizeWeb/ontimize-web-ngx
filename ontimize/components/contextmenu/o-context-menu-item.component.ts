import { Component, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { Highlightable } from '@angular/cdk/a11y';

import { InputConverter } from '../../decorators';

export const DEFAULT_CONTEXT_MENU_ITEM_INPUTS = [
  'icon',
  'data',
  'label',
  'oenabled: enabled'
];

export const DEFAULT_CONTEXT_MENU_ITEM_OUTPUTS = [
  'execute'
];

@Component({
  selector: 'o-context-menu-item',
  templateUrl: 'o-context-menu-item.component.html',
  styleUrls: ['o-context-menu-item.component.scss'],
  inputs: DEFAULT_CONTEXT_MENU_ITEM_INPUTS,
  outputs: DEFAULT_CONTEXT_MENU_ITEM_OUTPUTS
})
export class OContextMenuItemComponent implements Highlightable {

  public icon: string;
  public data: any;
  public label: string;
  public execute: EventEmitter<{ event: Event, data: any }> = new EventEmitter();

  @ViewChild('templateref', { read: TemplateRef }) public templateref: TemplateRef<any>;

  public isActive = false;

  @InputConverter()
  protected oenabled: boolean = true;

  public get disabled() {
    return !this.oenabled;
  }

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
