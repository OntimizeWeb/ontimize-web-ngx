import { Component, Injector, Input, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';

import { OContextMenuGroupComponent } from '../../context-menu-group/o-context-menu-group.component';
import { OContextMenuItemComponent } from '../../context-menu-item/o-context-menu-item.component';
import { OContextMenuSeparatorComponent } from '../../context-menu-separator/o-context-menu-separator.component';
import { OComponentMenuBaseItem } from '../../o-content-menu-base-item.class';

export const DEFAULT_CONTEXT_MENU_CONTENT_ITEM_INPUTS = [
  'items',
  'class'
];

@Component({
  selector: 'o-wrapper-content-menu',
  templateUrl: 'o-wrapper-content-menu.component.html',
  styleUrls: ['./o-wrapper-content-menu.component.scss'],
  inputs: DEFAULT_CONTEXT_MENU_CONTENT_ITEM_INPUTS
})
export class OWrapperContentMenuComponent {

  public class: string;

  @Input()
  public items: OComponentMenuBaseItem[];

  @ViewChild('childMenu', { static: true })
  public childMenu: MatMenu;

  @ViewChild(OWrapperContentMenuComponent, { static: true })
  public menu: OWrapperContentMenuComponent;

  constructor(
    protected injector: Injector
  ) { }

  public onClick(item: OComponentMenuBaseItem, event?): void {
    if (item instanceof OContextMenuItemComponent) {
      item.triggerExecute(item.data, event);
    }
  }

  public isGroup(item: OComponentMenuBaseItem): boolean {
    return item instanceof OContextMenuGroupComponent;
  }

  public isSeparator(item: OComponentMenuBaseItem): boolean {
    return item instanceof OContextMenuSeparatorComponent;
  }

  public isItem(item: OComponentMenuBaseItem): boolean {
    return item instanceof OContextMenuItemComponent;
  }

  public getChildren(item: OComponentMenuBaseItem) {
    return item instanceof OContextMenuGroupComponent ? item.children : [];
  }

}
