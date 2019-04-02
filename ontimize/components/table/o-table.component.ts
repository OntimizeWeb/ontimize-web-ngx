import { Component, ContentChildren, ElementRef, EventEmitter, forwardRef, HostListener, Inject, Injector, NgModule, OnDestroy, OnInit, Optional, QueryList, ViewChild, ViewChildren, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';
import { ObserversModule } from '@angular/cdk/observers';
import { SelectionModel, SelectionChange } from '@angular/cdk/collections';
import { MatDialog, MatTabGroup, MatTab, MatPaginatorIntl, MatPaginator, MatCheckboxChange, MatMenu, PageEvent, MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material';
import { DndModule } from '@churchs19/ng2-dnd';
import { Observable, Subscription, of } from 'rxjs';

import { OSharedModule } from '../../shared';
import { OTableDao } from './o-table.dao';
import { InputConverter } from '../../decorators';
import { OTableDataSource } from './o-table.datasource';
import { OFormComponent } from '../form/o-form.component';
import { Codes, ObservableWrapper, Util, SQLTypes } from '../../utils';
import { PermissionsUtils } from '../../util/permissions';
import { OServiceComponent } from '../o-service-component.class';
import { OntimizeService, SnackBarService, OPermissions, OTablePermissions, OTableMenuPermissions } from '../../services';
import { OTableRowDirective } from './extensions/row/o-table-row.directive';
import { OColumnTooltip } from './column/o-table-column.component';
import { OTableStorage } from './extensions/o-table-storage.class';
import { dataServiceFactory } from '../../services/data-service.provider';
import { OTableColumnComponent } from './column/o-table-column.component';
import { OContextMenuModule } from '../contextmenu/o-context-menu.module';
import { ISQLOrder, OQueryDataArgs, ServiceUtils } from '../service.utils';
import { IOContextMenuContext } from '../contextmenu/o-context-menu.service';
import { FilterExpressionUtils, IExpression } from '../filter-expression.utils';
import { OContextMenuComponent } from '../contextmenu/o-context-menu-components';
import { OTableContextMenuComponent } from './extensions/contextmenu/o-table-context-menu.component';
import { OperatorFunction, OTableColumnCalculatedComponent } from './column/calculated/o-table-column-calculated.component';

import {
  O_TABLE_HEADER_COMPONENTS,
  OTableOptionComponent,
  OTableColumnsFilterComponent,
  OTableInsertableRowComponent,
  OTableQuickfilterComponent,
  OTableEditableRowComponent,
  IColumnValueFilter,
  ColumnValueFilterOperator,
  OTableMenuComponent,
  OTableButtonsComponent,
  OTableButtonComponent
} from './extensions/header/o-table-header-components';

import {
  O_TABLE_FOOTER_COMPONENTS,
  OColumnAggregate,
  OTableColumnAggregateComponent,
  OTableMatPaginatorIntl,
  OTablePaginatorComponent
} from './extensions/footer/o-table-footer-components';

import {
  O_TABLE_DIALOGS,
  OTableFilterByColumnDataDialogComponent
} from './extensions/dialog/o-table-dialog-components';

import {
  O_TABLE_CELL_RENDERERS,
  OBaseTableCellRenderer
} from './column/cell-renderer/cell-renderer';

import { O_TABLE_CELL_EDITORS, OTableCellEditorBooleanComponent } from './column/cell-editor/cell-editor';
import { OMatSortModule } from './extensions/sort/o-mat-sort-module';
import { OMatSort } from './extensions/sort/o-mat-sort';
import { OMatSortHeader } from './extensions/sort/o-mat-sort-header';
import { OTableExpandedFooter } from './o-table-expanded-footer.directive';

export const NAME_COLUMN_SELECT = 'select';

export const DEFAULT_INPUTS_O_TABLE = [
  ...OServiceComponent.DEFAULT_INPUTS_O_SERVICE_COMPONENT,

  // visible-columns [string]: visible columns, separated by ';'. Default: no value.
  'visibleColumns: visible-columns',

  // editable-columns [string]: columns that can be edited directly over the table, separated by ';'. Default: no value.
  // 'editableColumns: editable-columns',

  // sort-columns [string]: initial sorting, with the format column:[ASC|DESC], separated by ';'. Default: no value.
  'sortColumns: sort-columns',

  // quick-filter [no|yes]: show quick filter. Default: yes.
  'quickFilterPvt: quick-filter',

  'quickFilterCallback: quick-filter-function',

  // delete-button [no|yes]: show delete button. Default: yes.
  'deleteButton: delete-button',

  // refresh-button [no|yes]: show refresh button. Default: yes.
  'refreshButton: refresh-button',

  // columns-visibility-button [no|yes]: show columns visibility button. Default: yes.
  'columnsVisibilityButton: columns-visibility-button',

  // // columns-resize-button [no|yes]: show columns resize button. Default: yes.
  // 'columnsResizeButton: columns-resize-button',

  // // columns-group-button [no|yes]: show columns group button. Default: yes.
  // 'columnsGroupButton: columns-group-button',

  // export-button [no|yes]: show export button. Default: yes.
  'exportButton: export-button',

  // show-buttons-text [yes|no|true|false]: show text of header buttons. Default: yes.
  'showButtonsText: show-buttons-text',

  // select-all-checkbox [yes|no|true|false]:  show in the menu the option of selection check boxes . Default: no.
  'selectAllCheckbox: select-all-checkbox',

  // pagination-controls [yes|no|true|false]: show pagination controls. Default: yes.
  'paginationControls: pagination-controls',

  // filter [yes|no|true|false]: filter si case sensitive. Default: no.
  'filterCaseSensitive: filter-case-sensitive',

  // fix-header [yes|no|true|false]: fixed header and footer when the content is greather than its own height. Default: no.
  'fixedHeader: fixed-header',

  // show-title [yes|no|true|false]: show the table title. Default: no.
  'showTitle: show-title',

  // edition-mode [none | inline | click | dblclick]: edition mode. Default none
  'editionMode: edition-mode',

  // selection-mode [none | simple | multiple ]: selection mode. Default multiple
  'selectionMode: selection-mode',

  'horizontalScroll: horizontal-scroll',

  'showPaginatorFirstLastButtons: show-paginator-first-last-buttons',

  'autoAlignTitles: auto-align-titles',

  'multipleSort: multiple-sort',
  // select-all-checkbox-visible [yes|no|true|false]: show selection check boxes.Default: no.
  'selectAllCheckboxVisible: select-all-checkbox-visible',

  'orderable',

  'resizable',

  // enabled [yes|no|true|false]: enables de table. Default: yes
  'enabled'
];

export const DEFAULT_OUTPUTS_O_TABLE = [
  'onClick',
  'onDoubleClick',
  'onRowSelected',
  'onRowDeselected',
  'onRowDeleted',
  'onDataLoaded',
  'onPaginatedDataLoaded'
];

export class OColumn {
  attr: string;
  name: string;
  title: string;
  type: string;
  sqlType: number;
  className: string;
  orderable: boolean;
  _searchable: boolean;
  searching: boolean;
  visible: boolean;
  renderer: OBaseTableCellRenderer;
  editor: any;
  editing: boolean;
  _width: string;
  minWidth: string;
  maxWidth: string;
  aggregate: OColumnAggregate;
  calculate: string | OperatorFunction;
  definition: OTableColumnComponent;
  tooltip: OColumnTooltip;
  multiline: boolean;
  resizable: boolean;
  DOMWidth: number;
  padding: number;

  constructor(
    attr: string = undefined,
    table: OTableComponent = undefined,
    column: OTableColumnComponent | OTableColumnCalculatedComponent = undefined
  ) {
    this.attr = attr;
    if (Util.isDefined(table)) {
      this.setDefaultProperties(table);
    }
    if (Util.isDefined(column)) {
      this.setColumnProperties(column);
    }
  }

  setDefaultProperties(table: OTableComponent) {
    this.type = 'string';
    this.className = 'o-column-' + (this.type) + ' ';
    this.orderable = table.orderable;
    this.resizable = table.resizable;
    this.searchable = true;
    this.searching = true;
    // column without 'attr' should contain only renderers that do not depend on cell data, but row data (e.g. actions)
    this.name = this.attr;
    this.title = this.attr;
    this.multiline = false;
  }

  setColumnProperties(column: OTableColumnComponent | OTableColumnCalculatedComponent | any) {
    this.title = Util.isDefined(column.title) ? column.title : column.attr;
    this.definition = column;
    this.multiline = column.multiline;

    if (Util.isDefined(column.minWidth)) {
      this.minWidth = column.minWidth;
    }
    if (Util.isDefined(column.maxWidth)) {
      this.maxWidth = column.maxWidth;
    }
    if (Util.isDefined(column.orderable)) {
      this.orderable = column.orderable;
    }
    if (Util.isDefined(column.resizable)) {
      this.resizable = column.resizable;
    }
    if (Util.isDefined(column.searchable)) {
      this.searchable = column.searchable;
    }
    if (Util.isDefined(column.renderer)) {
      this.renderer = column.renderer;
    }
    if (Util.isDefined(column.editor)) {
      this.editor = column.editor;
    }
    if (Util.isDefined(column.type)) {
      this.type = column.type;
      this.className = 'o-column-' + (this.type) + ' ';
    }
    if (Util.isDefined(column.getSQLType)) {
      this.sqlType = column.getSQLType();
    }
    if (Util.isDefined(column.class)) {
      this.className = Util.isDefined(this.className) ? (this.className + ' ' + column.class) : column.class;
    }
    if (column instanceof OTableColumnCalculatedComponent) {
      if (Util.isDefined(column.operation) || Util.isDefined(column.functionOperation)) {
        this.calculate = column.operation ? column.operation : column.functionOperation;
      }
    }
    if (Util.isDefined(column.tooltip) && column.tooltip) {
      this.tooltip = {
        value: column.tooltipValue,
        function: column.tooltipFunction
      };
    }
  }

  set searchable(val: boolean) {
    this._searchable = val;
    this.searching = val;
  }

  get searchable(): boolean {
    return this._searchable;
  }

  hasTooltip(): boolean {
    return Util.isDefined(this.tooltip);
  }

  getTooltip(rowData: any): any {
    if (!this.hasTooltip()) {
      return undefined;
    }
    let tooltip;
    if (Util.isDefined(this.tooltip.value)) {
      tooltip = this.tooltip.value;
    } else if (Util.isDefined(this.tooltip.function)) {
      try {
        tooltip = this.tooltip.function(rowData);
      } catch (e) {
        console.warn('o-table-column tooltip-function didnt worked');
      }
    } else {
      tooltip = Util.isDefined(this.renderer) ? this.renderer.getTooltip(rowData[this.name], rowData) : rowData[this.name];
    }
    return tooltip;
  }

  getMinWidth() {
    if (Util.isDefined(this.width)) {
      return this.width;
    }
    return this.minWidth;
  }

  getMinWidthValue() {
    return Util.extractPixelsValue(this.minWidth, OTableComponent.DEFAULT_COLUMN_MIN_WIDTH);
  }

  getMaxWidthValue() {
    const value = Util.extractPixelsValue(this.maxWidth);
    return value ? value : undefined;
  }

  getRenderWidth() {
    if (Util.isDefined(this.width)) {
      return this.width;
    }
    const minValue = Util.extractPixelsValue(this.minWidth, OTableComponent.DEFAULT_COLUMN_MIN_WIDTH);
    if (Util.isDefined(minValue) && this.DOMWidth < minValue) {
      this.DOMWidth = minValue;
    }

    if (Util.isDefined(this.maxWidth)) {
      const maxValue = Util.extractPixelsValue(this.maxWidth);
      if (Util.isDefined(maxValue) && this.DOMWidth > maxValue) {
        this.DOMWidth = maxValue;
      }
    }
    return Util.isDefined(this.DOMWidth) ? (this.DOMWidth - (this.padding || 0)) + 'px' : undefined;
  }

  set width(val: string) {
    let widthVal = val;
    const pxVal = Util.extractPixelsValue(val);
    if (Util.isDefined(pxVal)) {
      this.DOMWidth = pxVal;
      widthVal = undefined;
    }
    this._width = widthVal;
  }

  get width(): string {
    return this._width;
  }

  getWidthToStore(): any {
    return this._width || this.DOMWidth;
  }

  setWidth(val: number) {
    this.width = val + 'px';
    this.DOMWidth = val;
  }

  getTitleAlignClass() {
    if (Util.isDefined(this.definition)) {
      return this.definition.titleAlign || Codes.COLUMN_TITLE_ALIGN_CENTER;
    }
    // default title align
    return Codes.COLUMN_TITLE_ALIGN_CENTER;
  }

}

export class OTableOptions {
  selectColumn: OColumn;
  columns: Array<OColumn> = [];
  _visibleColumns: Array<any> = [];
  filter: boolean = true;
  filterCaseSensitive: boolean = false;

  constructor() {
    this.selectColumn = new OColumn();
    this.selectColumn.name = NAME_COLUMN_SELECT;
    this.selectColumn.title = '';
    this.selectColumn.visible = false;
  }

  get visibleColumns(): Array<any> {
    return this._visibleColumns;
  }

  set visibleColumns(arg: Array<any>) {
    this._visibleColumns = arg;
    this.columns.forEach((oCol: OColumn) => {
      oCol.visible = this._visibleColumns.indexOf(oCol.attr) !== -1;
    });
  }
}

export type QuickFilterFunction = (filter: string) => IExpression | Object;

export interface OTableInitializationOptions {
  entity?: string;
  service?: string;
  columns?: string;
  visibleColumns?: string;
  keys?: string;
  sortColumns?: string;
  parentKeys?: string;
}

@Component({
  moduleId: module.id,
  selector: 'o-table',
  templateUrl: './o-table.component.html',
  styleUrls: ['./o-table.component.scss'],
  providers: [
    { provide: OntimizeService, useFactory: dataServiceFactory, deps: [Injector] }
  ],
  inputs: DEFAULT_INPUTS_O_TABLE,
  outputs: DEFAULT_OUTPUTS_O_TABLE,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.o-table]': 'true',
    '[class.ontimize-table]': 'true',
    '[class.o-table-fixed]': 'fixedHeader',
    '[class.o-table-disabled]': '!enabled',
    '(document:click)': 'handleDOMClick($event)'
  }
})
export class OTableComponent extends OServiceComponent implements OnInit, OnDestroy {

