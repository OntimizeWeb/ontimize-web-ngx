import { Component, forwardRef, Inject, Injector, QueryList, ViewChildren, ViewChild, OnInit } from '@angular/core';

import { OTableComponent } from '../../o-table.component';
import { OContextMenuComponent } from '../../../contextmenu/o-context-menu.component';
import { OContextMenuItemComponent } from '../../../contextmenu/o-context-menu-components';
import { OPermissions, PermissionsService, SnackBarService } from '../../../../services';


export const DEFAULT_TABLE_CONTEXT_MENU_INPUTS = [
  'contextMenu : context-menu',
];

@Component({
  moduleId: module.id,
  selector: 'o-table-context-menu',
  templateUrl: './o-table-context-menu.component.html',
  inputs: DEFAULT_TABLE_CONTEXT_MENU_INPUTS
})

export class OTableContextMenuComponent implements OnInit {

  public static INSERT_ACTION = 'INSERT_ACTION';
  public static GOTO_DETAIL = 'GOTO_DETAIL';
  public static EDIT_ACTION = 'EDIT_ACTION';
  public static SELECT_ALL = 'SELECT_ALL';

  public contextMenu: OContextMenuComponent;


  @ViewChildren(OContextMenuItemComponent) items: QueryList<OContextMenuItemComponent>;
  @ViewChild('defaultContextMenu') defaultContextMenu: OContextMenuComponent;
  protected actionsPermissions: OPermissions[];
  private permissionService: PermissionsService;
  private snackBarService: SnackBarService;

  constructor(
    protected injector: Injector,
    @Inject(forwardRef(() => OTableComponent)) protected table: OTableComponent
  ) {
    this.permissionService = this.injector.get(PermissionsService);
    this.snackBarService = this.injector.get(SnackBarService);
  }

  ngOnInit() {
    this.parsePermissions();
  }

  ngAfterViewInit(): void {
    if (this.contextMenu) {
      let items = this.contextMenu.oContextMenuItems.toArray().concat(this.items.toArray());
      this.defaultContextMenu.oContextMenuItems.reset(items);
    }
    this.table.registerContextMenu(this.defaultContextMenu);
  }

  gotoDetails(item) {
    if (!this.table.hasDetailMode()) {
      return;
    }
    this.executeAction(OTableContextMenuComponent.GOTO_DETAIL, item);
  }

  edit(item) {
    if (!this.table.hasDetailMode()) {
      return;
    }
    this.executeAction(OTableContextMenuComponent.EDIT_ACTION, item);
  }

  add() {
    if (!this.table.hasDetailMode()) {
      return;
    }

    this.executeAction(OTableContextMenuComponent.INSERT_ACTION);
  }

  selectAll() {
    this.executeAction(OTableContextMenuComponent.SELECT_ALL);
  }


  executeAction(option, item?) {
    if (!this.checkEnabledPermission(PermissionsService.PERMISSIONS_ACTIONS_INSERT_FORM)) {
      return;
    }

    switch (option) {
      case OTableContextMenuComponent.INSERT_ACTION:
        this.table.add();
        break;
      case OTableContextMenuComponent.GOTO_DETAIL:
        this.table.viewDetail(item);
        break;
      case OTableContextMenuComponent.EDIT_ACTION:
        this.table.editDetail(item);
        break;
      case OTableContextMenuComponent.SELECT_ALL:
        this.table.showAndSelectAllCheckbox();
        break;
    }
  }



  protected parsePermissions() {
    if (this.table.oattr) {
      this.actionsPermissions = this.permissionService.getActionsContextMenuTablePermissions(this.table.oattr);
    }
  }

  private checkEnabledPermission(attr) {
    const permissions: OPermissions = (this.actionsPermissions || []).find(p => p.attr === attr);
    let enabledPermision = PermissionsService.checkEnabledPermission(permissions);
    if (!enabledPermision) {
      this.snackBarService.open(PermissionsService.MESSAGE_OPERATION_NOT_ALLOWED_PERMISSION);
    }
    return enabledPermision;
  }


  // deshabilitar opcion selectAllCheckbox si select-all-checkbox = false
  // deshabilitar opcion insertar si detail-mode es 
}
