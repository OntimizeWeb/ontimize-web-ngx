import { Component, EventEmitter, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Highlightable } from '@angular/cdk/a11y';

import { Util } from '../../../util/util';

export const DEFAULT_CONTEXT_MENU_ITEM_INPUTS = [
  'icon',
  'data',
  'label',
  'oenabled: enabled',
  'ovisible: visible'
];

export const DEFAULT_CONTEXT_MENU_ITEM_OUTPUTS = [
  'execute'
];

@Component({
  selector: 'o-context-menu-item',
  templateUrl: 'o-context-menu-item.component.html',
  styleUrls: ['o-context-menu-item.component.scss'],
  inputs: DEFAULT_CONTEXT_MENU_ITEM_INPUTS,
  outputs: DEFAULT_CONTEXT_MENU_ITEM_OUTPUTS,
  encapsulation: ViewEncapsulation.None
})
export class OContextMenuItemComponent implements Highlightable, OnInit {

  protected oenabled;
  protected ovisible;

  public isActive = false;
  public icon: string;
  public data: any;
  public label: string;
  public enabled: boolean | ((item: any) => boolean) = true;
  public visible: boolean | ((item: any) => boolean) = true;
  public execute: EventEmitter<{ event: Event, data: any }> = new EventEmitter();

  @ViewChild('templateref', { read: TemplateRef }) public templateref: TemplateRef<any>;

  ngOnInit() {
    this.enabled = this.parseInput(this.oenabled, true);
    this.visible = this.parseInput(this.ovisible, true);
  }

  public get disabled() {
    if (this.enabled instanceof Function) {
      return !this.enabled(this.data);
    }
    return !this.enabled;
  }

  public get isVisible() {
    if (this.visible instanceof Function) {
      return this.visible(this.data);
    }
    return this.visible;
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

  protected parseInput(value: any, defaultValue?: boolean): boolean {
    if (value instanceof Function || typeof value === 'boolean') {
      return value;
    }
    return Util.parseBoolean(value, defaultValue);
  }

}