  public static DEFAULT_INPUTS_O_TABLE = DEFAULT_INPUTS_O_TABLE;
  public static DEFAULT_OUTPUTS_O_TABLE = DEFAULT_OUTPUTS_O_TABLE;
  public static DEFAULT_BASE_SIZE_SPINNER = 100;
  public static FIRST_LAST_CELL_PADDING = 24;
  public static DEFAULT_COLUMN_MIN_WIDTH = 80;

  public static NAME_COLUMN_SELECT = NAME_COLUMN_SELECT;
  public loadingScroll = false;
  protected _loadingSorting = false;

  protected snackBarService: SnackBarService;

  public paginator: OTablePaginatorComponent;
  @ViewChild(MatPaginator) matpaginator: MatPaginator;
  @ViewChild(OMatSort) sort: OMatSort;
  @ViewChild(OTableEditableRowComponent) oTableEditableRow: OTableEditableRowComponent;

  // only for insideTabBugWorkaround
  @ViewChildren(OMatSortHeader) protected sortHeaders: QueryList<OMatSortHeader>;

  @ViewChild('spinnerContainer', { read: ElementRef })
  spinnerContainer: ElementRef;
  get diameterSpinner() {
    const minHeight = OTableComponent.DEFAULT_BASE_SIZE_SPINNER;
    let height = 0;
    if (this.spinnerContainer && this.spinnerContainer.nativeElement) {
      height = this.spinnerContainer.nativeElement.offsetHeight;
    }
    if (height > 0 && height <= 100) {
      return Math.floor(height - (height * 0.1));
    } else {
      return minHeight;
    }
  }

  public tableContextMenu: OContextMenuComponent;

  @InputConverter()
  selectAllCheckbox: boolean = false;
  @InputConverter()
  exportButton: boolean = true;
  // @InputConverter()
  // columnsResizeButton: boolean = true;
  // @InputConverter()
  // columnsGroupButton: boolean = true;
  @InputConverter()
  columnsVisibilityButton: boolean = true;
  @InputConverter()
  showButtonsText: boolean = true;

  protected _oTableOptions: OTableOptions = new OTableOptions();

  get oTableOptions(): OTableOptions {
    return this._oTableOptions;
  }
  set oTableOptions(value: OTableOptions) {
    this._oTableOptions = value;
  }

  @InputConverter()
  protected quickFilterPvt: boolean = true;
  set quickFilter(value: boolean) {
    this.quickFilterPvt = value;
    this._oTableOptions.filter = this.quickFilterPvt;
  }
  get quickFilter(): boolean {
    return this.quickFilterPvt;
  }

  protected filterCaseSensitivePvt: boolean = false;
  @InputConverter()
  set filterCaseSensitive(value: boolean) {
    this.filterCaseSensitivePvt = value;
    this._oTableOptions.filterCaseSensitive = this.filterCaseSensitivePvt;
  }
  get filterCaseSensitive(): boolean {
    return this.filterCaseSensitivePvt;
  }
  @InputConverter()
  insertButton: boolean = true;
  @InputConverter()
  refreshButton: boolean = true;
  @InputConverter()
  deleteButton: boolean = true;
  @InputConverter()
  paginationControls: boolean = true;
  @InputConverter()
  fixedHeader: boolean = false;
  @InputConverter()
  showTitle: boolean = false;
  protected editionMode: string = Codes.DETAIL_MODE_NONE;
  protected selectionMode: string = Codes.SELECTION_MODE_MULTIPLE;
  @InputConverter()
  horizontalScroll: boolean = false;
  @InputConverter()
  showPaginatorFirstLastButtons: boolean = true;
  @InputConverter()
  autoAlignTitles: boolean = false;
  @InputConverter()
  multipleSort: boolean = true;
  @InputConverter()
  orderable: boolean = true;
  @InputConverter()
  resizable: boolean = true;
  protected _enabled: boolean = true;
  get enabled(): boolean {
    return this._enabled;
  }
  set enabled(val: boolean) {
    val = Util.parseBoolean(String(val));
    this._enabled = val;
  }

  protected _selectAllCheckboxVisible;
  @InputConverter()
  set selectAllCheckboxVisible(value: boolean) {
    this._selectAllCheckboxVisible = this.state['select-column-visible'] || value;
    this.oTableOptions.selectColumn.visible = value;
    this.updateSelectionColumnState();
  }

  get selectAllCheckboxVisible(): boolean {
    return this._selectAllCheckboxVisible;
  }

  public daoTable: OTableDao | null;
  public dataSource: OTableDataSource | null;
  protected visibleColumns: string;
  protected sortColumns: string;

  /*parsed inputs variables */
  protected _visibleColArray: Array<string> = [];

  get originalVisibleColumns(): string {
    return this.visibleColumns;
  }

  get visibleColArray(): Array<any> {
    return this._visibleColArray;
  }

  set visibleColArray(arg: Array<any>) {
    const permissionsBlocked = this.permissions ? this.permissions.columns.filter(col => col.visible === false).map(col => col.attr) : [];
    const permissionsChecked = arg.filter(value => permissionsBlocked.indexOf(value) === -1);
    this._visibleColArray = permissionsChecked;
    if (this._oTableOptions) {
      const containsSelectionCol = this._oTableOptions.visibleColumns.indexOf(OTableComponent.NAME_COLUMN_SELECT) !== -1;
      if (containsSelectionCol) {
        this._visibleColArray.unshift(OTableComponent.NAME_COLUMN_SELECT);
      }
      this._oTableOptions.visibleColumns = this._visibleColArray;
    }
    if (this.oTableEditableRow) {
      this.oTableEditableRow.cd.detectChanges();
    }
  }

