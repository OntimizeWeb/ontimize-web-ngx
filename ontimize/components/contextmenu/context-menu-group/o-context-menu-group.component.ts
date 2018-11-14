import { Component, OnInit, forwardRef, ContentChildren, QueryList } from '@angular/core';
import { DEFAULT_INPUTS_O_CONTEXT_MENU_ITEMS, OComponentMenu } from '../o-content-menu.class';

export const DEFAULT_CONTEXT_MENU_GROUP_INPUTS = [
  ...DEFAULT_INPUTS_O_CONTEXT_MENU_ITEMS,
  'children'];

@Component({
  moduleId: module.id,
  selector: 'o-context-menu-group',
  template: ' ',
  inputs: DEFAULT_CONTEXT_MENU_GROUP_INPUTS,
  providers: [{ provide: OComponentMenu, useExisting: forwardRef(() => OContextMenuGroupComponent) }]
})

//export class OContextMenuGroupComponent  implements  OnInit {
export class OContextMenuGroupComponent extends OComponentMenu implements OnInit {

  public type = 'group';
  public children = [];

  @ContentChildren(OComponentMenu) public oContextMenuItems: QueryList<OComponentMenu>;


  ngAfterContentInit() {
    this.children = this.oContextMenuItems.toArray().slice(1, this.oContextMenuItems.toArray().length);
  }

  public setActiveStyles(): void {
    this.isActive = true;
  }

  public setInactiveStyles(): void {
    this.isActive = false;
  }

}
