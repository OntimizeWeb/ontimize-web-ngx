import { Component, forwardRef, Inject, Injector, OnInit, QueryList, ViewChildren } from '@angular/core';

import { OTableComponent } from '../../o-table.component';
import { OContextMenuComponent } from '../../../contextmenu/o-context-menu.component';
import { OContextMenuItemComponent } from '../../../contextmenu/o-context-menu-components';

export const DEFAULT_TABLE_CONTEXT_MENU_INPUTS = [
  'contextMenu : context-menu',
];

@Component({
  moduleId: module.id,
  selector: 'o-table-context-menu',
  templateUrl: './o-table-context-menu.component.html',
  inputs: DEFAULT_TABLE_CONTEXT_MENU_INPUTS
})

export class OTableContextMenuComponent {

  public contextMenu: OContextMenuComponent;

  @ViewChildren(OContextMenuItemComponent) items: QueryList<OContextMenuItemComponent>;

  constructor(
    protected injector: Injector,
    @Inject(forwardRef(() => OTableComponent)) protected table: OTableComponent
  ) { }


  ngAfterViewInit(): void {
    let items = this.contextMenu.oContextMenuItems.toArray().concat(this.items.toArray());
    this.contextMenu.oContextMenuItems.reset(items);
    this.table.registerContextMenu(this.contextMenu);
  }

  gotoDetails(data) {
    this.table.doHandleClick(data);
  }

}