  public sortColArray: Array<ISQLOrder> = [];
  /*end of parsed inputs variables */

  protected tabGroupContainer: MatTabGroup;
  protected tabContainer: MatTab;
  tabGroupChangeSubscription: Subscription;

  protected pendingQuery: boolean = false;
  protected pendingQueryFilter = undefined;

  protected setStaticData: boolean = false;
  protected avoidQueryColumns: Array<any> = [];
  protected asyncLoadColumns: Array<any> = [];
  protected asyncLoadSubscriptions: Object = {};

  protected querySubscription: Subscription;
  protected contextMenuSubscription: Subscription;
  protected finishQuerySubscription: boolean = false;

  public onClick: EventEmitter<any> = new EventEmitter();
  public onDoubleClick: EventEmitter<any> = new EventEmitter();
  public onRowSelected: EventEmitter<any> = new EventEmitter();
  public onRowDeselected: EventEmitter<any> = new EventEmitter();
  public onRowDeleted: EventEmitter<any> = new EventEmitter();
  public onDataLoaded: EventEmitter<any> = new EventEmitter();
  public onPaginatedDataLoaded: EventEmitter<any> = new EventEmitter();
  public onReinitialize: EventEmitter<any> = new EventEmitter();
  public onContentChange: EventEmitter<any> = new EventEmitter();

  selection = new SelectionModel<Element>(true, []);
  protected selectionChangeSubscription: Subscription;

  public oTableFilterByColumnDataDialogComponent: OTableFilterByColumnDataDialogComponent;
  public oTableColumnsFilterComponent: OTableColumnsFilterComponent;
  public showFilterByColumnIcon: boolean = false;
  public showTotals: boolean = false;

  public oTableInsertableRowComponent: OTableInsertableRowComponent;
  public showFirstInsertableRow: boolean = false;
  public showLastInsertableRow: boolean = false;

  protected clickTimer;
  protected clickDelay = 200;
  protected clickPrevent = false;
  protected editingCell: any;
  protected editingRow: any;

  protected _currentPage: number = 0;
  set currentPage(val: number) {
    this._currentPage = val;
    if (this.paginator) {
      this.paginator.pageIndex = val;
    }
  }

  get currentPage(): number {
    return this._currentPage;
  }

  public oTableQuickFilterComponent: OTableQuickfilterComponent;
  protected sortSubscription: Subscription;
  protected onRenderedDataChange: Subscription;
  protected previousRendererData;

  quickFilterCallback: QuickFilterFunction;

  @ViewChild('tableBody')
  protected tableBodyEl: ElementRef;
  @ViewChild('tableHeader', { read: ElementRef })
  tableHeaderEl: ElementRef;
  @ViewChild('tableToolbar', { read: ElementRef })
  tableToolbarEl: ElementRef;

  horizontalScrolled: boolean;
  public onUpdateScrolledState: EventEmitter<any> = new EventEmitter();
  public rowWidth;

  oTableStorage: OTableStorage;
  storePaginationState: boolean = false;

  /* In the case the table havent paginationControl and pageable, the table has pagination virtual*/
  pageScrollVirtual = 1;
  public static LIMIT_SCROLLVIRTUAL = 50;

  @HostListener('window:resize', ['$event'])
  updateScrolledState(): void {
    if (this.horizontalScroll) {
      const self = this;
      setTimeout(() => {
        const bodyWidth = self.tableBodyEl.nativeElement.clientWidth;
        const scrollWidth = self.tableBodyEl.nativeElement.scrollWidth;
        const previousState = self.horizontalScrolled;
        self.horizontalScrolled = scrollWidth > bodyWidth;
        if (previousState !== self.horizontalScrolled) {
          self.onUpdateScrolledState.emit(self.horizontalScrolled);
        }
      }, 0);
    }
    // if (this.resizable) {

    // }
  }

  protected permissions: OTablePermissions;
  matMenu: MatMenu;

  @ViewChild('tableMenu')
  oTableMenu: OTableMenuComponent;
  @ContentChildren(OTableOptionComponent)
  tableOptions: QueryList<OTableOptionComponent>;

  @ViewChild('tableButtons')
  oTableButtons: OTableButtonsComponent;
  @ContentChildren(OTableButtonComponent)
  tableButtons: QueryList<OTableButtonComponent>;

  @ViewChild(OTableExpandedFooter)
  oTableExpandedFooter: OTableExpandedFooter;

  constructor(
    injector: Injector,
    elRef: ElementRef,
    protected dialog: MatDialog,
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent
  ) {
    super(injector, elRef, form);
    try {
      this.tabGroupContainer = this.injector.get(MatTabGroup);
      this.tabContainer = this.injector.get(MatTab);
    } catch (error) {
      // Do nothing due to not always is contained on tab.
    }
    this.snackBarService = this.injector.get(SnackBarService);
    this.oTableStorage = new OTableStorage(this);
  }

  ngOnInit() {
    this.initialize();
  }

  ngAfterViewInit() {
    this.afterViewInit();
    this.initTableAfterViewInit();
    if (this.oTableMenu) {
      this.matMenu = this.oTableMenu.matMenu;
      this.oTableMenu.registerOptions(this.tableOptions.toArray());
    }
    if (this.oTableButtons) {
      this.oTableButtons.registerButtons(this.tableButtons.toArray());
    }
  }

  ngOnDestroy() {
    this.destroy();
  }

  getActionsPermissions(): OPermissions[] {
    return this.permissions ? (this.permissions.actions || []) : [];
  }

  getMenuPermissions(): OTableMenuPermissions {
    let result: OTableMenuPermissions = this.permissions ? this.permissions.menu : undefined;
    return result ? result : {
      visible: true,
      enabled: true,
      items: []
    };
  }

  getOColumnPermissions(attr: string): OPermissions {
    const columns = this.permissions ? (this.permissions.columns || []) : [];
    return columns.find(comp => comp.attr === attr) || { attr: attr, enabled: true, visible: true };
  }

  protected getActionPermissions(attr: string): OPermissions {
    const actionsPerm = this.permissions ? (this.permissions.actions || []) : [];
    const permissions: OPermissions = actionsPerm.find(p => p.attr === attr);
    return permissions || {
      attr: attr,
      visible: true,
      enabled: true
    };
  }

  protected checkEnabledActionPermission(attr: string) {
    const actionsPerm = this.permissions ? (this.permissions.actions || []) : [];
    const permissions: OPermissions = actionsPerm.find(p => p.attr === attr);
    let enabledPermision = PermissionsUtils.checkEnabledPermission(permissions);
    if (!enabledPermision) {
      this.snackBarService.open('MESSAGES.OPERATION_NOT_ALLOWED_PERMISSION');
    }
    return enabledPermision;
  }

  /**
   * Method what initialize vars and configuration
   */
  initialize(): any {
    super.initialize();

    if (this.tabGroupContainer && this.tabContainer) {
      this.registerTabListener();
    }

    // Initialize params of the table
    this.initializeParams();

    this.initializeDao();

    this.permissions = this.permissionsService.getTablePermissions(this.oattr, this.actRoute);
  }

  protected initializeDao() {
    // Configure dao methods
    let queryMethodName = this.pageable ? this.paginatedQueryMethod : this.queryMethod;
    const methods = {
      query: queryMethodName,
      update: this.updateMethod,
      delete: this.deleteMethod,
      insert: this.insertMethod
    };

    if (this.staticData) {
      this.queryOnBind = false;
      this.queryOnInit = false;
      this.daoTable = new OTableDao(undefined, this.entity, methods);
      this.setDataArray(this.staticData);
    } else {
      this.configureService();
      this.daoTable = new OTableDao(this.dataService, this.entity, methods);
    }
  }

  protected initializeCheckboxColumn() {
    if (!this.selectAllCheckbox) {
      return;
    }
    // Update checkbox column visibility
    this._oTableOptions.selectColumn.visible = !!this.state['select-column-visible'];

    // Initializing row selection listener
    if (!this.selectionChangeSubscription) {
      this.selectionChangeSubscription = this.selection.onChange.subscribe((selectionData: SelectionChange<any>) => {
        if (selectionData && selectionData.added.length > 0) {
          ObservableWrapper.callEmit(this.onRowSelected, selectionData.added);
        }
        if (selectionData && selectionData.removed.length > 0) {
          ObservableWrapper.callEmit(this.onRowDeselected, selectionData.removed);
        }
      });
    }
    this.updateSelectionColumnState();
  }

  reinitialize(options: OTableInitializationOptions): void {
    if (options) {
      let clonedOpts = Object.assign({}, options);
      if (clonedOpts.hasOwnProperty('entity')) {
        this.entity = clonedOpts.entity;
      }
      if (clonedOpts.hasOwnProperty('service')) {
        this.service = clonedOpts.service;
      }
      if (clonedOpts.hasOwnProperty('columns')) {
        this.columns = clonedOpts.columns;
      }
      if (clonedOpts.hasOwnProperty('visibleColumns')) {
        this.visibleColumns = clonedOpts.visibleColumns;
      }
      if (clonedOpts.hasOwnProperty('keys')) {
        this.keys = clonedOpts.keys;
      }
      if (clonedOpts.hasOwnProperty('sortColumns')) {
        this.sortColumns = clonedOpts.sortColumns;
      }
      if (clonedOpts.hasOwnProperty('parentKeys')) {
        this.parentKeys = clonedOpts.parentKeys;
      }
    }

    this.destroy();
    this.initialize();
    this.initTableAfterViewInit();
    this.onReinitialize.emit(null);
  }

  protected initTableAfterViewInit() {
    this.parseVisibleColumns();
    this.setDatasource();
    this.registerDataSourceListeners();
    this.parseSortColumns();
    this.registerSortListener();
    this.setFiltersConfiguration(this.state);
    this.addDefaultRowButtons();

    if (this.queryOnInit) {
      this.queryData();
    }
  }

