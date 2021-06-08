import { AfterViewInit, ChangeDetectionStrategy, Component, forwardRef, Inject, Injector, ViewChild } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

import { InputConverter } from '../../../../decorators/input-converter';
import { OTranslateService } from '../../../../services/translate/o-translate.service';
import { ColumnValueFilterOperator, OColumnValueFilter } from '../../../../types/table/o-column-value-filter.type';
import { Util } from '../../../../util/util';
import { OContextMenuComponent } from '../../../contextmenu/o-context-menu.component';
import { OColumn } from '../../column/o-column.class';
import { OTableComponent } from '../../o-table.component';

export const DEFAULT_TABLE_CONTEXT_MENU_INPUTS = [
  'contextMenu: context-menu',
  'showInsert: insert',
  'showEdit: edit',
  'showViewDetail: view-detail',
  'showCopy: copy',
  'showSelectAll: select-all',
  'showRefresh: refresh',
  'showDelete: delete',
  'showFilter: filter',
  'showGroupByRow: group-by-row'
];

@Component({
  selector: 'o-table-context-menu',
  templateUrl: './o-table-context-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: DEFAULT_TABLE_CONTEXT_MENU_INPUTS
})
export class OTableContextMenuComponent implements AfterViewInit {
  public contextMenu: OContextMenuComponent;
  public isVisibleInsert: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public isVisibleEdit: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public isVisibleDetail: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public isVisibleCopy: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public isVisibleSelectAll: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public isVisibleRefresh: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public isVisibleDelete: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public isVisibleFilter: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public isVisibleGroupByRow: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public isEnabledGroupByColumn: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public isEnabledUnGroupByColumn: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public isEnabledUnGroupAllColumn: BehaviorSubject<boolean> = new BehaviorSubject(false);


  set showInsert(value: boolean) {
    if (typeof value !== 'boolean') {
      value = Util.parseBoolean(value as any);
    }
    this.isVisibleInsert.next(value);
  }

  get showInsert(): boolean {
    return this.isVisibleInsert.getValue();
  }

  set showEdit(value: boolean) {
    if (typeof value !== 'boolean') {
      value = Util.parseBoolean(value as any);
    }
    this.isVisibleEdit.next(value);
  }

  get showEdit(): boolean {
    return this.isVisibleEdit.getValue();
  }

  set showViewDetail(value: boolean) {
    if (typeof value !== 'boolean') {
      value = Util.parseBoolean(value as any);
    }
    this.isVisibleDetail.next(value);
  }

  get showViewDetail(): boolean {
    return this.isVisibleDetail.getValue();
  }

  set showCopy(value: boolean) {
    if (typeof value !== 'boolean') {
      value = Util.parseBoolean(value as any);
    }
    this.isVisibleCopy.next(value);
  }

  get showCopy(): boolean {
    return this.isVisibleCopy.getValue();
  }

  @InputConverter()
  set showSelectAll(value: boolean) {
    if (typeof value !== 'boolean') {
      value = Util.parseBoolean(value as any);
    }
    this.table.isSelectionModeNone() ? this.isVisibleSelectAll.next(false) : this.isVisibleSelectAll.next(value);
  }

  get showSelectAll(): boolean {
    return this.isVisibleSelectAll.getValue();
  }

  set showRefresh(value: boolean) {
    if (typeof value !== 'boolean') {
      value = Util.parseBoolean(value as any);
    }
    this.isVisibleRefresh.next(value);
  }

  get showRefresh(): boolean {
    return this.isVisibleRefresh.getValue();
  }

  set showDelete(value: boolean) {
    if (typeof value !== 'boolean') {
      value = Util.parseBoolean(value as any);
    }
    this.isVisibleDelete.next(value);
  }

  get showDelete(): boolean {
    return this.isVisibleDelete.getValue();
  }

  set showFilter(value: boolean) {
    if (typeof value !== 'boolean') {
      value = Util.parseBoolean(value as any);
    }
    this.isVisibleFilter.next(value);
  }

  get showFilter(): boolean {
    return this.isVisibleFilter.getValue();
  }

  set showGroupByRow(value: boolean) {
    if (typeof value !== 'boolean') {
      value = Util.parseBoolean(value as any);
    }
    this.isVisibleGroupByRow.next(value);
  }

  get showGroupByRow(): boolean {
    return this.isVisibleGroupByRow.getValue();
  }


  @ViewChild('defaultContextMenu', { static: false })
  protected defaultContextMenu: OContextMenuComponent;
  protected row: any;
  protected column: OColumn;
  protected translateService: OTranslateService;
  protected contextMenuSubscription: Subscription = new Subscription();

  constructor(
    protected injector: Injector,
    @Inject(forwardRef(() => OTableComponent)) public table: OTableComponent
  ) {
    this.translateService = this.injector.get(OTranslateService);
  }

