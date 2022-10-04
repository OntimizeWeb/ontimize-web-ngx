import { AfterViewInit, ChangeDetectionStrategy, Component, forwardRef, Inject, Injector, ViewChild } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

import { InputConverter } from '../../../../decorators/input-converter';
import { OTranslateService } from '../../../../services/translate/o-translate.service';
import { ColumnValueFilterOperator, OColumnValueFilter } from '../../../../types/table/o-column-value-filter.type';
import { Util } from '../../../../util/util';
import { OContextMenuComponent } from '../../../contextmenu/o-context-menu.component';
import { OColumn } from '../../column/o-column.class';
import { OTableComponent } from '../../o-table.component';
import { OTableGroupedRow } from '../row/o-table-row-group.class';

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

  public isDataCell: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public isTableGroupedRow: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public isGroupableCell: BehaviorSubject<boolean> = new BehaviorSubject(true);

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
  protected _row: any;
  protected column: OColumn;
  protected translateService: OTranslateService;
  protected contextMenuSubscription: Subscription = new Subscription();
  public isDateColumn: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(
    protected injector: Injector,
    @Inject(forwardRef(() => OTableComponent)) public table: OTableComponent
  ) {
    this.translateService = this.injector.get(OTranslateService);
  }

  public ngAfterViewInit(): void {
    if (!Util.isDefined(this.showSelectAll)) {
      this.isVisibleSelectAll.next(this.table.selectAllCheckbox);
    }
    if (!this.table.groupable) {
      this.isVisibleGroupByRow.next(this.table.groupable);
    }
    if (this.contextMenu) {
      this.defaultContextMenu.externalContextMenuItems = this.contextMenu.oContextMenuItems;
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
      values: [this.row[this.column.attr]],
      availableValues: undefined
    };
    this.table.filterByColumn(columValueFilter);
  }


  public groupByColumn(dateType?: string): void {
    this.table.groupByColumn(this.column, dateType);
    this.isEnabledGroupByColumn.next(false);
  }

  public unGroupByColumn(): void {
    this.table.unGroupByColumn(this.column);
  }

  public unGroupAll(): void {
    this.table.unGroupByAllColumns();
  }

  get labelFilterByColumn(): string {
    return (this.column && this.column.title) ? this.translateService.get('TABLE_CONTEXT_MENU.FILTER_BY') + ' ' + this.translateService.get(this.column.title) : '';
  }

  get labelGroupByColumn(): string {
    return (this.column && this.column.title) ? this.translateService.get('TABLE_CONTEXT_MENU.GROUP_BY_COLUMN') + ' ' + this.translateService.get(this.column.title) : '';
  }

  get labelUnGroupByColumn(): string {
    return (this.column && this.column.title) ? this.translateService.get('TABLE_CONTEXT_MENU.UNGROUP_BY_COLUMN') + ' ' + this.translateService.get(this.column.title) : '';
  }

  get row(): any {
    return this._row;
  }

  set row(value: any) {
    this._row = value.rowValue;
    const isTableGroupedRow = this._row instanceof OTableGroupedRow;
    let columnName = value.cellName;
    if (isTableGroupedRow) {
      columnName = columnName.substring('groupHeader-'.length);
    }
    this.column = this.table.getOColumn(columnName);
    this.isColumnDate();
    this.isDataCell.next(!isTableGroupedRow);
    this.isTableGroupedRow.next(isTableGroupedRow);
    this.isGroupableCell.next(isTableGroupedRow && (this._row as OTableGroupedRow).hasColumnData(this.column.attr));
  }

  get availableColumnAggregates(): string[] {
    let result = Util.columnAggregates;
    if (this.row instanceof OTableGroupedRow) {
      const groupingComp = this.row.getColumnGroupingComponent(this.column.attr);
      if (Util.isDefined(groupingComp.aggregateName)) {
        result = result.slice();
        if (result.includes(groupingComp.aggregate)) {
          result.splice(result.indexOf(groupingComp.aggregate), 1, groupingComp.aggregateName);
        } else {
          result.push(groupingComp.aggregateName);
        }
      }
    }
    return result;
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
    if (this.column.groupable && !Util.isArrayEmpty(this.table.groupedColumnsArray) && this.foundColumnInGroupedColumns(this.column)) {
      this.isEnabledUnGroupByColumn.next(true);
      grouped = true;
    }

    this.isEnabledGroupByColumn.next(this.column.groupable && !grouped);
    if (!Util.isArrayEmpty(this.table.groupedColumnsArray)) {
      this.isEnabledUnGroupAllColumn.next(true);
    }
  }
  public foundColumnInGroupedColumns(column): boolean {
    let found: boolean = false;
    this.table.groupedColumnsArray.forEach(groupedColumn => { if (groupedColumn == column.attr) { found = true } });
    return found;
  }


  public changeAggregateFunction(arg: any, aggregateFnName: string): void {
    if (arg.data.rowValue instanceof OTableGroupedRow) {
      (arg.data.rowValue as OTableGroupedRow).setColumnActiveAggregateFunction(this.column.attr, aggregateFnName);
    }
  }

  protected initProperties(param: any): void {
    const data = param.data;
    if (!Util.isDefined(data)) {
      return;
    }
    this.row = { rowValue: data.rowValue, cellName: data.cellName };
    this.checkVisibleFilter();
    this.checkGroupByRowOptions();
  }

  expandRowGroupsSameLevel() {
    this.table.dataSource.setRowGroupLevelExpansion(this._row, true);
  }

  collapseRowGroupsSameLevel() {
    this.table.dataSource.setRowGroupLevelExpansion(this._row, false);

  }
  isColumnDate() {

    this.isDateColumn.next(this.column.type == 'date');
  }
}