  destroy() {
    super.destroy();
    if (this.tabGroupChangeSubscription) {
      this.tabGroupChangeSubscription.unsubscribe();
    }

    if (this.selectionChangeSubscription) {
      this.selectionChangeSubscription.unsubscribe();
    }
    if (this.sortSubscription) {
      this.sortSubscription.unsubscribe();
    }
    if (this.onRenderedDataChange) {
      this.onRenderedDataChange.unsubscribe();
    }

    if (this.contextMenuSubscription) {
      this.contextMenuSubscription.unsubscribe();
    }
    Object.keys(this.asyncLoadSubscriptions).forEach(idx => {
      if (this.asyncLoadSubscriptions[idx]) {
        this.asyncLoadSubscriptions[idx].unsubscribe();
      }
    });
  }
  /**
   * Method update store localstorage, call of the ILocalStorage
   */
  getDataToStore() {
    return this.oTableStorage.getDataToStore();
  }

  registerQuickFilter(arg: OTableQuickfilterComponent) {
    this.oTableQuickFilterComponent = arg;
    this.oTableQuickFilterComponent.setValue(this.state['filter'], false);
  }

  registerPagination(value: OTablePaginatorComponent) {
    this.paginationControls = true;
    this.paginator = value;
  }

  registerContextMenu(value: OContextMenuComponent): void {
    this.tableContextMenu = value;
    const self = this;
    this.contextMenuSubscription = this.tableContextMenu.onShow.subscribe((params: IOContextMenuContext) => {
      params.class = 'o-table-context-menu ' + this.rowHeight;
      
      if (params.data && !self.selection.isSelected(params.data.rowValue)) {
        self.selection.clear();
        self.selection.select(params.data.rowValue);
      }
    });
  }

  registerDefaultColumn(column: string) {
    if (Util.isDefined(this.getOColumn(column))) {
      // a default column definition trying to replace an already existing definition
      return;
    }
    let colDef: OColumn = new OColumn(column, this);
    this.pushOColumnDefinition(colDef);
  }

  /**
   * Store all columns and properties in var columnsArray
   * @param column
   */
  registerColumn(column: OTableColumnComponent | OTableColumnCalculatedComponent | any) {
    const columnAttr = (typeof column === 'string') ? column : column.attr;
    const columnPermissions: OPermissions = this.getOColumnPermissions(columnAttr);
    if (!columnPermissions.visible) {
      return;
    }

    if (typeof column === 'string') {
      this.registerDefaultColumn(column);
      return;
    }

    const columnDef = this.getOColumn(column.attr);
    if (Util.isDefined(columnDef) && Util.isDefined(columnDef.definition)) {
      // a o-table-column definition trying to replace an already existing o-table-column definition
      return;
    }
    let colDef: OColumn = new OColumn(column.attr, this, column);

    let columnWidth = column.width;
    const storedCols = this.state['oColumns-display'];
    if (Util.isDefined(storedCols)) {
      const storedData = storedCols.find(oCol => oCol.attr === colDef.attr);
      if (Util.isDefined(storedData) && Util.isDefined(storedData.width)) {
        columnWidth = storedData.width;
      }
    }
    if (Util.isDefined(columnWidth)) {
      colDef.width = columnWidth;
    }
    if (column && (column.asyncLoad || column.type === 'action')) {
      this.avoidQueryColumns.push(column.attr);
      if (column.asyncLoad) {
        this.asyncLoadColumns.push(column.attr);
      }
    }
    this.pushOColumnDefinition(colDef);
  }

  protected pushOColumnDefinition(colDef: OColumn) {
    colDef.visible = (this._visibleColArray.indexOf(colDef.attr) !== -1);
    // Find column definition by name
    const alreadyExisting = this.getOColumn(colDef.attr);
    if (alreadyExisting !== undefined) {
      const replacingIndex = this._oTableOptions.columns.indexOf(alreadyExisting);
      this._oTableOptions.columns[replacingIndex] = colDef;
    } else {
      this._oTableOptions.columns.push(colDef);
    }
    this.refreshEditionModeWarn();
  }

  protected refreshEditionModeWarn() {
    if (this.editionMode !== Codes.DETAIL_MODE_NONE) {
      return;
    }
    const editableColumns = this.oTableOptions.columns.filter(col => {
      return Util.isDefined(col.editor);
    });
    if (editableColumns.length > 0) {
      console.warn('Using a column with a editor but there is no edition-mode defined');
    }
  }

  registerColumnAggregate(column: OColumnAggregate) {
    this.showTotals = true;
    const alreadyExisting = this.getOColumn(column.attr);
    if (alreadyExisting !== undefined) {
      const replacingIndex = this._oTableOptions.columns.indexOf(alreadyExisting);
      this._oTableOptions.columns[replacingIndex].aggregate = column;
    }
  }

  parseVisibleColumns() {
    if (this.state.hasOwnProperty('oColumns-display')) {
      // filtering columns that might be in state storage but not in the actual table definition
      let stateCols = [];
      const self = this;
      this.state['oColumns-display'].forEach((oCol, index) => {
        let isVisibleColInColumns = self._oTableOptions.columns.find(col => col.attr === oCol.attr) !== undefined;
        if (isVisibleColInColumns) {
          stateCols.push(oCol);
        } else {
          console.warn('Unable to load the column ' + oCol.attr + ' from the localstorage');
        }
      });

      //if all columns was changed then visibleColArray set with visibleColumns
      let allColumsNotVisible = stateCols.filter(function (col) { return col.visible === true; }).length === 0;
      if (allColumsNotVisible || stateCols.length === 0) {
        this.visibleColArray = Util.parseArray(this.visibleColumns, true);
      } else {
        this.visibleColArray = stateCols.filter(item => item.visible).map(item => item.attr);
      }
    } else {
      this.visibleColArray = Util.parseArray(this.visibleColumns, true);
    }
  }

  parseSortColumns() {
    let sortColumnsParam = this.state['sort-columns'] || this.sortColumns;
    this.sortColArray = ServiceUtils.parseSortColumns(sortColumnsParam);
    // ensuring column existence and checking its orderable state
    for (let i = this.sortColArray.length - 1; i >= 0; i--) {
      const colName = this.sortColArray[i].columnName;
      const oCol = this.getOColumn(colName);
      if (!Util.isDefined(oCol) || !oCol.orderable) {
        this.sortColArray.splice(i, 1);
      }
    }
  }

  initializeParams(): void {
    // If visible-columns is not present then visible-columns is all columns
    if (!this.visibleColumns) {
      this.visibleColumns = this.columns;
    }

    if (this.colArray.length) {
      this.colArray.forEach((x: string) => this.registerColumn(x));

      let columnsOrder = [];
      if (this.state.hasOwnProperty('oColumns-display')) {
        columnsOrder = this.state['oColumns-display'].map(item => item.attr);
      } else {
        columnsOrder = this.colArray.filter(attr => this.visibleColArray.indexOf(attr) === -1);
        columnsOrder.push(...this.visibleColArray);
      }
      this._oTableOptions.columns.sort((a: OColumn, b: OColumn) => columnsOrder.indexOf(a.attr) - columnsOrder.indexOf(b.attr));
    }

    // Initialize quickFilter
    this._oTableOptions.filter = this.quickFilter;

    if (this.state.hasOwnProperty('currentPage')) {
      this.currentPage = this.state['currentPage'];
    }

    // Initialize paginator
    if (!this.paginator && this.paginationControls) {
      this.paginator = new OTablePaginatorComponent(this.injector, this);
    }

    this.initializeCheckboxColumn();
  }

  registerTabListener() {
    // When table is contained into tab component, it is necessary to init table component when attached to DOM.
    const self = this;
    this.tabGroupChangeSubscription = this.tabGroupContainer.selectedTabChange.subscribe((evt) => {
      let interval;
      let timerCallback = (tab: MatTab) => {
        if (tab && tab.content.isAttached) {
          clearInterval(interval);
          if (tab === self.tabContainer) {
            self.insideTabBugWorkaround();
            if (self.tabGroupChangeSubscription) {
              self.tabGroupChangeSubscription.unsubscribe();
            }
            if (self.pendingQuery) {
              self.queryData(self.pendingQueryFilter);
            }
          }
        }
      };
      interval = setInterval(timerCallback(evt.tab), 100);
    });
  }

  protected insideTabBugWorkaround() {
    this.sortHeaders.forEach(sortH => {
      sortH.refresh();
    });
  }

  registerSortListener() {
    if (Util.isDefined(this.sort)) {
      this.sortSubscription = this.sort.oSortChange.subscribe(this.onSortChange.bind(this));
      this.sort.setMultipleSort(this.multipleSort);

      if (Util.isDefined(this._oTableOptions.columns) && (this.sortColArray.length > 0)) {
        this.sort.setTableInfo(this.sortColArray);
      }
    }
  }

  protected onSortChange(sortArray: any[]) {
    this.sortColArray = [];
    sortArray.forEach((sort) => {
      if (sort.direction !== '') {
        this.sortColArray.push({
          columnName: sort.id,
          ascendent: sort.direction === Codes.ASC_SORT
        });
      }
    });
    if (this.pageable) {
      this.reloadData();
    } else {
      this.loadingSorting = true;
    }
  }

  setDatasource() {
    this.dataSource = new OTableDataSource(this);
    if (this.daoTable) {
      this.dataSource.resultsLength = this.daoTable.data.length;
    }
  }

  protected registerDataSourceListeners() {
    if (!this.pageable) {
      const self = this;
      this.onRenderedDataChange = this.dataSource.onRenderedDataChange.subscribe(() => {
        setTimeout(() => {
          self.loadingSorting = false;
        }, 500);
      });
    }
  }

  set loadingSorting(value: boolean) {
    this._loadingSorting = value;
    this.cd.detectChanges();
  }

  get loadingSorting(): boolean {
    return this._loadingSorting;
  }

  showLoading(): boolean {
    return this.loading || this.loadingSorting || this.loadingScroll;
  }

