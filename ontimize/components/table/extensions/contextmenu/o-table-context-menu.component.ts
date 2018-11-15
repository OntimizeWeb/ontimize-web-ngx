import { Component, forwardRef, Inject, Injector, ViewChild } from '@angular/core';

import { OTableComponent } from '../../o-table.component';
import { OContextMenuComponent } from '../../../contextmenu/o-context-menu.component';
import { OComponentMenuItems } from '../../../contextmenu/o-content-menu.class';
import { Util } from '../../../../utils';

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

  public static INSERT_ACTION = 'INSERT_ACTION';
  public static GOTO_DETAIL = 'GOTO_DETAIL';
  public static EDIT_ACTION = 'EDIT_ACTION';
  public static SELECT_ALL = 'SELECT_ALL';
  public static COPY_CELL = 'COPY_CELL';
  public static COPY_ROW = 'COPY_ROW';
  public static COPY_ALL = 'COPY_ALL';
  public static COPY_SELECTION = 'COPY_SELECTION';


  public static INSERT_ATTR = 'insert';
  public static GOTO_DETAIL_ATTR = 'detail';
  public static EDIT_ATTR = 'edit';
  public static SELECT_ALL_ATTR = 'select_all';

  public contextMenu: OContextMenuComponent;
  @ViewChild('defaultContextMenu') defaultContextMenu: OContextMenuComponent;

  constructor(
    protected injector: Injector,
    @Inject(forwardRef(() => OTableComponent)) protected table: OTableComponent
  ) { }

  ngAfterViewInit(): void {

    let itemsParsed = this.parseItems();
    if (this.contextMenu) {
      let items = this.contextMenu.oContextMenuItems.toArray().concat(itemsParsed);
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
            if (this.table.insertButton) {
              itemsParsed.push(element);
            }
            break;
          case OTableContextMenuComponent.GOTO_DETAIL_ATTR:
            if (this.table.isDetailMode()) {
              itemsParsed.push(element);
            }
            break;
          case OTableContextMenuComponent.EDIT_ATTR:
            if (this.table.isEditionMode()) {
              itemsParsed.push(element);
            }
            break;
          case OTableContextMenuComponent.SELECT_ALL_ATTR:
            if (!this.table.isSelectionModeNone()) {
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
    this.executeAction(OTableContextMenuComponent.GOTO_DETAIL, event.data);
  }

  edit(event) {
    this.executeAction(OTableContextMenuComponent.EDIT_ACTION, event.data);
  }

  add() {
    this.executeAction(OTableContextMenuComponent.INSERT_ACTION, event);
  }

  selectAll() {
    this.executeAction(OTableContextMenuComponent.SELECT_ALL, event);
  }

  copyAll() {
    this.executeAction(OTableContextMenuComponent.COPY_ALL, event);
  }

  copyCell(event) {

    this.executeAction(OTableContextMenuComponent.COPY_CELL, event);
  }

  copySelection() {
    this.executeAction(OTableContextMenuComponent.COPY_SELECTION, event);
  }

  copyRow(event) {
    this.executeAction(OTableContextMenuComponent.COPY_ROW, event);
  }

  executeAction(option, event) {

    switch (option) {
      case OTableContextMenuComponent.INSERT_ACTION:
        this.table.add();
        break;
      case OTableContextMenuComponent.GOTO_DETAIL:
        this.table.viewDetail(event.data);
        break;
      case OTableContextMenuComponent.EDIT_ACTION:
        this.table.doHandleClick(event.data);
        break;
      case OTableContextMenuComponent.SELECT_ALL:
        this.table.showAndSelectAllCheckbox();
        break;
      case OTableContextMenuComponent.COPY_ALL:
        this.table.copyAll();
        break;
      case OTableContextMenuComponent.COPY_SELECTION:
        this.table.copySelection();
        break;
      case OTableContextMenuComponent.COPY_CELL:
        let cell_data = this.defaultContextMenu.origin.innerHTML;
        this.table.copyData(cell_data);
        break;

      case OTableContextMenuComponent.COPY_ROW:
        this.table.copyData(JSON.stringify(event.data));

        break;
    }
  }





  // deshabilitar opcion selectAllCheckbox si select-all-checkbox = false
  // deshabilitar opcion insertar si detail-mode es
}
