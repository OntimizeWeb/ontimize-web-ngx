import { Component, forwardRef, Inject, Injector, ViewChild, OnInit } from '@angular/core';

import { OContextMenuComponent } from '../../../contextmenu/o-context-menu-components';
import { Util } from '../../../../utils';
import { InputConverter } from '../../../../decorators';
import { Subscription } from 'rxjs/Subscription';
import { OTranslateService } from '../../../../services';
import { IOContextMenuContext } from '../../../contextmenu/o-context-menu.service';
import { OColumn, IColumnValueFilter, ColumnValueFilterOperator, OTableComponent } from '../../table-components';

export const DEFAULT_TABLE_CONTEXT_MENU_INPUTS = [
  'contextMenu : context-menu',
  'showInsert:insert',
  'showEdit:edit',
  'showViewDetail:view-detail',
  'showCopy:copy',
  'showSelectAll:select-all',
  'showRefresh:refresh',
  'showDelete:delete',
  'showFilter:filter'
];

@Component({
  moduleId: module.id,
  selector: 'o-table-context-menu',
  templateUrl: './o-table-context-menu.component.html',
  inputs: DEFAULT_TABLE_CONTEXT_MENU_INPUTS
})

export class OTableContextMenuComponent implements OnInit {

  // public static INSERT_ATTR = 'insert';
  // public static GOTO_DETAIL_ATTR = 'detail';
  // public static EDIT_ATTR = 'edit';
  // public static SELECT_ALL_ATTR = 'select-all';
  // public static COPY_ATTR = 'copy';
  public data: any;

  contextMenuSubscription: Subscription = new Subscription();
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
  @InputConverter()
  showRefresh: boolean = true;
  @InputConverter()
  showDelete: boolean = true;
  @InputConverter()
  showFilter: boolean = true;


  public contextMenu: OContextMenuComponent;
  @ViewChild('defaultContextMenu') defaultContextMenu: OContextMenuComponent;

  protected translateService: OTranslateService;

  private row;
  private column: OColumn;
  constructor(
    protected injector: Injector,
    @Inject(forwardRef(() => OTableComponent)) public table: OTableComponent
  ) {
    this.translateService = this.injector.get(OTranslateService);
  }

  ngOnInit(): void {
    this.contextMenuSubscription.add(this.defaultContextMenu.onClose.subscribe((param: IOContextMenuContext) => {
      if (!this.table.isSelectionModeMultiple()) {
        this.table.clearSelection();
      }
    }));

    this.contextMenuSubscription.add(this.defaultContextMenu.onShow.subscribe((param: IOContextMenuContext) => {
      this.data = param.data;
      let columnName = this.data.cellName;
      this.column = this.table.getOColumn(columnName);
      this.row = this.data.rowValue;
    }));

  }


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

  isVisibleRefresh() {
    let isVisible = false;
    if (this.showRefresh) {
      isVisible = true;
    }
    return isVisible;
  }

  isVisibleDelete() {
    let isVisible = false;
    if (this.showDelete) {
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

  unSelectAll() {
    this.table.selection.clear();
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

  delete(event) {
    this.table.remove();
  }

  refresh() {
    this.table.refresh();
  }

  filterByValue(event) {
    this.table.showFilterByColumnIcon = true;
    const columValueFilter: IColumnValueFilter = {
      attr: this.column.attr,
      operator: ColumnValueFilterOperator.IN,
      values: [this.row[this.column.attr]]
    };
    this.table.dataSource.addColumnFilter(columValueFilter);
    this.table.reloadPaginatedDataFromStart();
  }


  get labelFilterByColumn() {
    let label = '';
    if (this.column && this.column.attr) {
      label = this.translateService.get('TABLE_CONTEXT_MENU.FILTER_BY') + ' ' + this.translateService.get(this.column.attr);
    }
    return label;
  }

  filterByColumn(event) {
    if (this.table.oTableMenu) {
      this.table.showFilterByColumnIcon = true;
      this.table.oTableMenu.columnFilterOption.active = true;
      this.table.openColumnFilterDialog(this.column, event.event);
    }
  }

  isVisibleFilter(): boolean {
    let isVisibleFilter = false;
    if (this.column) {
      isVisibleFilter = this.showFilter && this.table.isColumnFilterable(this.column);
    }
    return isVisibleFilter;
  }
}