  /**
   * This method manages the call to the service
   * @param filter
   * @param ovrrArgs
   */
  queryData(filter: any = undefined, ovrrArgs?: OQueryDataArgs) {
    // If tab exists and is not active then wait for queryData
    if (this.isInsideInactiveTab()) {
      this.pendingQuery = true;
      this.pendingQueryFilter = filter;
      return;
    }
    this.pendingQuery = false;
    this.pendingQueryFilter = undefined;
    super.queryData(filter, ovrrArgs);
  }

  protected isInsideInactiveTab(): boolean {
    let result: boolean = false;
    if (this.tabContainer && this.tabGroupContainer) {
      result = !(this.tabContainer.isActive || (this.tabGroupContainer.selectedIndex === this.tabContainer.position));
    }
    return result;
  }

  getComponentFilter(existingFilter: any = {}): any {
    let filter = existingFilter;
    if (this.pageable) {
      // Apply quick filter
      let quickFilterExpr = this.oTableQuickFilterComponent ? this.oTableQuickFilterComponent.filterExpression : undefined;
      if (quickFilterExpr) {
        const parentItemExpr = FilterExpressionUtils.buildExpressionFromObject(filter);
        const filterExpr = FilterExpressionUtils.buildComplexExpression(parentItemExpr, quickFilterExpr, FilterExpressionUtils.OP_AND);
        filter = {};
        filter[FilterExpressionUtils.FILTER_EXPRESSION_KEY] = filterExpr;
      }
      // Apply column filters
      let columnFilters: IColumnValueFilter[] = this.dataSource.getColumnValueFilters();
      let beColumnFilters: Array<IExpression> = [];
      columnFilters.forEach(colFilter => {
        // Prepare basic expressions
        if (Util.isDefined(colFilter.operator)) {
          switch (colFilter.operator) {
            case ColumnValueFilterOperator.IN:
              if (Util.isArray(colFilter.values)) {
                let besIn: Array<IExpression> = colFilter.values.map(value => FilterExpressionUtils.buildExpressionEquals(colFilter.attr, value));
                let beIn: IExpression = besIn.pop();
                besIn.forEach(be => {
                  beIn = FilterExpressionUtils.buildComplexExpression(beIn, be, FilterExpressionUtils.OP_OR);
                });
                beColumnFilters.push(beIn);
              }
              break;
            case ColumnValueFilterOperator.BETWEEN:
              if (Util.isArray(colFilter.values) && colFilter.values.length === 2) {
                let beFrom = FilterExpressionUtils.buildExpressionLessEqual(colFilter.attr, colFilter.values[0]);
                let beTo = FilterExpressionUtils.buildExpressionMoreEqual(colFilter.attr, colFilter.values[1]);
                beColumnFilters.push(FilterExpressionUtils.buildComplexExpression(beFrom, beTo, FilterExpressionUtils.OP_AND));
              }
              break;
            case ColumnValueFilterOperator.EQUAL:
              beColumnFilters.push(FilterExpressionUtils.buildExpressionLike(colFilter.attr, colFilter.values));
              break;
            case ColumnValueFilterOperator.LESS_EQUAL:
              beColumnFilters.push(FilterExpressionUtils.buildExpressionLessEqual(colFilter.attr, colFilter.values));
              break;
            case ColumnValueFilterOperator.MORE_EQUAL:
              beColumnFilters.push(FilterExpressionUtils.buildExpressionMoreEqual(colFilter.attr, colFilter.values));
              break;
          }
        }
      });
      // Build complete column filters basic expression
      let beColFilter: IExpression = beColumnFilters.pop();
      beColumnFilters.forEach(be => {
        beColFilter = FilterExpressionUtils.buildComplexExpression(beColFilter, be, FilterExpressionUtils.OP_AND);
      });

      // Add column filters basic expression to current filter
      if (beColFilter) {
        if (!Util.isDefined(filter[FilterExpressionUtils.FILTER_EXPRESSION_KEY])) {
          filter[FilterExpressionUtils.FILTER_EXPRESSION_KEY] = beColFilter;
        } else {
          filter[FilterExpressionUtils.FILTER_EXPRESSION_KEY] = FilterExpressionUtils.buildComplexExpression(filter[FilterExpressionUtils.FILTER_EXPRESSION_KEY], beColFilter, FilterExpressionUtils.OP_AND);
        }
      }
    }

    return super.getComponentFilter(filter);
  }

  updatePaginationInfo(queryRes: any) {
    super.updatePaginationInfo(queryRes);
  }

  protected setData(data: any, sqlTypes: any) {
    this.daoTable.sqlTypesChange.next(sqlTypes);
    this.daoTable.dataChange.next(data);
    this.daoTable.isLoadingResults = false;
    this.updateScrolledState();
    if (Util.isDefined(data)) {
      this.oTableExpandedFooter.updateMessageNotResults(data);
    }
    if (this.pageable) {
      ObservableWrapper.callEmit(this.onPaginatedDataLoaded, data);
    }
    ObservableWrapper.callEmit(this.onDataLoaded, this.daoTable.data);
  }

  showDialogError(error: string, errorOptional?: string) {
    if (Util.isDefined(error) && !Util.isObject(error)) {
      this.dialogService.alert('ERROR', error);
    } else {
      this.dialogService.alert('ERROR', errorOptional);
    }
  }

  projectContentChanged() {
    const self = this;
    setTimeout(function () {
      self.loadingSorting = false;
    }, 500);
    this.loadingScroll = false;

    if (this.previousRendererData !== this.dataSource.renderedData) {
      ObservableWrapper.callEmit(this.onContentChange, this.dataSource.renderedData);
      this.previousRendererData = this.dataSource.renderedData;
    }

    if (Util.isDefined(this.tableHeaderEl)) {
      [].slice.call(this.tableHeaderEl.nativeElement.children).forEach(thEl => {
        const oCol: OColumn = self.getOColumnFromTh(thEl);
        if (Util.isDefined(oCol)) {
          if (!Util.isDefined(oCol.padding)) {
            oCol.padding = (!thEl.previousElementSibling || !thEl.nextElementSibling) ? OTableComponent.FIRST_LAST_CELL_PADDING : 0;
          }
          if (!Util.isDefined(oCol.DOMWidth) && thEl.clientWidth > 0) {
            oCol.DOMWidth = thEl.clientWidth;
          }
        }
      });
    }
  }

  getAttributesValuesToQuery(): Array<string> {
    let columns = super.getAttributesValuesToQuery();
    if (this.avoidQueryColumns.length > 0) {
      for (let i = columns.length - 1; i >= 0; i--) {
        const col = columns[i];
        if (this.avoidQueryColumns.indexOf(col) !== -1) {
          columns.splice(i, 1);
        }
      }
    }
    return columns;
  }

  getQueryArguments(filter: Object, ovrrArgs?: OQueryDataArgs): Array<any> {
    let queryArguments = super.getQueryArguments(filter, ovrrArgs);
    queryArguments[3] = this.getSqlTypesForFilter(queryArguments[1]);
    Object.assign(queryArguments[3], ovrrArgs ? ovrrArgs.sqltypes || {} : {});
    if (this.pageable) {
      queryArguments[5] = this.paginator.isShowingAllRows(queryArguments[5]) ? this.state.totalQueryRecordsNumber : queryArguments[5];
      queryArguments[6] = this.sortColArray;
    }
    return queryArguments;
  }

  getSqlTypesForFilter(filter): Object {
    let allSqlTypes = {};
    this._oTableOptions.columns.forEach((col: OColumn) => {
      if (col.sqlType) {
        allSqlTypes[col.attr] = col.sqlType;
      }
    });
    Object.assign(allSqlTypes, this.getSqlTypes());
    let filterCols = Util.getValuesFromObject(filter);
    let sqlTypes = {};
    Object.keys(allSqlTypes).forEach(key => {
      if (filterCols.indexOf(key) !== -1 && allSqlTypes[key] !== SQLTypes.OTHER) {
        sqlTypes[key] = allSqlTypes[key];
      }
    });
    return sqlTypes;
  }

  onExportButtonClicked() {
    if (this.oTableMenu) {
      this.oTableMenu.onExportButtonClicked();
    }
  }

  onChangeColumnsVisibilityClicked() {
    if (this.oTableMenu) {
      this.oTableMenu.onChangeColumnsVisibilityClicked();
    }
  }

  onMatTableContentChanged() {
    console.log('onMatTableContentChanged');
  }

  add() {
    if (!this.checkEnabledActionPermission(PermissionsUtils.ACTION_INSERT)) {
      return;
    }
    super.insertDetail();
  }

  remove(clearSelectedItems: boolean = false) {
    if (!this.checkEnabledActionPermission(PermissionsUtils.ACTION_DELETE)) {
      return;
    }
    let selectedItems = this.getSelectedItems();
    if (selectedItems.length > 0) {
      this.dialogService.confirm('CONFIRM', 'MESSAGES.CONFIRM_DELETE').then(res => {
        if (res === true) {
          if (this.dataService && (this.deleteMethod in this.dataService) && this.entity && (this.keysArray.length > 0)) {
            let filters = ServiceUtils.getArrayProperties(selectedItems, this.keysArray);
            this.daoTable.removeQuery(filters).subscribe(res => {
              ObservableWrapper.callEmit(this.onRowDeleted, selectedItems);
            }, error => {
              this.showDialogError(error, 'MESSAGES.ERROR_DELETE');
              console.log('[OTable.remove]: error', error);
            }, () => {
              console.log('[OTable.remove]: success');
              this.reloadData();
            });
          } else {
            this.deleteLocalItems();
          }
        } else if (clearSelectedItems) {
          this.clearSelection();
        }
      });
    }
  }

  refresh() {
    this.reloadData();
  }

  showAndSelectAllCheckbox() {
    if (this.isSelectionModeMultiple()) {
      if (this.selectAllCheckbox) {
        this._oTableOptions.selectColumn.visible = true;
      }
      this.updateSelectionColumnState();
      this.selectAll();
    }
  }

