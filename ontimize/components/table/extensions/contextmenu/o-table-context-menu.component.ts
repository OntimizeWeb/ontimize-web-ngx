import { Component, forwardRef, Inject, Injector, ViewChild } from '@angular/core';

import { OTableComponent } from '../../o-table.component';
import { OContextMenuComponent, OComponentMenuItems } from '../../../contextmenu/o-context-menu-components';
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

    let itemsParsed = this.parseItems();
    if (this.contextMenu) {
      let items = itemsParsed.concat(this.contextMenu.oContextMenuItems.toArray());
      this.defaultContextMenu.oContextMenuItems.reset(items);
    } else {
      this.defaultContextMenu.oContextMenuItems.reset(itemsParsed);
    }
    this.table.registerContextMenu(this.defaultContextMenu);
  }

  parseItems(items?: OComponentMenuItems[]): OComponentMenuItems[] {
    let itemsParsed = [];
    if (!Util.isDefined(items)) {
      items = this.defaultContextMenu.oContextMenuItems.toArray();
    }
    items.forEach(element => {
      let attr = element.attr;
      if (element.isItemMenu()) {
        switch (attr) {
          case OTableContextMenuComponent.INSERT_ATTR:
            if (this.showInsert) {
              itemsParsed.push(element);
            }
            break;
          case OTableContextMenuComponent.GOTO_DETAIL_ATTR:
            if (this.showViewDetail) {
              itemsParsed.push(element);
            }
            break;
          case OTableContextMenuComponent.EDIT_ATTR:
            if (this.showEdit) {
              itemsParsed.push(element);
            }
            break;
          case OTableContextMenuComponent.SELECT_ALL_ATTR:
            if (this.showSelectAll && !this.table.isSelectionModeNone()) {
              itemsParsed.push(element);
            }
            break;
            case OTableContextMenuComponent.COPY_ATTR:
            if (this.showCopy) {
              itemsParsed.push(element);
            }
            break;
          default:
            itemsParsed.push(element);
            break;
        }
      } else {
        element.children = this.parseItems(element.children);
        itemsParsed.push(element);
      }
    });

    return itemsParsed;
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
