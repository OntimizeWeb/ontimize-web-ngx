import { Component, Injector, ViewChild, Input } from '@angular/core';
import { OContextMenuService } from '../../o-context-menu.service';
import { OComponentMenuItems } from '../../o-content-menu.class';
import { MatMenu } from '@angular/material/menu';

export const DEFAULT_CONTEXT_MENU_CONTENT_ITEM_INPUTS = [
  'items'
];


@Component({
  moduleId: module.id,
  selector: 'o-menu-item',
  templateUrl: 'o-menu-item.component.html',
  inputs: DEFAULT_CONTEXT_MENU_CONTENT_ITEM_INPUTS
})
export class OMenuItemComponent {

  @Input() items: any[];
  @ViewChild('childMenu') public childMenu: MatMenu;
  @ViewChild(OMenuItemComponent) menu: OMenuItemComponent;

  constructor(
    protected injector: Injector,
    protected menuService: OContextMenuService
  ) { }

  onClick(item, event?) {
    item.triggerExecute(item.data, event);
  }

  isGroup(item): boolean {
    let isGroup = false;
    if (item && item.children && item.children.length > 0) {
      isGroup = true;
    }
    return isGroup;
  }
  isSepararor(item): boolean {
    let isSepararor = false;
    if (item && item.type && item.type === OComponentMenuItems.TYPE_SEPARATOR_MENU) {
      isSepararor = true;
    }
    return isSepararor;
  }

  isItem(item): boolean {
    let isItem = false;
    if (item && item.type && item.type === OComponentMenuItems.TYPE_ITEM_MENU) {
      isItem = true;
    }
    return isItem;
  }


}