  reloadPaginatedDataFromStart() {
    if (this.pageable) {
      // Initialize page index
      this.currentPage = 0;
      this.reloadData();
    }
  }

  reloadData() {
    if (!this.checkEnabledActionPermission(PermissionsUtils.ACTION_REFRESH)) {
      return;
    }

    this.clearSelection();
    this.finishQuerySubscription = false;
    this.pendingQuery = true;
    //this.pageScrollVirtual = 1;
    let queryArgs: OQueryDataArgs;
    if (this.pageable) {
      queryArgs = {
        offset: this.currentPage * this.queryRows,
        length: this.queryRows
      };
    }
    this.queryData(void 0, queryArgs);
  }

  handleClick(item: any, $event?) {
    const self = this;
    this.clickTimer = setTimeout(() => {
      if (!self.clickPrevent) {
        self.doHandleClick(item, $event);
      }
      self.clickPrevent = false;
    }, this.clickDelay);
  }

  doHandleClick(item: any, $event?) {
    if (!this.oenabled) {
      return;
    }
    if ((this.detailMode === Codes.DETAIL_MODE_CLICK)) {
      ObservableWrapper.callEmit(this.onClick, item);
      this.saveDataNavigationInLocalStorage();
      this.viewDetail(item);
      return;
    }
    if (this.isSelectionModeMultiple() && ($event.ctrlKey || $event.metaKey)) {
      // TODO: test $event.metaKey on MAC
      this.selectedRow(item);
      ObservableWrapper.callEmit(this.onClick, item);
    } else if (this.isSelectionModeMultiple() && $event.shiftKey) {
      this.handleMultipleSelection(item);
    } else if (!this.isSelectionModeNone()) {
      const selectedItems = this.getSelectedItems();
      if (this.isSelected(item) && selectedItems.length === 1 && this.editionEnabled) {
        return;
      } else {
        this.clearSelectionAndEditing();
      }
      this.selectedRow(item);
      ObservableWrapper.callEmit(this.onClick, item);
    }
  }

  handleMultipleSelection(item: any) {
    if (this.selection.selected.length > 0) {
      let first = this.dataSource.renderedData.indexOf(this.selection.selected[0]);
      let last = this.dataSource.renderedData.indexOf(item);
      let indexFrom = Math.min(first, last);
      let indexTo = Math.max(first, last);
      this.clearSelection();
      this.dataSource.renderedData.slice(indexFrom, indexTo + 1).forEach(e => this.selectedRow(e));
      ObservableWrapper.callEmit(this.onClick, this.selection.selected);
    }
  }

  protected saveDataNavigationInLocalStorage() {
    super.saveDataNavigationInLocalStorage();
    this.storePaginationState = true;
  }

  handleDoubleClick(item: any, event?) {
    clearTimeout(this.clickTimer);
    this.clickPrevent = true;
    ObservableWrapper.callEmit(this.onDoubleClick, item);
    if (this.oenabled && Codes.isDoubleClickMode(this.detailMode)) {
      this.saveDataNavigationInLocalStorage();
      this.viewDetail(item);
    }
  }

  get editionEnabled(): boolean {
    return (this._oTableOptions.columns.find(item => item.editing) !== undefined);
  }

  handleDOMClick(event) {
    if (this._oTableOptions.selectColumn.visible) {
      return;
    }

    const editingColumn = this._oTableOptions.columns.filter(item => item.editing);
    if (editingColumn && editingColumn.length > 0) {
      return;
    }

    const overlayContainer = document.body.getElementsByClassName('cdk-overlay-container')[0];
    if (overlayContainer && overlayContainer.contains(event.target)) {
      return;
    }

    const tableContent = this.elRef.nativeElement.querySelector('.o-table-container');
    if (!tableContent) {
      return;
    }

    if (tableContent && !tableContent.contains(event.target)
      && (!this.editingCell || !this.editingCell.contains(event.target))
      && this.selection && this.selection.selected.length) {
      this.clearSelection();
    }
  }

  handleCellClick(column: OColumn, row: any, event?) {
    if (this.oenabled && column.editor
      && (this.detailMode !== Codes.DETAIL_MODE_CLICK)
      && (this.editionMode === Codes.DETAIL_MODE_CLICK)) {

      this.activateColumnEdition(column, row, event);
    }
  }

  handleCellDoubleClick(column: OColumn, row: any, event?) {
    if (this.oenabled && column.editor
      && (!Codes.isDoubleClickMode(this.detailMode))
      && (Codes.isDoubleClickMode(this.editionMode))) {

      this.activateColumnEdition(column, row, event);
    }
  }

  protected activateColumnEdition(column: OColumn, row: any, event?) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (event && column.editing && this.editingCell === event.currentTarget) {
      return;
    }
    const columnPermissions: OPermissions = this.getOColumnPermissions(column.attr);
    if (columnPermissions.enabled === false) {
      console.warn(`${column.attr} edition not allowed due to permissions`);
      return;
    }

