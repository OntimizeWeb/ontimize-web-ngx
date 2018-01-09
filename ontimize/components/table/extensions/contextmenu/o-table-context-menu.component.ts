import { Component, forwardRef, Inject, Injector, OnInit } from '@angular/core';

import { OTableComponent } from '../../o-table-components';
import { OContextMenuComponent } from '../../../contextmenu/o-context-menu.component';

export const DEFAULT_TABLE_CONTEXT_MENU_INPUTS = [
  'contextMenu : context-menu',
];

@Component({
  selector: 'o-table-context-menu',
  template: '',
  inputs: DEFAULT_TABLE_CONTEXT_MENU_INPUTS
})

export class OTableContextMenuComponent implements OnInit {

  public contextMenu: OContextMenuComponent;

  constructor(
    protected injector: Injector,
    @Inject(forwardRef(() => OTableComponent)) protected table: OTableComponent
  ) { }

  ngOnInit() {
    this.table.registerContextMenu(this.contextMenu);
  }

}