  public ngAfterViewInit(): void {
    const itemsParsed = this.defaultContextMenu.oContextMenuItems.toArray();
    if (this.contextMenu) {
      const items = itemsParsed.concat(this.contextMenu.oContextMenuItems.toArray());
      this.defaultContextMenu.oContextMenuItems.reset(items);
    } else {
      this.defaultContextMenu.oContextMenuItems.reset(itemsParsed);
    }
    if (!Util.isDefined(this.showSelectAll)) {
      this.isVisibleSelectAll.next(this.table.selectAllCheckbox);
    }
    if (!this.table.groupable) {
      this.isVisibleGroupByRow.next(this.table.groupable);
    }

    this.table.registerContextMenu(this.defaultContextMenu);
    this.registerContextMenuListeners();
  }

  public registerContextMenuListeners() {
    this.contextMenuSubscription.add(this.defaultContextMenu.onClose.subscribe((param: any) => {
      if (!this.table.isSelectionModeMultiple()) {
        this.table.clearSelection();
      }
    }));

    this.contextMenuSubscription.add(this.defaultContextMenu.onShow.subscribe((param: any) => {
      this.initProperties(param);
    }));
  }

  public gotoDetails(event): void {
    const data = event.data.rowValue;
    this.table.viewDetail(data);
  }

  public edit(event): void {
    this.table.doHandleClick(event.data.rowValue, event.data.cellName, event.data.rowIndex, event);
  }

  public add(): void {
    this.table.add();
  }

  public selectAll(): void {
    this.table.showAndSelectAllCheckbox();
  }

  public unSelectAll(): void {
    this.table.selection.clear();
  }

  public copyAll(): void {
    this.table.copyAll();
  }

  public copyCell(event): void {
    const cell_data = this.defaultContextMenu.origin.innerText;
    Util.copyToClipboard(cell_data);
  }

  public copySelection(): void {
    this.table.copySelection();
  }

  public copyRow(event): void {
    const data = JSON.stringify(this.table.dataSource.getRenderedData([event.data.rowValue]));
    Util.copyToClipboard(data);
  }

  public delete(event): void {
    this.table.remove();
  }

  public refresh(): void {
    this.table.refresh();
  }

  public filterByValue(): void {
    const columValueFilter: OColumnValueFilter = {
      attr: this.column.attr,
      operator: ColumnValueFilterOperator.IN,
      values: [this.row[this.column.attr]]
    };
    this.table.filterByColumn(columValueFilter);
  }


  public groupByColumn(): void {
    this.table.groupByColumn(this.column);
  }

  public unGroupByColumn(): void {
    this.table.unGroupByColumn(this.column);
  }

  public unGroupAll(): void {
    this.table.unGroupByAllColumns();
  }

  get labelFilterByColumn(): string {
    return (this.column && this.column.attr) ? this.translateService.get('TABLE_CONTEXT_MENU.FILTER_BY') + ' ' + this.translateService.get(this.column.attr) : '';
  }

  get labelGroupByColumn(): string {
    return (this.column && this.column.attr) ? this.translateService.get('TABLE_CONTEXT_MENU.GROUP_BY_COLUMN') + ' ' + this.translateService.get(this.column.attr) : '';
  }

  get labelUnGroupByColumn(): string {
    return (this.column && this.column.attr) ? this.translateService.get('TABLE_CONTEXT_MENU.UNGROUP_BY_COLUMN') + ' ' + this.translateService.get(this.column.attr) : '';
  }

  public filterByColumn(event): void {
    if (this.table.oTableMenu) {
      this.table.isColumnFiltersActive = true;
      this.table.openColumnFilterDialog(this.column, event.event);
    }
  }

  public checkVisibleFilter(): void {
    let isVisible = false;
    if (this.column) {
      isVisible = this.showFilter && this.table.isColumnFilterable(this.column);
    }
    this.isVisibleFilter.next(isVisible);
  }

  /**
   * Checks group by row options
   */
  public checkGroupByRowOptions(): void {
    this.isEnabledUnGroupByColumn.next(false);
    this.isEnabledUnGroupAllColumn.next(false);
    let grouped = false;
    if (this.column.groupable && !Util.isArrayEmpty(this.table.groupedColumnsArray) && this.table.groupedColumnsArray.indexOf(this.column.attr) > -1) {
      this.isEnabledUnGroupByColumn.next(true);
      grouped = true;
    }

    this.isEnabledGroupByColumn.next(this.column.groupable && !grouped);
    if (!Util.isArrayEmpty(this.table.groupedColumnsArray)) {
      this.isEnabledUnGroupAllColumn.next(true);
    }
  }

  protected initProperties(param: any): void {
    const data = param.data;
    if (data) {
      const columnName = data.cellName;
      this.column = this.table.getOColumn(columnName);
      this.row = data.rowValue;
      this.checkVisibleFilter();
      this.checkGroupByRowOptions();
    }
  }

}