    this.clearSelectionAndEditing();
    this.selectedRow(row);
    this.editingCell = event.currentTarget;
    let rowData = {};
    this.keysArray.forEach((key) => {
      rowData[key] = row[key];
    });
    rowData[column.attr] = row[column.attr];
    this.editingRow = row;
    column.editor.startEdition(rowData);
    column.editing = true;
  }

  updateCellData(column: OColumn, data: any, saveChanges: boolean) {
    if (!this.checkEnabledActionPermission(PermissionsUtils.ACTION_UPDATE)) {
      const res = new Observable(innerObserver => {
        innerObserver.error();
      });
      return res;
    }
    column.editing = false;
    this.editingCell = undefined;
    if (saveChanges && this.editingRow !== undefined) {
      Object.assign(this.editingRow, data);
    }
    this.editingRow = undefined;
    this.cd.detectChanges();
    if (saveChanges && column.editor.updateRecordOnEdit) {
      let toUpdate = {};
      toUpdate[column.attr] = data[column.attr];
      const kv = this.extractKeysFromRecord(data);
      return this.updateRecord(kv, toUpdate);
    }
    return undefined;
  }

  protected getKeysValues(): any[] {
    let data = this.getAllValues();
    const _self = this;
    return data.map((row) => {
      let obj = {};
      _self.keysArray.forEach((key) => {
        if (row[key] !== undefined) {
          obj[key] = row[key];
        }
      });

      return obj;
    });
  }

  onShowsSelects(event?: any) {
    if (this.oTableMenu) {
      this.oTableMenu.onShowsSelects(event);
    }
  }

  updateSelectionColumnState() {
    if (!this._oTableOptions.selectColumn.visible) {
      this.clearSelection();
    }
    if (this._oTableOptions.visibleColumns && this._oTableOptions.selectColumn.visible && this._oTableOptions.visibleColumns[0] !== OTableComponent.NAME_COLUMN_SELECT) {
      this._oTableOptions.visibleColumns.unshift(OTableComponent.NAME_COLUMN_SELECT);
    } else if (this._oTableOptions.visibleColumns && !this._oTableOptions.selectColumn.visible && this._oTableOptions.visibleColumns[0] === OTableComponent.NAME_COLUMN_SELECT) {
      this._oTableOptions.visibleColumns.shift();
    }
    if (this.oTableInsertableRowComponent !== undefined && this.oTableEditableRow) {
      this.oTableEditableRow.cd.detectChanges();
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource ? this.dataSource.renderedData.length : undefined;
    return numSelected > 0 && numSelected === numRows;
  }

  masterToggle(event: MatCheckboxChange) {
    event.checked ? this.selectAll() : this.clearSelection();
  }

  selectAll() {
    this.dataSource.renderedData.forEach(row => this.selection.select(row));
  }

  selectionCheckboxToggle(event: MatCheckboxChange, row: any) {
    if (this.isSelectionModeSingle()) {
      this.clearSelection();
    }
    this.selectedRow(row);
  }

  selectedRow(row: any) {
    this.selection.toggle(row);
  }

  isSelected(item): boolean {
    return this.selection.selected.indexOf(item) !== -1;
  }

  get showDeleteButton(): boolean {
    return this.deleteButton && !this.selection.isEmpty();
  }

  getTrackByFunction(): Function {
    const self = this;

    return (index: number, item: any) => {
      if (self.hasScrollableContainer() && index < (self.pageScrollVirtual - 1) * OTableComponent.LIMIT_SCROLLVIRTUAL) {
        return null;
      }

      let itemId = '';
      const keysLenght = self.keysArray.length;
      self.keysArray.forEach((key: string, idx: number) => {
        let suffix = idx < (keysLenght - 1) ? ';' : '';
        itemId += item[key] + suffix;
      });


      let asyncAndVisible = self.asyncLoadColumns.filter(c => self._oTableOptions.visibleColumns.indexOf(c) !== -1);
      if (self.asyncLoadColumns.length && asyncAndVisible.length > 0 && !self.finishQuerySubscription) {
        self.queryRowAsyncData(index, item);
        if (self.paginator && index === (self.paginator.pageSize - 1)) {
          self.finishQuerySubscription = true;
        }
        return itemId;
      } else {
        return itemId;
      }
    };
  }

  queryRowAsyncData(rowIndex: number, rowData: any) {
    let kv = ServiceUtils.getObjectProperties(rowData, this.keysArray);
    // Repeating checking of visible column
    let av = this.asyncLoadColumns.filter(c => this._oTableOptions.visibleColumns.indexOf(c) !== -1);
    if (av.length === 0) {
      // Skipping query if there are not visible asyncron columns
      return;
    }
    const columnQueryArgs = [kv, av, this.entity, undefined, undefined, undefined, undefined];
    let queryMethodName = this.pageable ? this.paginatedQueryMethod : this.queryMethod;
    if (this.dataService && (queryMethodName in this.dataService) && this.entity) {
      if (this.asyncLoadSubscriptions[rowIndex]) {
        this.asyncLoadSubscriptions[rowIndex].unsubscribe();
      }
      this.asyncLoadSubscriptions[rowIndex] = this.dataService[queryMethodName].apply(this.dataService, columnQueryArgs).subscribe(res => {
        if (res.code === Codes.ONTIMIZE_SUCCESSFUL_CODE) {
          let data = undefined;
          if (Util.isArray(res.data) && res.data.length === 1) {
            data = res.data[0];
          } else if (Util.isObject(res.data)) {
            data = res.data;
          }
          this.daoTable.setAsynchronousColumn(data, rowData);
          this.cd.detectChanges();
        }
      });
    }
  }

  getValue() {
    return this.dataSource.getCurrentData();
  }

  getAllValues() {
    return this.dataSource.getCurrentAllData();
  }

  getRenderedValue() {
    return this.dataSource.getCurrentRendererData();
  }

  getSqlTypes() {
    return Util.isDefined(this.dataSource.sqlTypes) ? this.dataSource.sqlTypes : {};
  }

  setOTableColumnsFilter(tableColumnsFilter: OTableColumnsFilterComponent) {
    this.oTableColumnsFilterComponent = tableColumnsFilter;
  }

  getStoredColumnsFilters() {
    return this.oTableStorage.getStoredColumnsFilters();
  }

  onFilterByColumnClicked() {
    if (this.oTableMenu) {
      this.oTableMenu.onFilterByColumnClicked();
    }
  }

  onStoreFilterClicked() {
    if (this.oTableMenu) {
      this.oTableMenu.onStoreFilterClicked();
    }
  }

  onLoadFilterClicked() {
    if (this.oTableMenu) {
      this.oTableMenu.onLoadFilterClicked();
    }
  }

  onClearFilterClicked() {
    if (this.oTableMenu) {
      this.oTableMenu.onClearFilterClicked();
    }
  }

  clearFilters(triggerDatasourceUpdate: boolean = true): void {
    this.dataSource.clearColumnFilters(triggerDatasourceUpdate);
    if (this.oTableMenu && this.oTableMenu.columnFilterOption) {
      this.oTableMenu.columnFilterOption.setActive(this.showFilterByColumnIcon);
    }
    if (this.oTableQuickFilterComponent) {
      this.oTableQuickFilterComponent.setValue(void 0);
    }
  }

  isColumnFilterable(column: OColumn): boolean {
    return (this.oTableColumnsFilterComponent && this.oTableColumnsFilterComponent.isColumnFilterable(column.attr));
  }

  isModeColumnFilterable(column: OColumn): boolean {
    return this.showFilterByColumnIcon &&
      (this.oTableColumnsFilterComponent && this.oTableColumnsFilterComponent.isColumnFilterable(column.attr));
  }

  isColumnFilterActive(column: OColumn): boolean {
    return this.showFilterByColumnIcon &&
      this.dataSource.getColumnValueFilterByAttr(column.attr) !== undefined;
  }

  openColumnFilterDialog(column: OColumn, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    let dialogRef = this.dialog.open(OTableFilterByColumnDataDialogComponent, {
      data: {
        previousFilter: this.dataSource.getColumnValueFilterByAttr(column.attr),
        column: column,
        tableData: this.dataSource.getTableData(),
        preloadValues: this.oTableColumnsFilterComponent.preloadValues
      },
      disableClose: true,
      panelClass: ['o-dialog-class', 'o-table-dialog']
    });
    const self = this;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let columnValueFilter = dialogRef.componentInstance.getColumnValuesFilter();
        self.dataSource.addColumnFilter(columnValueFilter);
        self.reloadPaginatedDataFromStart();
      }
    });
  }


  get disableTableMenuButton(): boolean {
    return !!(this.permissions && this.permissions.menu && this.permissions.menu.enabled === false);
  }

  get showTableMenuButton(): boolean {
    const permissionHidden = !!(this.permissions && this.permissions.menu && this.permissions.menu.visible === false);
    if (permissionHidden) {
      return false;
    }
    const staticOpt = this.selectAllCheckbox || this.exportButton || this.columnsVisibilityButton || this.oTableColumnsFilterComponent !== undefined;
    return staticOpt || this.tableOptions.length > 0;
  }

  setOTableInsertableRow(tableInsertableRow: OTableInsertableRowComponent) {
    const insertPerm: OPermissions = this.getActionPermissions(PermissionsUtils.ACTION_INSERT);
    if (insertPerm.visible) {
      tableInsertableRow.enabled = insertPerm.enabled;
      this.oTableInsertableRowComponent = tableInsertableRow;
      this.showFirstInsertableRow = this.oTableInsertableRowComponent.isFirstRow();
      this.showLastInsertableRow = !this.showFirstInsertableRow;
    }
  }

  clearSelectionAndEditing() {
    this.selection.clear();
    this._oTableOptions.columns.forEach(item => {
      item.editing = false;
    });
  }

  clearSelection() {
    this.selection.clear();
  }

  getSelectedItems(): any[] {
    return this.selection.selected;
  }

  useDetailButton(column: OColumn): boolean {
    return column.type === 'editButtonInRow' || column.type === 'detailButtonInRow';
  }

  onDetailButtonClick(column: OColumn, row: any, event: any) {
    event.preventDefault();
    event.stopPropagation();
    switch (column.type) {
      case 'editButtonInRow':
        this.editDetail(row);
        break;
      case 'detailButtonInRow':
        this.viewDetail(row);
        break;
    }
  }

  getDetailButtonIcon(column: OColumn) {
    let result = '';
    switch (column.type) {
      case 'editButtonInRow':
        result = this.editButtonInRowIcon;
        break;
      case 'detailButtonInRow':
        result = this.detailButtonInRowIcon;
        break;
    }
    return result;
  }

  usePlainRender(column: OColumn, row: any): boolean {
    return !this.useDetailButton(column) && !column.renderer && (!column.editor || (!column.editing || !this.selection.isSelected(row)));
  }

  useCellRenderer(column: OColumn, row: any): boolean {
    return column.renderer && (!column.editing || column.editing && !this.selection.isSelected(row));
  }

  useCellEditor(column: OColumn, row: any): boolean {
    if (column.editor && column.editor instanceof OTableCellEditorBooleanComponent && column.editor.autoCommit) {
      return false;
    }
    return column.editor && column.editing && this.selection.isSelected(row);
  }

  isSelectionModeMultiple(): boolean {
    return this.selectionMode === Codes.SELECTION_MODE_MULTIPLE;
  }

  isSelectionModeSingle(): boolean {
    return this.selectionMode === Codes.SELECTION_MODE_SINGLE;
  }

  isSelectionModeNone(): boolean {
    return this.selectionMode === Codes.SELECTION_MODE_NONE;
  }

  onChangePage(evt: PageEvent) {
    this.finishQuerySubscription = false;
    if (!this.pageable) {
      this.currentPage = evt.pageIndex;
      return;
    }
    const tableState = this.state;

    const goingBack = evt.pageIndex < this.currentPage;
    this.currentPage = evt.pageIndex;
    const pageSize = this.paginator.isShowingAllRows(evt.pageSize) ? tableState.totalQueryRecordsNumber : evt.pageSize;

    const oldQueryRows = this.queryRows;
    const changingPageSize = (oldQueryRows !== pageSize);
    this.queryRows = pageSize;

    let newStartRecord;
    let queryLength;

    if (goingBack || changingPageSize) {
      newStartRecord = (this.currentPage * this.queryRows);
      queryLength = this.queryRows;
    } else {
      newStartRecord = Math.max(tableState.queryRecordOffset, (this.currentPage * this.queryRows));
      let newEndRecord = Math.min(newStartRecord + this.queryRows, tableState.totalQueryRecordsNumber);
      queryLength = Math.min(this.queryRows, newEndRecord - newStartRecord);
    }

    const queryArgs: OQueryDataArgs = {
      offset: newStartRecord,
      length: queryLength
    };
    this.finishQuerySubscription = false;
    this.queryData(void 0, queryArgs);
  }

  getOColumn(attr: string): OColumn {
    return this._oTableOptions ? this._oTableOptions.columns.find(item => item.name === attr) : undefined;
  }

  insertRecord(recordData: any, sqlTypes?: Object): Observable<any> {
    if (!this.checkEnabledActionPermission(PermissionsUtils.ACTION_INSERT)) {
      return undefined;
    }
    if (!Util.isDefined(sqlTypes)) {
      let allSqlTypes = this.getSqlTypes();
      let sqlTypes = {};
      Object.keys(recordData).forEach(key => {
        sqlTypes[key] = allSqlTypes[key];
      });
    }
    return this.daoTable.insertQuery(recordData, sqlTypes);
  }

  updateRecord(filter: any, updateData: any, sqlTypes?: Object): Observable<any> {
    if (!this.checkEnabledActionPermission(PermissionsUtils.ACTION_UPDATE)) {
      return of(this.dataSource.data);
    }
    let sqlTypesArg = sqlTypes || {};
    if (!Util.isDefined(sqlTypes)) {
      let allSqlTypes = this.getSqlTypes();
      Object.keys(filter).forEach(key => {
        sqlTypesArg[key] = allSqlTypes[key];
      });
      Object.keys(updateData).forEach(key => {
        sqlTypesArg[key] = allSqlTypes[key];
      });
    }
    return this.daoTable.updateQuery(filter, updateData, sqlTypesArg);
  }

  getDataArray() {
    return this.daoTable.data;
  }

  setDataArray(data: Array<any>) {
    if (this.daoTable) {
      // remote pagination has no sense when using static-data
      this.pageable = false;
      this.staticData = data;
      this.daoTable.usingStaticData = true;
      this.daoTable.setDataArray(this.staticData);
      this.cd.detectChanges();
    }
  }

  protected deleteLocalItems() {
    let dataArray = this.getDataArray();
    const selectedItems = this.getSelectedItems();

    for (let i = 0; i < selectedItems.length; i++) {
      for (let j = dataArray.length - 1; j >= 0; --j) {
        if (Util.equals(selectedItems[i], dataArray[j])) {
          dataArray.splice(j, 1);
          break;
        }
      }
    }
    this.clearSelection();
    this.setDataArray(dataArray);
  }

  isColumnSortActive(column: OColumn): boolean {
    let found = this.sortColArray.find(sortC => sortC.columnName === column.attr);
    return found !== undefined;
  }

  isColumnDescSortActive(column: OColumn): boolean {
    let found = this.sortColArray.find(sortC => sortC.columnName === column.attr && !sortC.ascendent);
    return found !== undefined;
  }

  hasTabGroupChangeSubscription(): boolean {
    return this.tabGroupChangeSubscription !== undefined;
  }

  isEmpty(value: any): boolean {
    return !Util.isDefined(value) || ((typeof value === 'string') && !value);
  }

  setFiltersConfiguration(conf: any) {
    this.filterCaseSensitive = conf.hasOwnProperty('filter-case-sensitive') ? conf['filter-case-sensitive'] : this.filterCaseSensitive;

    const storedColumnFilters = this.oTableStorage.getStoredColumnsFilters(conf);
    this.showFilterByColumnIcon = storedColumnFilters.length > 0;
    if (this.oTableMenu && this.oTableMenu.columnFilterOption) {
      this.oTableMenu.columnFilterOption.setActive(this.showFilterByColumnIcon);
    }

    if (this.oTableColumnsFilterComponent) {
      this.dataSource.initializeColumnsFilters(storedColumnFilters);
    }

    if (this.oTableQuickFilterComponent) {
      this.oTableQuickFilterComponent.setValue(conf['filter']);
      const storedColumnsData = conf['oColumns'] || [];
      storedColumnsData.forEach((oColData: any) => {
        const oCol = this.getOColumn(oColData.attr);
        if (oCol) {
          if (oColData.hasOwnProperty('searchable')) {
            oCol.searchable = oColData.searchable;
          }
          if (oColData.hasOwnProperty('searching')) {
            oCol.searching = oColData.searching;
          }
        }
      });
    }
  }

  onStoreConfigurationClicked() {
    if (this.oTableMenu) {
      this.oTableMenu.onStoreConfigurationClicked();
    }
  }

  onApplyConfigurationClicked() {
    if (this.oTableMenu) {
      this.oTableMenu.onApplyConfigurationClicked();
    }
  }

  applyDefaultConfiguration() {
    this.oTableStorage.reset();
    this.initializeParams();
    this.parseVisibleColumns();
    this._oTableOptions.columns.sort((a: OColumn, b: OColumn) => this.visibleColArray.indexOf(a.attr) - this.visibleColArray.indexOf(b.attr));
    this.insideTabBugWorkaround();
    this.onReinitialize.emit(null);
    this.clearFilters(false);
    this.reloadData();
  }

  applyConfiguration(configurationName: string) {
    let storedConfiguration = this.oTableStorage.getStoredConfiguration(configurationName);
    if (storedConfiguration) {
      const properties = storedConfiguration[OTableStorage.STORED_PROPERTIES_KEY] || [];
      const conf = storedConfiguration[OTableStorage.STORED_CONFIGURATION_KEY];
      properties.forEach(property => {
        switch (property) {
          case 'sort':
            this.state['sort-columns'] = conf['sort-columns'];
            this.parseSortColumns();
            break;
          case 'columns-display':
            this.state['oColumns-display'] = conf['oColumns-display'];
            this.parseVisibleColumns();
            this.state['select-column-visible'] = conf['select-column-visible'];
            this.initializeCheckboxColumn();
            break;
          case 'quick-filter':
          case 'columns-filter':
            this.setFiltersConfiguration(conf);
            break;
          case 'page':
            this.state['currentPage'] = conf['currentPage'];
            this.currentPage = conf['currentPage'];
            if (this.pageable) {
              this.state['totalQueryRecordsNumber'] = conf['totalQueryRecordsNumber'];
              this.state['queryRecordOffset'] = conf['queryRecordOffset'];
            }
            this.queryRows = conf['query-rows'];
            break;
        }
      });
      this.reloadData();
    }
  }

  getTitleAlignClass(oCol: OColumn) {
    let align;
    let hasTitleAlign = Util.isDefined(oCol.definition) && Util.isDefined(oCol.definition.titleAlign);
    let autoAlign = (this.autoAlignTitles && !hasTitleAlign) || (hasTitleAlign && oCol.definition.titleAlign === Codes.COLUMN_TITLE_ALIGN_AUTO);
    if (!autoAlign) {
      return oCol.getTitleAlignClass();
    }
    switch (oCol.type) {
      case 'image':
      case 'date':
      case 'action':
      case 'boolean':
        align = Codes.COLUMN_TITLE_ALIGN_CENTER;
        break;
      case 'currency':
      case 'integer':
      case 'real':
      case 'percentage':
        align = Codes.COLUMN_TITLE_ALIGN_END;
        break;
      case 'service':
      default:
        align = Codes.COLUMN_TITLE_ALIGN_START;
        break;
    }
    return align;
  }

  public getCellAlignClass(column: OColumn): string {
    return Util.isDefined(column.definition) && Util.isDefined(column.definition.contentAlign) ? 'o-' + column.definition.contentAlign : '';
  }

  onTableScroll(e) {
    if (this.hasScrollableContainer()) {
      const tableViewHeight = e.target.offsetHeight; // viewport: ~500px
      const tableScrollHeight = e.target.scrollHeight; // length of all table
      const scrollLocation = e.target.scrollTop; // how far user scrolled

      // If the user has scrolled within 200px of the bottom, add more data
      const buffer = 100;
      const limit_SCROLLVIRTUAL = tableScrollHeight - tableViewHeight - buffer;
      if (scrollLocation > limit_SCROLLVIRTUAL) {
        this.getDataScrollable();
      }
    }
  }

  getDataScrollable(): any {
    const pageVirtualBefore = this.pageScrollVirtual;
    const pageVirtualEnd = Math.ceil(this.dataSource.resultsLength / OTableComponent.LIMIT_SCROLLVIRTUAL);

    if (pageVirtualEnd !== this.pageScrollVirtual) {
      this.pageScrollVirtual++;
    }

    // throw event change scroll
    if (pageVirtualBefore !== this.pageScrollVirtual) {
      this.loadingScroll = true;
      this.dataSource.loadDataScrollable = this.pageScrollVirtual;
    }
  }

  hasScrollableContainer(): boolean {
    return this.dataSource && !this.paginationControls && !this.pageable;
  }

  protected addDefaultRowButtons() {
    // check permissions
    if (this.editButtonInRow) {
      this.addButtonInRow('editButtonInRow');
    }
    if (this.detailButtonInRow) {
      this.addButtonInRow('detailButtonInRow');
    }
  }

  protected addButtonInRow(name: string) {
    let colDef: OColumn = new OColumn(name, this);
    colDef.type = name;
    colDef.visible = true;
    colDef.searchable = false;
    colDef.orderable = false;
    colDef.resizable = false;
    colDef.title = undefined;
    colDef.width = '48px';
    this.pushOColumnDefinition(colDef);
    this._oTableOptions.visibleColumns.push(name);
  }

  get headerHeight() {
    let height = 0;
    if (this.tableHeaderEl && this.tableHeaderEl.nativeElement) {
      height += this.tableHeaderEl.nativeElement.offsetHeight;
    }
    if (this.tableToolbarEl && this.tableToolbarEl.nativeElement) {
      height += this.tableToolbarEl.nativeElement.offsetHeight;
    }
    return height;
  }


  isDetailMode(): boolean {
    return this.detailMode !== Codes.DETAIL_MODE_NONE;
  }

  copyAll() {
    Util.copyToClipboard(JSON.stringify(this.getRenderedValue()));
  }

  copySelection() {
    let selectedItems = this.dataSource.getRenderedData(this.getSelectedItems());
    Util.copyToClipboard(JSON.stringify(selectedItems));
  }


  viewDetail(item: any): void {
    if (!this.checkEnabledActionPermission('detail')) {
      return;
    }
    super.viewDetail(item);
  }

  editDetail(item: any): void {
    if (!this.checkEnabledActionPermission('edit')) {
      return;
    }
    super.editDetail(item);
  }

  getOColumnFromTh(th: any): OColumn {
    let result: OColumn;
    const classList: any[] = [].slice.call((th as Element).classList);
    const columnClass = classList.find((className: string) => (className.startsWith('mat-column-')));
    if (Util.isDefined(columnClass)) {
      result = this.getOColumn(columnClass.substr('mat-column-'.length));
    }
    return result;
  }
}

