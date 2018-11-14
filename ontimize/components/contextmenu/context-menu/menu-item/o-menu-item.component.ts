import { Component, Injector, ViewChild, Input } from '@angular/core';
import { OContextMenuService } from '../../o-context-menu.service';

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
  @ViewChild('childMenu') public childMenu;


  constructor(
    protected injector: Injector,
    protected menuService: OContextMenuService
  ) { }

  onClick(event, data) {
    data.triggerExecute(data, event);
  }

  isGroup(item): boolean {
    let isGroup = false;
    if (item && item.children && item.children.length > 0) {
      isGroup = true;
    }
    return isGroup;
  }

}
