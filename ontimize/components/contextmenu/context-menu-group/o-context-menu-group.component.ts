import { Component, OnInit, forwardRef, ContentChildren, QueryList } from '@angular/core';
import { OComponentMenuItems } from '../o-content-menu.class';
import { OContextMenuItemComponent, DEFAULT_INPUTS_O_CONTEXT_MENU_ITEM } from '../o-context-menu-components';

export const DEFAULT_CONTEXT_MENU_GROUP_INPUTS = [
  ...DEFAULT_INPUTS_O_CONTEXT_MENU_ITEM,
  'children'];

@Component({
  moduleId: module.id,
  selector: 'o-context-menu-group',
  template: ' ',
  inputs: DEFAULT_CONTEXT_MENU_GROUP_INPUTS,
  providers: [{ provide: OComponentMenuItems, useExisting: forwardRef(() => OContextMenuGroupComponent) }]
})

export class OContextMenuGroupComponent extends OContextMenuItemComponent  implements OnInit {

  public type = OComponentMenuItems.TYPE_GROUP_MENU;
  public children = [];

  @ContentChildren(OComponentMenuItems) public oContextMenuItems: QueryList<OComponentMenuItems>;

  ngOnInit() {
    super.ngOnInit();
  }

  ngAfterContentInit() {
    this.children = this.oContextMenuItems.toArray().slice(1, this.oContextMenuItems.toArray().length);
  }

}
