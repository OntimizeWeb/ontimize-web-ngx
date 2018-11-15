import { Component, OnInit, forwardRef, ContentChildren, QueryList } from '@angular/core';
import { DEFAULT_INPUTS_O_CONTEXT_MENU_ITEMS, OComponentMenuItems } from '../o-content-menu.class';

export const DEFAULT_CONTEXT_MENU_GROUP_INPUTS = [
  ...DEFAULT_INPUTS_O_CONTEXT_MENU_ITEMS,
  'children'];

@Component({
  moduleId: module.id,
  selector: 'o-context-menu-group',
  template: ' ',
  inputs: DEFAULT_CONTEXT_MENU_GROUP_INPUTS,
  providers: [{ provide: OComponentMenuItems, useExisting: forwardRef(() => OContextMenuGroupComponent) }]
})

export class OContextMenuGroupComponent extends OComponentMenuItems implements OnInit {

  public type = OComponentMenuItems.TYPE_GROUP_MENU;
  public children = [];

  @ContentChildren(OComponentMenuItems) public oContextMenuItems: QueryList<OComponentMenuItems>;


  ngAfterContentInit() {
    this.children = this.oContextMenuItems.toArray().slice(1, this.oContextMenuItems.toArray().length);
  }


}
