import { Component, forwardRef, Inject, Injector, ViewChild } from '@angular/core';

import { OTableComponent } from '../../o-table.component';
import { OContextMenuComponent } from '../../../contextmenu/o-context-menu-components';
import { Util } from '../../../../utils';
import { InputConverter } from '../../../../decorators';

export const DEFAULT_TABLE_CONTEXT_MENU_INPUTS = [
  'contextMenu : context-menu',
  'showInsert:insert',
  'showEdit:edit',
  'showViewDetail:view-detail',
  'showCopy:copy',
  'showSelectAll:select-all'
];

@Component({
  moduleId: module.id,
  selector: 'o-table-context-menu',
  templateUrl: './o-table-context-menu.component.html',
  inputs: DEFAULT_TABLE_CONTEXT_MENU_INPUTS
})

export class OTableContextMenuComponent {

  public static INSERT_ATTR = 'insert';
  public static GOTO_DETAIL_ATTR = 'detail';
  public static EDIT_ATTR = 'edit';
  public static SELECT_ALL_ATTR = 'select-all';
  public static COPY_ATTR = 'copy';

  @InputConverter()
  showInsert: boolean = true;
  @InputConverter()
  showEdit: boolean = true;
  @InputConverter()
  showViewDetail: boolean = false;
  @InputConverter()
  showCopy: boolean = true;
  @InputConverter()
  showSelectAll: boolean = true;


  public contextMenu: OContextMenuComponent;
  @ViewChild('defaultContextMenu') defaultContextMenu: OContextMenuComponent;

  constructor(
    protected injector: Injector,
    @Inject(forwardRef(() => OTableComponent)) protected table: OTableComponent
  ) { }

  ngAfterViewInit(): void {

    let itemsParsed = this.defaultContextMenu.oContextMenuItems.toArray();
    if (this.contextMenu) {
      let items = itemsParsed.concat(this.contextMenu.oContextMenuItems.toArray());
      this.defaultContextMenu.oContextMenuItems.reset(items);
    } else {
      this.defaultContextMenu.oContextMenuItems.reset(itemsParsed);
    }
    this.table.registerContextMenu(this.defaultContextMenu);
  }

  isVisibleDetail() {
    let isVisible = false;
    if (this.showViewDetail) {
      isVisible = true;
    }
    return isVisible;
  }

  isVisibleEdit() {
    let isVisible = false;
    if (this.showEdit) {
      isVisible = true;
    }
    return isVisible;
  }

  isVisibleInsert() {
    let isVisible = false;
    if (this.showInsert) {
      isVisible = true;
    }
    return isVisible;
  }
  isVisibleSelectAll() {
    let isVisible = false;
    if (this.showSelectAll && !this.table.isSelectionModeNone()) {
      isVisible = true;
    }
    return isVisible;
  }

  isVisibleCopy() {
    let isVisible = false;
    if (this.showCopy) {
      isVisible = true;
    }
    return isVisible;
  }


  gotoDetails(event) {
    this.table.viewDetail(event.data);
  }

  edit(event) {
    this.table.doHandleClick(event.data);
  }

  add() {
    this.table.add();
  }

  selectAll() {
    this.table.showAndSelectAllCheckbox();
  }

  copyAll() {
    this.table.copyAll();
  }

  copyCell(event) {
    let cell_data = this.defaultContextMenu.origin.innerText;
    Util.copyToClipboard(cell_data);
  }

  copySelection() {
    this.table.copySelection();
  }

  copyRow(event) {
    var data = JSON.stringify(this.table.dataSource.getRenderedData([event.data]));
    Util.copyToClipboard(data);
  }


}
