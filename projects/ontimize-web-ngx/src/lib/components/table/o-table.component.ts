import { SelectionChange } from '@angular/cdk/collections';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Inject,
  Injector,
  OnDestroy,
  OnInit,
  Optional,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
  ViewRef
} from '@angular/core';
import { MatCheckboxChange, MatDialog, MatMenu, MatPaginator, MatTab, MatTabGroup, PageEvent } from '@angular/material';
import { BehaviorSubject, combineLatest, Observable, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { BooleanConverter, InputConverter } from '../../decorators/input-converter';
import { ServiceResponse } from '../../interfaces';
import { IOContextMenuContext } from '../../interfaces/o-context-menu.interface';
import { OTableButton } from '../../interfaces/o-table-button.interface';
import { OTableButtons } from '../../interfaces/o-table-buttons.interface';
import { OTableDataSource } from '../../interfaces/o-table-datasource.interface';
import { OTableMenu } from '../../interfaces/o-table-menu.interface';
import { OTableOptions } from '../../interfaces/o-table-options.interface';
import { OTablePaginator } from '../../interfaces/o-table-paginator.interface';
import { OTableQuickfilter } from '../../interfaces/o-table-quickfilter.interface';
import { OntimizeServiceProvider } from '../../services/factories';
import { SnackBarService } from '../../services/snackbar.service';
import { Expression } from '../../types/expression.type';
import { OColumnAggregate } from '../../types/o-column-aggregate.type';
import { ColumnValueFilterOperator, OColumnValueFilter } from '../../types/o-column-value-filter.type';
import { OPermissions } from '../../types/o-permissions.type';
import { OTableInitializationOptions } from '../../types/o-table-initialization-options.type';
import { OTableMenuPermissions } from '../../types/o-table-menu-permissions.type';
import { OTablePermissions } from '../../types/o-table-permissions.type';
import { OQueryDataArgs } from '../../types/query-data-args.type';
import { QuickFilterFunction } from '../../types/quick-filter-function.type';
import { SQLOrder } from '../../types/sql-order.type';
import { ObservableWrapper } from '../../util/async';
import { Codes } from '../../util/codes';
import { FilterExpressionUtils } from '../../util/filter-expression.utils';
import { PermissionsUtils } from '../../util/permissions';
import { ServiceUtils } from '../../util/service.utils';
import { SQLTypes } from '../../util/sqltypes';
import { Util } from '../../util/util';
import { OContextMenuComponent } from '../contextmenu/o-context-menu.component';
import { OFormComponent } from '../form/o-form.component';
import { DEFAULT_INPUTS_O_SERVICE_COMPONENT, OServiceComponent } from '../o-service-component.class';
import { OTableColumnCalculatedComponent } from './column/calculated/o-table-column-calculated.component';
import { OColumn } from './column/o-column.class';
import { OTableColumnComponent } from './column/o-table-column.component';
import { DefaultOTableOptions } from './extensions/default-o-table-options.class';
import {
  OTableFilterByColumnDataDialogComponent
} from './extensions/dialog/filter-by-column/o-table-filter-by-column-data-dialog.component';
import { OBaseTablePaginator } from './extensions/footer/paginator/o-base-table-paginator.class';
import { OTableColumnsFilterComponent } from './extensions/header/table-columns-filter/o-table-columns-filter.component';
import { OTableInsertableRowComponent } from './extensions/header/table-insertable-row/o-table-insertable-row.component';
import { OTableOptionComponent } from './extensions/header/table-option/o-table-option.component';
import { OTableDataSourceService } from './extensions/o-table-datasource.service';
import { OTableStorage } from './extensions/o-table-storage.class';
import { OTableDao } from './extensions/o-table.dao';
import { OMatSort } from './extensions/sort/o-mat-sort';
import { OMatSortHeader } from './extensions/sort/o-mat-sort-header';

export const DEFAULT_INPUTS_O_TABLE = [
  ...DEFAULT_INPUTS_O_SERVICE_COMPONENT,

  // visible-columns [string]: visible columns, separated by ';'. Default: no value.
  'visibleColumns: visible-columns',

  // editable-columns [string]: columns that can be edited directly over the table, separated by ';'. Default: no value.
  // 'editableColumns: editable-columns',

  // sort-columns [string]: initial sorting, with the format column:[ASC|DESC], separated by ';'. Default: no value.
  'sortColumns: sort-columns',

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

  // show-configuration-option [yes|no|true|false]: show configuration button in header. Default: yes.
  'showConfigurationOption: show-configuration-option',

  // show-buttons-text [yes|no|true|false]: show text of header buttons. Default: yes.
  'showButtonsText: show-buttons-text',

  // select-all-checkbox [yes|no|true|false]:  show in the menu the option of selection check boxes . Default: no.
  'selectAllCheckbox: select-all-checkbox',

  // pagination-controls [yes|no|true|false]: show pagination controls. Default: yes.
  'paginationControls: pagination-controls',

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
  'enabled',

  'keepSelectedItems: keep-selected-items',

  // export-mode ['visible'|'local'|'all']: sets the mode to export data. Default: 'visible'
  'exportMode: export-mode',

  // exportServiceType [ string ]: The service used by the table for exporting it's data, it must implement 'IExportService' interface. Default: 'OntimizeExportService'
  'exportServiceType: export-service-type',

  // auto-adjust [true|false]: Auto adjust column width to fit its content. Default: true
  'autoAdjust: auto-adjust',

  // show-filter-option [yes|no|true|false]: show filter menu option in the header menu. Default: yes.
  'showFilterOption: show-filter-option',

  // visible-export-dialog-buttons [string]: visible buttons in export dialog, separated by ';'. Default/no configured: show all. Empty value: hide all.
  'visibleExportDialogButtons: visible-export-dialog-buttons',

  // row-class [function, (rowData: any, rowIndex: number) => string | string[]]: adds the class or classes returned by the provided function to the table rows.
  'rowClass: row-class'
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

@Component({
  selector: 'o-table',
  templateUrl: './o-table.component.html',
  styleUrls: ['./o-table.component.scss'],
  providers: [
    OntimizeServiceProvider,
    OTableDataSourceService
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
export class OTableComponent extends OServiceComponent implements OnInit, OnDestroy, AfterViewInit {

  public static DEFAULT_BASE_SIZE_SPINNER = 100;
  public static FIRST_LAST_CELL_PADDING = 24;

  protected snackBarService: SnackBarService;

  public paginator: OTablePaginator;
  @ViewChild(MatPaginator, { static: false }) matpaginator: MatPaginator;
  @ViewChild(OMatSort, { static: true }) sort: OMatSort;

  // only for insideTabBugWorkaround
  @ViewChildren(OMatSortHeader) protected sortHeaders: QueryList<OMatSortHeader>;

  @ViewChild('spinnerContainer', { read: ElementRef, static: false })
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
  @InputConverter()
  showConfigurationOption: boolean = true;
  @InputConverter()
  columnsVisibilityButton: boolean = true;
  @InputConverter()
  showFilterOption: boolean = true;
  @InputConverter()
  showButtonsText: boolean = true;

  protected _oTableOptions: OTableOptions;

  get oTableOptions(): OTableOptions {
    return this._oTableOptions;
  }

  set oTableOptions(value: OTableOptions) {
    this._oTableOptions = value;
  }

  set quickFilter(value: boolean) {
    value = Util.parseBoolean(String(value));
    this._quickFilter = value;
    this._oTableOptions.filter = value;
  }

  get quickFilter(): boolean {
    return this._quickFilter;
  }

  protected filterCaseSensitivePvt: boolean = false;
  @InputConverter()
  set filterCaseSensitive(value: boolean) {
    this.filterCaseSensitivePvt = BooleanConverter(value);
    if (this._oTableOptions) {
      this._oTableOptions.filterCaseSensitive = this.filterCaseSensitivePvt;
    }
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
  editionMode: string = Codes.DETAIL_MODE_NONE;
  selectionMode: string = Codes.SELECTION_MODE_MULTIPLE;
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
  @InputConverter()
  autoAdjust: boolean = true;

  protected _enabled: boolean = true;
  get enabled(): boolean {
    return this._enabled;
  }
  set enabled(val: boolean) {
    val = Util.parseBoolean(String(val));
    this._enabled = val;
  }

  protected _selectAllCheckboxVisible: boolean;
  set selectAllCheckboxVisible(value: boolean) {
    this._selectAllCheckboxVisible = BooleanConverter(this.state['select-column-visible']) || BooleanConverter(value);
    this._oTableOptions.selectColumn.visible = this._selectAllCheckboxVisible;
    this.initializeCheckboxColumn();
  }

  get selectAllCheckboxVisible(): boolean {
    return this._selectAllCheckboxVisible;
  }

  @InputConverter()
  keepSelectedItems: boolean = true;

  public exportMode: string = Codes.EXPORT_MODE_VISIBLE;
  public exportServiceType: string;
  public visibleExportDialogButtons: string;
  public daoTable: OTableDao | null;
  public dataSource: OTableDataSource | null;
  public visibleColumns: string;
  public sortColumns: string;
  public rowClass: (rowData: any, rowIndex: number) => string | string[];

  /*parsed inputs variables */
  protected _visibleColArray: Array<string> = [];

  get visibleColArray(): Array<any> {
    return this._visibleColArray;
  }

  set visibleColArray(arg: Array<any>) {
    const permissionsBlocked = this.permissions ? this.permissions.columns.filter(col => col.visible === false).map(col => col.attr) : [];
    const permissionsChecked = arg.filter(value => permissionsBlocked.indexOf(value) === -1);
    this._visibleColArray = permissionsChecked;
    if (this._oTableOptions) {
      const containsSelectionCol = this._oTableOptions.visibleColumns.indexOf(Codes.NAME_COLUMN_SELECT) !== -1;
      if (containsSelectionCol) {
        this._visibleColArray.unshift(Codes.NAME_COLUMN_SELECT);
      }
      this._oTableOptions.visibleColumns = this._visibleColArray;
    }
  }

  sortColArray: Array<SQLOrder> = [];
  /*end of parsed inputs variables */

  protected tabGroupContainer: MatTabGroup;
  protected tabContainer: MatTab;
  tabGroupChangeSubscription: Subscription;

  protected pendingQuery: boolean = false;
  protected pendingQueryFilter = undefined;

  protected setStaticData: boolean = false;
  protected avoidQueryColumns: Array<any> = [];
  protected asyncLoadColumns: Array<any> = [];
  protected asyncLoadSubscriptions: object = {};

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
  public onVisibleColumnsChange: EventEmitter<any> = new EventEmitter();

  protected selectionChangeSubscription: Subscription;

  public oTableFilterByColumnDataDialogComponent: OTableFilterByColumnDataDialogComponent;
  public oTableColumnsFilterComponent: OTableColumnsFilterComponent;
  public showFilterByColumnIcon: boolean = false;


  private showTotalsSubject = new BehaviorSubject<boolean>(false);
  public showTotals: Observable<boolean> = this.showTotalsSubject.asObservable();
  private loadingSortingSubject = new BehaviorSubject<boolean>(false);
  protected loadingSorting: Observable<boolean> = this.loadingSortingSubject.asObservable();
  private loadingScrollSubject = new BehaviorSubject<boolean>(false);
  public loadingScroll: Observable<boolean> = this.loadingScrollSubject.asObservable();

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
      if (this.matpaginator) {
        this.matpaginator.pageIndex = val;
      }
    }
  }

  get currentPage(): number {
    return this._currentPage;
  }

  public oTableQuickFilterComponent: OTableQuickfilter;
  protected sortSubscription: Subscription;
  protected onRenderedDataChange: Subscription;
  protected previousRendererData;

  quickFilterCallback: QuickFilterFunction;

  @ViewChild('tableBody', { static: false })
  protected tableBodyEl: ElementRef;
  @ViewChild('tableHeader', { read: ElementRef, static: false })
  tableHeaderEl: ElementRef;
  @ViewChild('tableToolbar', { read: ElementRef, static: false })
  tableToolbarEl: ElementRef;

  horizontalScrolled: boolean;
  public onUpdateScrolledState: EventEmitter<any> = new EventEmitter();
  public rowWidth;

  oTableStorage: OTableStorage;
  storePaginationState: boolean = false;

  /* In the case the table havent paginationControl and pageable, the table has pagination virtual*/
  pageScrollVirtual = 1;

  protected permissions: OTablePermissions;
  matMenu: MatMenu;

  @ViewChild('tableMenu', { static: false })
  oTableMenu: OTableMenu;

  @ContentChildren(OTableOptionComponent)
  tableOptions: QueryList<OTableOptionComponent>;

  @ViewChild('tableButtons', { static: false })
  oTableButtons: OTableButtons;

  @ContentChildren('o-table-button')
  tableButtons: QueryList<OTableButton>;

  @ContentChild('o-table-quickfilter', { static: true })
  quickfilterContentChild: OTableQuickfilter;

  @ViewChild('exportOptsTemplate', { static: false })
  exportOptsTemplate: TemplateRef<any>;

  @HostListener('window:resize', [])
  updateScrolledState(): void {
    if (this.horizontalScroll) {
      setTimeout(() => {
        const bodyWidth = this.tableBodyEl.nativeElement.clientWidth;
        const scrollWidth = this.tableBodyEl.nativeElement.scrollWidth;
        const previousState = this.horizontalScrolled;
        this.horizontalScrolled = scrollWidth > bodyWidth;
        if (previousState !== this.horizontalScrolled) {
          this.onUpdateScrolledState.emit(this.horizontalScrolled);
        }
      }, 0);
    }
    this.refreshColumnsWidth();
    // if (this.resizable) {

    // }
  }

  constructor(
    injector: Injector,
    elRef: ElementRef,
    protected dialog: MatDialog,
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent
  ) {
    super(injector, elRef, form);

    this._oTableOptions = new DefaultOTableOptions();
    this._oTableOptions.selectColumn = this.createOColumn();

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

  getSuffixColumnInsertable() {
    return Codes.SUFFIX_COLUMN_INSERTABLE;
  }

  getActionsPermissions(): OPermissions[] {
    return this.permissions ? (this.permissions.actions || []) : [];
  }

  getMenuPermissions(): OTableMenuPermissions {
    const result: OTableMenuPermissions = this.permissions ? this.permissions.menu : undefined;
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
    const enabledPermision = PermissionsUtils.checkEnabledPermission(permissions);
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

    this._oTableOptions = new DefaultOTableOptions();
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
    const queryMethodName = this.pageable ? this.paginatedQueryMethod : this.queryMethod;
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

  reinitialize(options: OTableInitializationOptions): void {
    if (options) {
      const clonedOpts = Object.assign({}, options);
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

      if (clonedOpts.hasOwnProperty('filterColumns')) {
        if (!this.oTableColumnsFilterComponent) {
          this.oTableColumnsFilterComponent = new OTableColumnsFilterComponent(this.injector,this);
        }
        this.oTableColumnsFilterComponent.columns = clonedOpts.filterColumns;
      }
    }

    this.destroy();
    this.initialize();
    this.oTableStorage.reset();
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

  registerQuickFilter(arg: any) {
    const quickFilter = (arg as OTableQuickfilter);
    // forcing quickFilterComponent to be undefined, table uses oTableQuickFilterComponent
    this.quickFilterComponent = undefined;
    this.oTableQuickFilterComponent = quickFilter;
    this.oTableQuickFilterComponent.setValue(this.state.filter, false);
  }

  registerPagination(value: OTablePaginator) {
    this.paginationControls = true;
    this.paginator = value;
  }

  registerContextMenu(value: OContextMenuComponent): void {
    this.tableContextMenu = value;
    this.contextMenuSubscription = this.tableContextMenu.onShow.subscribe((params: IOContextMenuContext) => {
      params.class = 'o-table-context-menu ' + this.rowHeight;
      if (params.data && !this.selection.isSelected(params.data.rowValue)) {
        this.clearSelection();
        this.selectedRow(params.data.rowValue);
      }
    });
  }

  registerDefaultColumn(column: string) {
    if (Util.isDefined(this.getOColumn(column))) {
      // a default column definition trying to replace an already existing definition
      return;
    }
    const colDef: OColumn = this.createOColumn(column, this);
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
    const colDef: OColumn = this.createOColumn(column.attr, this, column);
    let columnWidth = column.width;
    const storedCols = this.state['oColumns-display'];

    if (Util.isDefined(storedCols)) {
      const storedData = storedCols.find(oCol => oCol.attr === colDef.attr);
      if (Util.isDefined(storedData) && Util.isDefined(storedData.width)) {
        // check that the width of the columns saved in the initial configuration
        // in the local storage is different from the original value
        if (this.state.hasOwnProperty('initial-configuration')) {
          if (this.state['initial-configuration'].hasOwnProperty('oColumns-display')) {
            const initialStoredCols = this.state['initial-configuration']['oColumns-display'];
            initialStoredCols.forEach(element => {
              if (colDef.attr === element.attr && element.width === colDef.definition.originalWidth) {
                columnWidth = storedData.width;
              }
            });
          } else {
            columnWidth = storedData.width;
          }
        }
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
    const editableColumns = this._oTableOptions.columns.filter(col => {
      return Util.isDefined(col.editor);
    });
    if (editableColumns.length > 0) {
      console.warn('Using a column with a editor but there is no edition-mode defined');
    }
  }

  registerColumnAggregate(column: OColumnAggregate) {
    this.showTotalsSubject.next(true);
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
      this.state['oColumns-display'].forEach((oCol, index) => {
        const isVisibleColInColumns = this._oTableOptions.columns.find(col => col.attr === oCol.attr) !== undefined;
        if (isVisibleColInColumns) {
          stateCols.push(oCol);
        } else {
          console.warn('Unable to load the column ' + oCol.attr + ' from the localstorage');
        }
      });
      stateCols = this.checkChangesVisibleColummnsInInitialConfiguration(stateCols);
      this.visibleColArray = stateCols.filter(item => item.visible).map(item => item.attr);
    } else {
      this.visibleColArray = Util.parseArray(this.visibleColumns, true);
      this._oTableOptions.columns.sort((a: OColumn, b: OColumn) => this.visibleColArray.indexOf(a.attr) - this.visibleColArray.indexOf(b.attr));
    }
  }

  checkChangesVisibleColummnsInInitialConfiguration(stateCols) {
    if (this.state.hasOwnProperty('initial-configuration')) {
      if (this.state['initial-configuration'].hasOwnProperty('oColumns-display')) {

        const originalVisibleColArray = this.state['initial-configuration']['oColumns-display'].map(x => {
          if (x.visible === true) {
            return x.attr;
          }
        });
        const visibleColArray = Util.parseArray(this.visibleColumns, true);

        // Find values in visible-columns that they arent in original-visible-columns in localstorage
        // in this case you have to add this column to this.visibleColArray
        const colToAddInVisibleCol = Util.differenceArrays(visibleColArray, originalVisibleColArray);
        if (colToAddInVisibleCol.length > 0) {
          colToAddInVisibleCol.forEach((colAdd, index) => {
            if (stateCols.filter(col => col.attr === colAdd).length > 0) {
              stateCols = stateCols.map(col => {
                if (colToAddInVisibleCol.indexOf(col.attr) > -1) {
                  col.visible = true;
                }
                return col;
              });
            } else {
              this.colArray.forEach((element, i) => {
                if (element === colAdd) {
                  stateCols.splice(i + 1, 0,
                    {
                      attr: colAdd,
                      visible: true,
                      width: undefined
                    });
                }

              });
            }
          });
        }

        // Find values in original-visible-columns in localstorage that they arent in this.visibleColArray
        // in this case you have to delete this column to this.visibleColArray
        const colToDeleteInVisibleCol = Util.differenceArrays(originalVisibleColArray, visibleColArray);
        if (colToDeleteInVisibleCol.length > 0) {
          stateCols = stateCols.map(col => {
            if (colToDeleteInVisibleCol.indexOf(col.attr) > -1) {
              col.visible = false;
            }
            return col;
          });
        }
      }
    }
    return stateCols;
  }

  parseSortColumns() {
    const sortColumnsParam = this.state['sort-columns'] || this.sortColumns;
    this.sortColArray = ServiceUtils.parseSortColumns(sortColumnsParam);

    // checking the original sort columns with the sort columns in initial configuration in local storage
    if (this.state['sort-columns'] && this.state['initial-configuration']['sort-columns']) {

      const initialConfigSortColumnsArray = ServiceUtils.parseSortColumns(this.state['initial-configuration']['sort-columns']);
      const originalSortColumnsArray = ServiceUtils.parseSortColumns(this.sortColumns);
      // Find values in visible-columns that they arent in original-visible-columns in localstorage
      // in this case you have to add this column to this.visibleColArray
      const colToAddInVisibleCol = Util.differenceArrays(originalSortColumnsArray, initialConfigSortColumnsArray);
      if (colToAddInVisibleCol.length > 0) {
        colToAddInVisibleCol.forEach(colAdd => {
          this.sortColArray.push(colAdd);
        });
      }

      const colToDelInVisibleCol = Util.differenceArrays(initialConfigSortColumnsArray, originalSortColumnsArray);
      if (colToDelInVisibleCol.length > 0) {
        colToDelInVisibleCol.forEach((colDel) => {
          this.sortColArray.forEach((col, i) => {
            if (col.columnName === colDel.columnName) {
              this.sortColArray.splice(i, 1);
            }
          });
        });
      }
    }

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

      this._oTableOptions.columns.sort((a: OColumn, b: OColumn) => {
        if (columnsOrder.indexOf(a.attr) === -1) {
          // if it is not in local storage because it is new, keep order
          return 0;
        } else {
          return columnsOrder.indexOf(a.attr) - columnsOrder.indexOf(b.attr);
        }
      });

    }

    // Initialize quickFilter
    this._oTableOptions.filter = this.quickFilter;

    if (this.state.hasOwnProperty('currentPage')) {
      this.currentPage = this.state.currentPage;
    }

    // Initialize paginator
    if (!this.paginator && this.paginationControls) {
      this.paginator = new OBaseTablePaginator();
      this.paginator.pageSize = this.queryRows;
      this.paginator.pageIndex = this.currentPage;
      this.paginator.showFirstLastButtons = this.showPaginatorFirstLastButtons;
    }

    if (!Util.isDefined(this.selectAllCheckboxVisible)) {
      this._oTableOptions.selectColumn.visible = !!this.state['select-column-visible'];
    } else {
      // checking the original selectAllCheckboxVisible with select-column-visible in initial configuration in local storage
      if (this.state.hasOwnProperty('initial-configuration') && this.state['initial-configuration'].hasOwnProperty('select-column-visible')
        && this.selectAllCheckboxVisible === this.state['initial-configuration']['select-column-visible']) {
        this._oTableOptions.selectColumn.visible = !!this.state['select-column-visible'];
      } else {
        this._oTableOptions.selectColumn.visible = this.selectAllCheckboxVisible;
      }
    }

    this.initializeCheckboxColumn();
  }

  registerTabListener() {
    // When table is contained into tab component, it is necessary to init table component when attached to DOM.
    this.tabGroupChangeSubscription = this.tabGroupContainer.selectedTabChange.subscribe((evt) => {
      let interval;
      const timerCallback = (tab: MatTab) => {
        if (tab && tab.content.isAttached) {
          clearInterval(interval);
          if (tab === this.tabContainer) {
            this.insideTabBugWorkaround();
            if (this.pendingQuery) {
              this.queryData(this.pendingQueryFilter);
            }
          }
        }
      };
      interval = setInterval(() => { timerCallback(evt.tab); }, 100);
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
      this.loadingSortingSubject.next(true);
      this.cd.detectChanges();
    }
  }

  setDatasource() {
    const dataSourceService = this.injector.get(OTableDataSourceService);
    this.dataSource = dataSourceService.getInstance(this);
  }

  protected registerDataSourceListeners() {
    if (!this.pageable) {
      this.onRenderedDataChange = this.dataSource.onRenderedDataChange.subscribe(() => {
        setTimeout(() => {
          this.loadingSortingSubject.next(false);
          if (this.cd && !(this.cd as ViewRef).destroyed) {
            this.cd.detectChanges();
          }
        }, 500);
      });
    }
  }

  get showLoading() {
    return combineLatest([this.loading, this.loadingSorting, this.loadingScroll])
      .pipe(map((res: any[]) => (res[0] || res[1] || res[2])));
  }


  /**
   * This method manages the call to the service
   * @param filter
   * @param ovrrArgs
   */
  queryData(filter?: any, ovrrArgs?: OQueryDataArgs) {
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
      if (Object.keys(filter).length > 0) {
        const parentItemExpr = FilterExpressionUtils.buildExpressionFromObject(filter);
        filter = {};
        filter[FilterExpressionUtils.FILTER_EXPRESSION_KEY] = parentItemExpr;
      }
      const beColFilter = this.getColumnFiltersExpression();
      // Add column filters basic expression to current filter
      if (beColFilter && !Util.isDefined(filter[FilterExpressionUtils.FILTER_EXPRESSION_KEY])) {
        filter[FilterExpressionUtils.FILTER_EXPRESSION_KEY] = beColFilter;
      } else if (beColFilter) {
        filter[FilterExpressionUtils.FILTER_EXPRESSION_KEY] =
          FilterExpressionUtils.buildComplexExpression(filter[FilterExpressionUtils.FILTER_EXPRESSION_KEY], beColFilter, FilterExpressionUtils.OP_AND);
      }
    }
    return super.getComponentFilter(filter);
  }

  protected getQuickFilterExpression(): Expression {
    if (Util.isDefined(this.oTableQuickFilterComponent) && this.pageable) {
      return this.oTableQuickFilterComponent.filterExpression;
    }
    return undefined;
  }

  protected getColumnFiltersExpression(): Expression {
    // Apply column filters
    const columnFilters: OColumnValueFilter[] = this.dataSource.getColumnValueFilters();
    const beColumnFilters: Array<Expression> = [];
    columnFilters.forEach(colFilter => {
      // Prepare basic expressions
      switch (colFilter.operator) {
        case ColumnValueFilterOperator.IN:
          if (Util.isArray(colFilter.values)) {
            const besIn: Array<Expression> = colFilter.values.map(value => FilterExpressionUtils.buildExpressionEquals(colFilter.attr, value));
            let beIn: Expression = besIn.pop();
            besIn.forEach(be => {
              beIn = FilterExpressionUtils.buildComplexExpression(beIn, be, FilterExpressionUtils.OP_OR);
            });
            beColumnFilters.push(beIn);
          }
          break;
        case ColumnValueFilterOperator.BETWEEN:
          if (Util.isArray(colFilter.values) && colFilter.values.length === 2) {
            let beFrom = FilterExpressionUtils.buildExpressionMoreEqual(colFilter.attr, colFilter.values[0]);
            let beTo = FilterExpressionUtils.buildExpressionLessEqual(colFilter.attr, colFilter.values[1]);
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

    });
    // Build complete column filters basic expression
    let beColFilter: Expression = beColumnFilters.pop();
    beColumnFilters.forEach(be => {
      beColFilter = FilterExpressionUtils.buildComplexExpression(beColFilter, be, FilterExpressionUtils.OP_AND);
    });
    return beColFilter;
  }

  updatePaginationInfo(queryRes: any) {
    super.updatePaginationInfo(queryRes);
  }

  protected setData(data: any, sqlTypes: any) {
    this.daoTable.sqlTypesChange.next(sqlTypes);
    this.daoTable.setDataArray(data);
    this.updateScrolledState();
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
    setTimeout(() => {
      this.loadingSortingSubject.next(false);
    }, 500);
    this.loadingScrollSubject.next(false);

    if (this.previousRendererData !== this.dataSource.renderedData) {
      this.previousRendererData = this.dataSource.renderedData;
      ObservableWrapper.callEmit(this.onContentChange, this.dataSource.renderedData);
    }

    this.getColumnsWidthFromDOM();

    if (this.state.hasOwnProperty('selection') && this.dataSource.renderedData.length > 0 && this.getSelectedItems().length === 0) {
      this.state.selection.forEach(selectedItem => {
        // finding selected item data in the table rendered data
        const foundItem = this.dataSource.renderedData.find(data => {
          let result = true;
          Object.keys(selectedItem).forEach(key => {
            result = result && (data[key] === selectedItem[key]);
          });
          return result;
        });
        if (foundItem) {
          this.selection.select(foundItem);
        }
      });
    }
  }

  getAttributesValuesToQuery(): Array<string> {
    const columns = super.getAttributesValuesToQuery();
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

  getQueryArguments(filter: object, ovrrArgs?: OQueryDataArgs): Array<any> {
    const queryArguments = super.getQueryArguments(filter, ovrrArgs);
    queryArguments[3] = this.getSqlTypesForFilter(queryArguments[1]);
    Object.assign(queryArguments[3], ovrrArgs ? ovrrArgs.sqltypes || {} : {});
    if (this.pageable) {
      queryArguments[5] = this.paginator.isShowingAllRows(queryArguments[5]) ? this.state.totalQueryRecordsNumber : queryArguments[5];
      queryArguments[6] = this.sortColArray;
    }
    return queryArguments;
  }

  getSqlTypesForFilter(filter): object {
    const allSqlTypes = {};
    this._oTableOptions.columns.forEach((col: OColumn) => {
      if (col.sqlType) {
        allSqlTypes[col.attr] = col.sqlType;
      }
    });
    Object.assign(allSqlTypes, this.getSqlTypes());
    const filterCols = Util.getValuesFromObject(filter);
    const sqlTypes = {};
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
    //
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
    const selectedItems = this.getSelectedItems();
    if (selectedItems.length > 0) {
      this.dialogService.confirm('CONFIRM', 'MESSAGES.CONFIRM_DELETE').then(res => {
        if (res === true) {
          if (this.dataService && (this.deleteMethod in this.dataService) && this.entity && (this.keysArray.length > 0)) {
            const filters = ServiceUtils.getArrayProperties(selectedItems, this.keysArray);
            this.daoTable.removeQuery(filters).subscribe(() => {
              ObservableWrapper.callEmit(this.onRowDeleted, selectedItems);
            }, error => {
              this.showDialogError(error, 'MESSAGES.ERROR_DELETE');
            }, () => {
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
      this.initializeCheckboxColumn();
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
    Object.assign(this.state, this.oTableStorage.getTablePropertyToStore('selection'));
    this.clearSelection();
    this.finishQuerySubscription = false;
    this.pendingQuery = true;
    // this.pageScrollVirtual = 1;
    let queryArgs: OQueryDataArgs;
    if (this.pageable) {
      queryArgs = {
        offset: this.currentPage * this.queryRows,
        length: this.queryRows
      };
    }
    this.editingCell = undefined;
    this.queryData(void 0, queryArgs);
  }

  handleClick(item: any, $event?) {
    this.clickTimer = setTimeout(() => {
      if (!this.clickPrevent) {
        this.doHandleClick(item, $event);
      }
      this.clickPrevent = false;
    }, this.clickDelay);
  }

  doHandleClick(item: any, $event?) {
    if (!this.oenabled) {
      return;
    }
    if ((this.detailMode === Codes.DETAIL_MODE_CLICK)) {
      ObservableWrapper.callEmit(this.onClick, item);
      this.saveDataNavigationInLocalStorage();
      this.selection.clear();
      this.selectedRow(item);
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
      if (this.selection.isSelected(item) && selectedItems.length === 1 && this.editionEnabled) {
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
      const first = this.dataSource.renderedData.indexOf(this.selection.selected[0]);
      const last = this.dataSource.renderedData.indexOf(item);
      const indexFrom = Math.min(first, last);
      const indexTo = Math.max(first, last);
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
    return this._oTableOptions.columns.some(item => item.editing);
  }

  handleDOMClick(event) {
    if (this._oTableOptions.selectColumn.visible) {
      return;
    }

    if (this.editionEnabled) {
      return;
    }

    const overlayContainer = document.body.getElementsByClassName('cdk-overlay-container')[0];
    if (overlayContainer && overlayContainer.contains(event.target)) {
      return;
    }

    const tableContainer = this.elRef.nativeElement.querySelector('.o-table-container');
    const tableContent = this.elRef.nativeElement.querySelector('.o-table-container table.mat-table');
    if (tableContainer && tableContent && tableContainer.contains(event.target) && !tableContent.contains(event.target)) {
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
    if (event) {
      this.editingCell = event.currentTarget;
    }
    const rowData = {};
    this.keysArray.forEach((key) => {
      rowData[key] = row[key];
    });
    rowData[column.attr] = row[column.attr];
    this.editingRow = row;
    column.editing = true;
    column.editor.startEdition(rowData);
    this.cd.detectChanges();
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
    if (saveChanges && column.editor.updateRecordOnEdit) {
      const toUpdate = {};
      toUpdate[column.attr] = data[column.attr];
      const kv = this.extractKeysFromRecord(data);
      return this.updateRecord(kv, toUpdate);
    }
    return undefined;
  }

  protected getKeysValues(): any[] {
    const data = this.getAllValues();
    return data.map((row) => {
      const obj = {};
      this.keysArray.forEach((key) => {
        if (row[key] !== undefined) {
          obj[key] = row[key];
        }
      });

      return obj;
    });
  }

  onShowsSelects() {
    if (this.oTableMenu) {
      this.oTableMenu.onShowsSelects();
    }
  }

  initializeCheckboxColumn() {
    // Initializing row selection listener
    if (!this.selectionChangeSubscription && this._oTableOptions.selectColumn.visible) {
      this.selectionChangeSubscription = this.selection.changed.subscribe((selectionData: SelectionChange<any>) => {
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

  protected updateSelectionColumnState() {
    if (!this._oTableOptions.selectColumn.visible) {
      this.clearSelection();
    }
    if (this._oTableOptions.visibleColumns && this._oTableOptions.selectColumn.visible
      && this._oTableOptions.visibleColumns[0] !== Codes.NAME_COLUMN_SELECT) {
      this._oTableOptions.visibleColumns.unshift(Codes.NAME_COLUMN_SELECT);
    } else if (this._oTableOptions.visibleColumns && !this._oTableOptions.selectColumn.visible
      && this._oTableOptions.visibleColumns[0] === Codes.NAME_COLUMN_SELECT) {
      this._oTableOptions.visibleColumns.shift();
    }
  }

  public isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource ? this.dataSource.renderedData.length : undefined;
    return numSelected > 0 && numSelected === numRows;
  }

  public masterToggle(event: MatCheckboxChange): void {
    event.checked ? this.selectAll() : this.clearSelection();
  }

  public selectAll(): void {
    this.dataSource.renderedData.forEach(row => this.selection.select(row));
  }

  public selectionCheckboxToggle(event: MatCheckboxChange, row: any): void {
    if (this.isSelectionModeSingle()) {
      this.clearSelection();
    }
    this.selectedRow(row);
  }

  public selectedRow(row: any): void {
    this.setSelected(row);
    this.cd.detectChanges();
  }

  get showDeleteButton(): boolean {
    return this.deleteButton;
  }

  getTrackByFunction(): (index: number, item: any) => string {
    const self = this;

    return (index: number, item: any) => {
      if (self.hasScrollableContainer() && index < (self.pageScrollVirtual - 1) * Codes.LIMIT_SCROLLVIRTUAL) {
        return null;
      }

      let itemId: string = '';
      const keysLenght = self.keysArray.length;
      self.keysArray.forEach((key: string, idx: number) => {
        const suffix = idx < (keysLenght - 1) ? ';' : '';
        itemId += item[key] + suffix;
      });


      const asyncAndVisible = self.asyncLoadColumns.filter(c => self._oTableOptions.visibleColumns.indexOf(c) !== -1);
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
    const kv = ServiceUtils.getObjectProperties(rowData, this.keysArray);
    // Repeating checking of visible column
    const av = this.asyncLoadColumns.filter(c => this._oTableOptions.visibleColumns.indexOf(c) !== -1);
    if (av.length === 0) {
      // Skipping query if there are not visible asyncron columns
      return;
    }
    const columnQueryArgs = [kv, av, this.entity, undefined, undefined, undefined, undefined];
    const queryMethodName = this.pageable ? this.paginatedQueryMethod : this.queryMethod;
    if (this.dataService && (queryMethodName in this.dataService) && this.entity) {
      if (this.asyncLoadSubscriptions[rowIndex]) {
        this.asyncLoadSubscriptions[rowIndex].unsubscribe();
      }
      this.asyncLoadSubscriptions[rowIndex] = this.dataService[queryMethodName]
        .apply(this.dataService, columnQueryArgs)
        .subscribe((res: ServiceResponse) => {
          if (res.isSuccessful()) {
            let data;
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

  getAllRenderedValues() {
    return this.dataSource.getAllRendererData();
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

  clearColumnFilters(triggerDatasourceUpdate: boolean = true): void {
    this.dataSource.clearColumnFilters(triggerDatasourceUpdate);
    this.reloadPaginatedDataFromStart();
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
    const dialogRef = this.dialog.open(OTableFilterByColumnDataDialogComponent, {
      data: {
        previousFilter: this.dataSource.getColumnValueFilterByAttr(column.attr),
        column: column,
        tableData: this.dataSource.getTableData(),
        preloadValues: this.oTableColumnsFilterComponent.preloadValues,
        mode: this.oTableColumnsFilterComponent.mode
      },
      disableClose: true,
      panelClass: ['o-dialog-class', 'o-table-dialog']
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const columnValueFilter = dialogRef.componentInstance.getColumnValuesFilter();
        this.dataSource.addColumnFilter(columnValueFilter);
        this.reloadPaginatedDataFromStart();
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
    const staticOpt = this.selectAllCheckbox || this.exportButton || this.showConfigurationOption || this.columnsVisibilityButton || (this.showFilterOption && this.oTableColumnsFilterComponent !== undefined);
    return staticOpt || this.tableOptions.length > 0;
  }

  setOTableInsertableRow(tableInsertableRow: OTableInsertableRowComponent) {
    const insertPerm: OPermissions = this.getActionPermissions(PermissionsUtils.ACTION_INSERT);
    if (insertPerm.visible) {
      tableInsertableRow.enabled = insertPerm.enabled;
      this.oTableInsertableRowComponent = tableInsertableRow;
      this.showFirstInsertableRow = this.oTableInsertableRowComponent.isFirstRow();
      this.showLastInsertableRow = !this.showFirstInsertableRow;
      this.oTableInsertableRowComponent.initializeEditors();
    }
  }

  clearSelectionAndEditing() {
    this.selection.clear();
    this._oTableOptions.columns.forEach(item => {
      item.editing = false;
    });
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
    // TODO Add column.editor instanceof OTableCellEditorBooleanComponent to condition
    if (column.editor && column.editor.autoCommit) {
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
      const newEndRecord = Math.min(newStartRecord + this.queryRows, tableState.totalQueryRecordsNumber);
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

  insertRecord(recordData: any, sqlTypes?: object): Observable<any> {
    if (!this.checkEnabledActionPermission(PermissionsUtils.ACTION_INSERT)) {
      return undefined;
    }
    if (!Util.isDefined(sqlTypes)) {
      const allSqlTypes = this.getSqlTypes();
      sqlTypes = {};
      Object.keys(recordData).forEach(key => {
        sqlTypes[key] = allSqlTypes[key];
      });
    }
    return this.daoTable.insertQuery(recordData, sqlTypes);
  }

  updateRecord(filter: any, updateData: any, sqlTypes?: object): Observable<any> {
    if (!this.checkEnabledActionPermission(PermissionsUtils.ACTION_UPDATE)) {
      return of(this.dataSource.data);
    }
    const sqlTypesArg = sqlTypes || {};
    if (!Util.isDefined(sqlTypes)) {
      const allSqlTypes = this.getSqlTypes();
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
    }
  }

  protected deleteLocalItems() {
    const dataArray = this.getDataArray();
    const selectedItems = this.getSelectedItems();
    selectedItems.forEach((selectedItem: any) => {
      for (let j = dataArray.length - 1; j >= 0; --j) {
        if (Util.equals(selectedItem, dataArray[j])) {
          dataArray.splice(j, 1);
          break;
        }
      }
    });
    this.clearSelection();
    this.setDataArray(dataArray);
  }

  isColumnSortActive(column: OColumn): boolean {
    const found = this.sortColArray.find(sortC => sortC.columnName === column.attr);
    return found !== undefined;
  }

  isColumnDescSortActive(column: OColumn): boolean {
    const found = this.sortColArray.find(sortC => sortC.columnName === column.attr && !sortC.ascendent);
    return found !== undefined;
  }

  hasTabGroupChangeSubscription(): boolean {
    return this.tabGroupChangeSubscription !== undefined;
  }

  isEmpty(value: any): boolean {
    return !Util.isDefined(value) || ((typeof value === 'string') && !value);
  }

  setFiltersConfiguration(conf: any) {
    // initialize filterCaseSensitive

    /*
      Checking the original filterCaseSensitive with the filterCaseSensitive in initial configuration in local storage
      if filterCaseSensitive in initial configuration is equals to original filterCaseSensitive input
      filterCaseSensitive will be the value in local storage
    */
    if (Util.isDefined(this.filterCaseSensitive) && this.state.hasOwnProperty('initial-configuration') &&
      this.state['initial-configuration'].hasOwnProperty('filter-case-sensitive') &&
      this.filterCaseSensitive === conf['initial-configuration']['filter-case-sensitive']) {
      this.filterCaseSensitive = conf.hasOwnProperty('filter-case-sensitive') ? conf['filter-case-sensitive'] : this.filterCaseSensitive;
    }

    const storedColumnFilters = this.oTableStorage.getStoredColumnsFilters(conf);
    this.showFilterByColumnIcon = storedColumnFilters.length > 0;
    if (this.oTableMenu && this.oTableMenu.columnFilterOption) {
      this.oTableMenu.columnFilterOption.setActive(this.showFilterByColumnIcon);
    }

    if (this.oTableColumnsFilterComponent) {
      this.dataSource.initializeColumnsFilters(storedColumnFilters);
    }

    if (this.oTableQuickFilterComponent) {
      this.oTableQuickFilterComponent.setValue(conf.filter);
      const storedColumnsData = conf.oColumns || [];
      storedColumnsData.forEach((oColData: any) => {
        const oCol = this.getOColumn(oColData.attr);
        if (oCol) {
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
    const storedConfiguration = this.oTableStorage.getStoredConfiguration(configurationName);
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
            this.state.currentPage = conf.currentPage;
            this.currentPage = conf.currentPage;
            if (this.pageable) {
              this.state.totalQueryRecordsNumber = conf.totalQueryRecordsNumber;
              this.state.queryRecordOffset = conf.queryRecordOffset;
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
    const hasTitleAlign = Util.isDefined(oCol.definition) && Util.isDefined(oCol.definition.titleAlign);
    const autoAlign = (this.autoAlignTitles && !hasTitleAlign) || (hasTitleAlign && oCol.definition.titleAlign === Codes.COLUMN_TITLE_ALIGN_AUTO);
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
    const pageVirtualEnd = Math.ceil(this.dataSource.resultsLength / Codes.LIMIT_SCROLLVIRTUAL);

    if (pageVirtualEnd !== this.pageScrollVirtual) {
      this.pageScrollVirtual++;
    }

    // throw event change scroll
    if (pageVirtualBefore !== this.pageScrollVirtual) {
      this.loadingScrollSubject.next(true);
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
    const colDef: OColumn = this.createOColumn(name, this);
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
    const selectedItems = this.dataSource.getRenderedData(this.getSelectedItems());
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

  getColumnInsertable(name): string {
    return name + this.getSuffixColumnInsertable();
  }

  isRowSelected(row: any): boolean {
    return !this.isSelectionModeNone() && this.selection.isSelected(row);
  }

  protected getColumnsWidthFromDOM() {
    if (Util.isDefined(this.tableHeaderEl)) {
      [].slice.call(this.tableHeaderEl.nativeElement.children).forEach(thEl => {
        const oCol: OColumn = this.getOColumnFromTh(thEl);
        if (Util.isDefined(oCol) && thEl.clientWidth > 0 && oCol.DOMWidth !== thEl.clientWidth) {
          oCol.DOMWidth = thEl.clientWidth;
        }
      });
    }
  }

  refreshColumnsWidth() {
    this._oTableOptions.columns.filter(c => c.visible).forEach((c) => {
      c.DOMWidth = undefined;
    });
    this.cd.detectChanges();
    setTimeout(() => {
      this.getColumnsWidthFromDOM();
      this._oTableOptions.columns.filter(c => c.visible).forEach(c => {
        if (Util.isDefined(c.definition) && Util.isDefined(c.definition.width) && this.horizontalScroll) {
          c.width = c.definition.width;
        }
        c.getRenderWidth(this.horizontalScroll);
      });
      this.cd.detectChanges();
    }, 0);
  }

  private createOColumn(attr?: string, table?: OTableComponent, column?: OTableColumnComponent & OTableColumnCalculatedComponent): OColumn {
    const instance = new OColumn();
    if (attr) {
      instance.attr = attr;
    }
    if (table) {
      instance.setDefaultProperties({
        orderable: this.orderable,
        resizable: this.resizable
      });
    }
    if (column) {
      instance.setColumnProperties(column);
    }
    return instance;
  }
}