@NgModule({
  declarations: [
    OTableComponent,
    OTableColumnComponent,
    OTableColumnCalculatedComponent,
    OTableContextMenuComponent,
    OTableRowDirective,
    OTableExpandedFooter,
    ...O_TABLE_CELL_RENDERERS,
    ...O_TABLE_CELL_EDITORS,
    ...O_TABLE_DIALOGS,
    ...O_TABLE_HEADER_COMPONENTS,
    ...O_TABLE_FOOTER_COMPONENTS
  ],
  imports: [
    CommonModule,
    OSharedModule,
    CdkTableModule,
    DndModule,
    OContextMenuModule,
    ObserversModule,
    OMatSortModule
  ],
  exports: [
    OTableComponent,
    OTableColumnComponent,
    CdkTableModule,
    OTableColumnCalculatedComponent,
    OTableContextMenuComponent,
    OTableRowDirective,
    OTableExpandedFooter,
    OMatSortModule,
    ...O_TABLE_HEADER_COMPONENTS,
    ...O_TABLE_CELL_RENDERERS,
    ...O_TABLE_CELL_EDITORS,
    ...O_TABLE_FOOTER_COMPONENTS
  ],
  entryComponents: [
    OTableColumnAggregateComponent,
    OTableContextMenuComponent,
    ...O_TABLE_CELL_RENDERERS,
    ...O_TABLE_CELL_EDITORS,
    ...O_TABLE_DIALOGS
  ],
  providers: [{
    provide: MatPaginatorIntl,
    useClass: OTableMatPaginatorIntl
  },
  { provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: { disabled: true } }]
})
export class OTableModule { }
