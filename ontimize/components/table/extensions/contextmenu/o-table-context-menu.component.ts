import { ChangeDetectionStrategy, Component, forwardRef, Inject, Injector, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { InputConverter } from '../../../../decorators/input-converter';
import { OTranslateService } from '../../../../services';
import { Util } from '../../../../utils';
import { OContextMenuComponent } from '../../../contextmenu/o-context-menu-components';
import { ColumnValueFilterOperator, IColumnValueFilter, OColumn, OTableComponent } from '../../table-components';


export const DEFAULT_TABLE_CONTEXT_MENU_INPUTS = [
  'contextMenu: context-menu',
  'showInsert: insert',
  'showEdit: edit',
  'showViewDetail: view-detail',
  'showCopy: copy',
  'showSelectAll: select-all',
  'showRefresh: refresh',
  'showDelete: delete',
  'showFilter: filter'
];

@Component({
  moduleId: module.id,
  selector: 'o-table-context-menu',
  templateUrl: './o-table-context-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: DEFAULT_TABLE_CONTEXT_MENU_INPUTS
})
export class OTableContextMenuComponent implements OnInit {

  public contextMenu: OContextMenuComponent;
  public isVisibleInsert: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public isVisibleEdit: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public isVisibleDetail: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public isVisibleCopy: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public isVisibleSelectAll: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public isVisibleRefresh: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public isVisibleDelete: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public isVisibleFilter: BehaviorSubject<boolean> = new BehaviorSubject(true);

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

  @ViewChild('defaultContextMenu')
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

  public ngOnInit(): void {
    this.contextMenuSubscription.add(this.defaultContextMenu.onClose.subscribe((param: any) => {
      if (!this.table.isSelectionModeMultiple()) {
        this.table.clearSelection();
      }
    }));

    this.contextMenuSubscription.add(this.defaultContextMenu.onShow.subscribe((param: any) => {
      this.initProperties(param);
    }));

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
    this.table.registerContextMenu(this.defaultContextMenu);
  }

  public gotoDetails(event): void {
    const data = event.data.rowValue;
    this.table.viewDetail(data);
  }

  public edit(event): void {
    const data = event.data.rowValue;
    this.table.doHandleClick(data);
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

  public filterByValue(event): void {
    this.table.showFilterByColumnIcon = true;
    const columValueFilter: IColumnValueFilter = {
      attr: this.column.attr,
      operator: ColumnValueFilterOperator.IN,
      values: [this.row[this.column.attr]]
    };
    this.table.dataSource.addColumnFilter(columValueFilter);
    this.table.reloadPaginatedDataFromStart();
  }

  get labelFilterByColumn(): string {
    return (this.column && this.column.attr) ? this.translateService.get('TABLE_CONTEXT_MENU.FILTER_BY') + ' ' + this.translateService.get(this.column.attr) : '';
  }

  public filterByColumn(event): void {
    if (this.table.oTableMenu) {
      this.table.showFilterByColumnIcon = true;
      this.table.oTableMenu.columnFilterOption.active = true;
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

  protected initProperties(param: any): void {
    const data = param.data;
    if (data) {
      const columnName = data.cellName;
      this.column = this.table.getOColumn(columnName);
      this.row = data.rowValue;
      this.checkVisibleFilter();
    }
  }

}
