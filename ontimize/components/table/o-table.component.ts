import {
  Component, OnInit, OnDestroy, Inject, Injector, ElementRef, forwardRef,
  Optional, NgModule, ViewEncapsulation, ViewChild, EventEmitter, ContentChildren, QueryList, ViewChildren
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';
import { SelectionModel, SelectionChange } from '@angular/cdk/collections';
import { MatDialog, MatSort, MatTabGroup, MatTab, MatPaginatorIntl, MatPaginator, MatCheckboxChange, MatMenu, PageEvent, Sort, MatSortHeader } from '@angular/material';
import { DndModule } from 'ng2-dnd';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { InputConverter } from '../../decorators';

import { dataServiceFactory } from '../../services/data-service.provider';
import { OntimizeService, SnackBarService } from '../../services';
import { OFormComponent } from '../form/o-form.component';
import { OSharedModule } from '../../shared';

import { OServiceComponent } from '../o-service-component.class';
import {
  O_TABLE_FOOTER_COMPONENTS,
  OTablePaginatorComponent,
  OTableMatPaginatorIntl,
  OTableColumnAggregateComponent,
  OColumnAggregate
} from './extensions/footer/o-table-footer-components';

import { OTableDataSource } from './o-table.datasource';
import { OTableDao } from './o-table.dao';
import {
  O_TABLE_HEADER_COMPONENTS,
  OTableOptionComponent,
  OTableColumnsFilterComponent,
  OTableInsertableRowComponent,
  OTableQuickfilterComponent,
  OTableEditableRowComponent
} from './extensions/header/o-table-header-components';

import { OTableColumnComponent } from './column/o-table-column.component';
import { Util, Codes, ObservableWrapper } from '../../utils';

import {
  O_TABLE_DIALOGS,
  OTableExportConfiguration,
  OTableExportDialogComponent,
  OTableVisibleColumnsDialogComponent,
  OTableFilterByColumnDataDialogComponent,
  ITableFilterByColumnDataInterface
} from './extensions/dialog/o-table-dialog-components';

import {
  O_TABLE_CELL_RENDERERS,
  OTableCellRendererImageComponent
} from './column/cell-renderer/cell-renderer';

import { O_TABLE_CELL_EDITORS } from './column/cell-editor/cell-editor';

import {
  OTableColumnCalculatedComponent,
  OperatorFunction
} from './column/calculated/o-table-column-calculated.component';

import { OFormDataNavigation } from './../form/navigation/o-form.data.navigation.class';
import { OTableContextMenuComponent } from './extensions/contextmenu/o-table-context-menu.component';
import { OContextMenuComponent } from '../contextmenu/o-context-menu-components';
import { OContextMenuModule } from '../contextmenu/o-context-menu.module';
import { IOContextMenuContext } from '../contextmenu/o-context-menu.service';
import { ServiceUtils, ISQLOrder } from '../service.utils';
import { FilterExpressionUtils, IFilterExpression } from '../filter-expression.utils';

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

  // show-table-buttons-text [yes|no|true|false]: show text of header buttons. Default: yes.
  'showTableButtonsText: show-table-buttons-text',

  // select-all-checkbox [yes|no|true|false]: show selection check boxes. Default: no.
  'selectAllCheckbox: select-all-checkbox',

  // pagination-controls [yes|no|true|false]: show pagination controls. Default: yes.
  'paginationControls: pagination-controls',

  // filter [yes|no|true|false]: filter si case sensitive. Default: no.
  'filterCaseSensitivePvt: filter-case-sensitive',

  // fix-header [yes|no|true|false]: fixed header and footer when the content is greather than its own height. Default: no.
  'fixedHeader: fixed-header',

  // show-title [yes|no|true|false]: show the table title. Default: no.
  'showTitle: show-title',

  // edition-mode [none | inline | click | dblclick]: edition mode. Default none
  'editionMode: edition-mode',

  // selection-mode [none | simple | multiple ]: selection mode. Default multiple
  'selectionMode: selection-mode'
];

export const DEFAULT_OUTPUTS_O_TABLE = [
  'onClick',
  'onDoubleClick',
  'onRowSelected',
  'onRowDeselected',
  'onRowDeleted',
  'onTableDataLoaded',
  'onPaginatedTableDataLoaded'
];

export class OColumn {
  attr: string;
  name: string;
  title: string;
  type: string;
  className: string;
  orderable: boolean;
  _searchable: boolean;
  searching: boolean;
  visible: boolean;
  renderer: any;
  editor: any;
  editing: boolean;
  width: string;
  aggregate: OColumnAggregate;
  calculate: string | OperatorFunction;
  definition: OTableColumnComponent;
  hasTooltip: boolean;

  set searchable(val: boolean) {
    this._searchable = val;
    this.searching = val;
  }

  get searchable(): boolean {
    return this._searchable;
  }
}

export class OTableOptions {
  selectColumn: OColumn = new OColumn();
  columns: Array<OColumn> = [];
  visibleColumns: Array<any> = [];
  filter: boolean = true;
  filterCaseSensitive: boolean = false;
}

export type QuickFilterFunction = (filter: string) => IFilterExpression | Object;

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
  selector: 'o-table',
  templateUrl: './o-table.component.html',
  styleUrls: ['./o-table.component.scss'],
  providers: [
    { provide: OntimizeService, useFactory: dataServiceFactory, deps: [Injector] }
  ],
  inputs: DEFAULT_INPUTS_O_TABLE,
  outputs: DEFAULT_OUTPUTS_O_TABLE,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-table]': 'true',
    '[class.ontimize-table]': 'true',
    '[class.o-table-fixed]': 'fixedHeader',
    '(document:click)': 'handleDOMClick($event)'
  }
})
export class OTableComponent extends OServiceComponent implements OnInit, OnDestroy {

  public static DEFAULT_INPUTS_O_TABLE = DEFAULT_INPUTS_O_TABLE;
  public static DEFAULT_OUTPUTS_O_TABLE = DEFAULT_OUTPUTS_O_TABLE;

  public static NAME_COLUMN_SELECT = 'select';

  protected snackBarService: SnackBarService;

  public paginator: OTablePaginatorComponent;
  @ViewChild(MatPaginator) matpaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('columnFilterOption') columnFilterOption: OTableOptionComponent;
  @ContentChildren(OTableOptionComponent) tableOptions: QueryList<OTableOptionComponent>;
  @ViewChild('menu') matMenu: MatMenu;
  @ViewChild(OTableEditableRowComponent) oTableEditableRow: OTableEditableRowComponent;

  // only for insideTabBugWorkaround
  @ViewChildren(MatSortHeader) protected sortHeaders: QueryList<MatSortHeader>;

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
  showTableButtonsText: boolean = true;

  protected _oTableOptions: OTableOptions;

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

  @InputConverter()
  protected filterCaseSensitivePvt: boolean = false;
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

  public daoTable: OTableDao | null;
  public dataSource: OTableDataSource | null;
  protected visibleColumns: string;
  protected sortColumns: string;

  /*parsed inputs variables */
  protected visibleColArray: Array<string> = [];
  /*end of parsed inputs variables */

  protected tabGroupContainer: MatTabGroup;
  protected tabContainer: MatTab;
  tabGroupChangeSubscription: Subscription;

  protected pendingQuery: boolean = true;
  protected pendingQueryFilter = undefined;

  protected setStaticData: boolean = false;
  protected avoidQueryColumns: Array<any> = [];
  protected asyncLoadColumns: Array<any> = [];
  protected asyncLoadSubscriptions: Object = {};

  protected querySubscription: Subscription;
  protected finishQuerySubscription: boolean = false;

  public onClick: EventEmitter<any> = new EventEmitter();
  public onDoubleClick: EventEmitter<any> = new EventEmitter();
  public onRowSelected: EventEmitter<any> = new EventEmitter();
  public onRowDeselected: EventEmitter<any> = new EventEmitter();
  public onRowDeleted: EventEmitter<any> = new EventEmitter();
  public onTableDataLoaded: EventEmitter<any> = new EventEmitter();
  public onPaginatedTableDataLoaded: EventEmitter<any> = new EventEmitter();
  public onReinitialize: EventEmitter<any> = new EventEmitter();

  selection = new SelectionModel<Element>(true, []);
  protected selectionChangeSubscription: Subscription;

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

  protected sortColArray: Array<ISQLOrder> = [];
  protected currentPage: number = 0;
  public oTableQuickFilterComponent: OTableQuickfilterComponent;

  protected sortSubscription: Subscription;
  quickFilterCallback: QuickFilterFunction;

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
  }

  ngOnInit() {
    this.initialize();
  }

  ngAfterViewInit() {
    this.afterViewInit();
    this.initTableAfterViewInit();
  }

  ngOnDestroy() {
    this.destroy();
  }

  /**
   * Method what initialize vars and configuration
   */
  initialize(): any {
    // Initialize table options
    this._oTableOptions = new OTableOptions();

    super.initialize();

    // Initialize params of the table
    this.initializeParams();

    // Add column checkbox
    // 1. create object ocolumn
    // 2. not add visiblesColumns
    let checkboxColumn = new OColumn();
    checkboxColumn.name = OTableComponent.NAME_COLUMN_SELECT;
    checkboxColumn.title = '';
    checkboxColumn.visible = false;
    this._oTableOptions.selectColumn = checkboxColumn;

    // Initializing row selection listener
    this.selectionChangeSubscription = this.selection.onChange.subscribe((selectionData: SelectionChange<any>) => {
      if (selectionData && selectionData.added.length > 0) {
        ObservableWrapper.callEmit(this.onRowSelected, selectionData.added);
      }
      if (selectionData && selectionData.removed.length > 0) {
        ObservableWrapper.callEmit(this.onRowDeselected, selectionData.removed);
      }
    });
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
    if (this.elRef) {
      this.elRef.nativeElement.removeAttribute('title');
    }

    this.setDatasource();

    this.registerSortListener();

    this.showFilterByColumnIcon = this.getStoredColumnsFilters().length > 0;
    if (this.columnFilterOption) {
      this.columnFilterOption.active = this.showFilterByColumnIcon;
    }
    if (this.oTableQuickFilterComponent) {
      this.oTableQuickFilterComponent.setValue(this.state['filter']);
      const storedColumnsData = this.state['oColumns'] || [];
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
    if (this.queryOnInit) {
      this.queryData(this.parentItem);
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
    let dataToStore = {
      'filter': this.oTableQuickFilterComponent ? this.oTableQuickFilterComponent.value : '',
      'query-rows': this.matpaginator ? this.matpaginator.pageSize : ''
    };
    if (this.sortColArray.length > 0 && this.sort.active !== undefined) {
      dataToStore['sort-columns'] = this.sort.active + ':' + this.sort.direction;
    }
    if (this.oTableColumnsFilterComponent) {
      dataToStore['column-value-filters'] = this.dataSource.getColumnValueFilters();
    }
    dataToStore['filter-case-sensitive'] = this.oTableOptions.filterCaseSensitive;
    let oColumnsData = [];
    this.oTableOptions.columns.forEach((oCol: OColumn) => {
      let colData = {
        attr: oCol.attr
      };
      colData['searchable'] = oCol.searchable;
      colData['searching'] = oCol.searching;
      oColumnsData.push(colData);
    });
    dataToStore['oColumns'] = oColumnsData;
    return dataToStore;
  }

  registerQuickFilter(arg: OTableQuickfilterComponent) {
    this.oTableQuickFilterComponent = arg;
    this.oTableQuickFilterComponent.setValue(this.state['filter']);
  }

  registerPagination(value: OTablePaginatorComponent) {
    this.paginationControls = true;
    this.paginator = value;
    //this.paginator.pageSize = this.rowQuery || this.paginator.pageSize;
  }

  registerContextMenu(value: OContextMenuComponent): void {
    this.tableContextMenu = value;
    const self = this;
    this.tableContextMenu.onShow.subscribe((params: IOContextMenuContext) => {
      if (params.data && !self.selection.isSelected(params.data)) {
        self.selection.clear();
        self.selection.select(params.data);
      }
    });
  }

  /**
   * Store all columns and properties in var columnsArray
   * @param column
   */
  registerColumn(column: any) {
    let colDef: OColumn = new OColumn();
    colDef.type = 'string';
    colDef.className = 'o-column-' + (colDef.type) + ' ';
    colDef.orderable = true;
    colDef.searchable = true;
    colDef.searching = true;
    colDef.width = '';

    if (!Util.isDefined(column.attr)) {
      // column without 'attr' should contain only renderers that do not depend on cell data, but row data (e.g. actions)
      colDef.name = column;
      colDef.attr = column;
      colDef.title = column;
    } else {
      colDef.definition = column;
      // columns with 'attr' are linked to service data
      colDef.attr = column.attr;
      colDef.name = column.attr;
      colDef.title = Util.isDefined(column.title) ? column.title : column.attr;
      if (column.width !== '') {
        colDef.width = column.width;
      }
      if (Util.isDefined(column.orderable)) {
        colDef.orderable = column.orderable;
      }
      if (Util.isDefined(column.searchable)) {
        colDef.searchable = column.searchable;
      }
      if (Util.isDefined(column.renderer)) {
        colDef.renderer = column.renderer;
      }
      if (Util.isDefined(column.editor)) {
        colDef.editor = column.editor;
      }
      if (Util.isDefined(column.type)) {
        colDef.type = column.type;
        colDef.className = 'o-column-' + (colDef.type) + ' ';
      }
      if (Util.isDefined(column.class)) {
        colDef.className = Util.isDefined(column.className) ? (column.className + ' ' + column.class) : column.class;
      }
      if (typeof column.operation !== 'undefined' || typeof column.functionOperation !== 'undefined') {
        colDef.calculate = column.operation ? column.operation : column.functionOperation;
      }
      if (Util.isDefined(column.tooltip)) {
        colDef.hasTooltip = column.tooltip;
      }
    }
    colDef.visible = (this.visibleColArray.indexOf(colDef.attr) !== -1);
    if (column && (column.asyncLoad || column.type === 'action')) {
      this.avoidQueryColumns.push(column.attr);
      if (column.asyncLoad) {
        this.asyncLoadColumns.push(column.attr);
      }
    }
    //find column definition by name
    if (Util.isDefined(column.attr)) {
      const alreadyExisting = this.getOColumn(column.attr);
      if (alreadyExisting !== undefined) {
        const replacingIndex = this._oTableOptions.columns.indexOf(alreadyExisting);
        this._oTableOptions.columns[replacingIndex] = colDef;
      } else {
        this._oTableOptions.columns.push(colDef);
      }
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

  parseSortColumns() {
    let sortColumnsParam = this.state['sort-columns'] || this.sortColumns;
    this.sortColArray = ServiceUtils.parseSortColumns(sortColumnsParam);
    // ensuring column existence
    for (let i = this.sortColArray.length - 1; i >= 0; i--) {
      const colName = this.sortColArray[i].columnName;
      const oCol = this.getOColumn(colName);
      if (!Util.isDefined(oCol)) {
        this.sortColArray.splice(i, 1);
      }
    }
    this.setMatSort();
  }

  setMatSort() {
    //set values of sort-columns to matsort
    if (Util.isDefined(this._oTableOptions.columns) && (this.sortColArray.length > 0)) {
      const temp = this.sortColArray[0];
      this.sort.active = temp.columnName;
      const sortDirection: any = temp.ascendent ? Codes.ASC_SORT : Codes.DESC_SORT;
      this.sort.direction = sortDirection;
    }
  }

  initializeParams(): void {
    // If visible-columns is not present then visible-columns is all columns
    if (!this.visibleColumns) {
      this.visibleColumns = this.columns;
    }
    this.visibleColArray = Util.parseArray(this.visibleColumns, true);
    this._oTableOptions.visibleColumns = this.visibleColArray;

    if (this.colArray.length) {
      this.colArray.map(x => this.registerColumn(x));
    }

    this.parseSortColumns();

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

    // Initialize quickFilter
    this._oTableOptions.filter = this.quickFilter;
    this.filterCaseSensitive = this.state.hasOwnProperty('filter-case-sensitive') ? this.state['filter-case-sensitive'] : this.filterCaseSensitive;

    // Initialize paginator
    if (!this.paginator && this.paginationControls) {
      this.paginator = new OTablePaginatorComponent(this.injector, this);
      this.paginator.pageSize = this.queryRows;
    }

    if (this.tabGroupContainer && this.tabContainer) {
      this.registerTabListener();
    }
  }

  registerTabListener() {
    // When table is contained into tab component, it is necessary to init
    // table component when attached to DOM.
    const self = this;
    this.tabGroupChangeSubscription = this.tabGroupContainer.selectedTabChange.subscribe((evt) => {
      const interval = setInterval(function () { timerCallback(evt.tab); }, 100);
      function timerCallback(tab: MatTab) {
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
      }
    });
  }

  protected insideTabBugWorkaround() {
    const active = this.sort.active;
    this.sort.active = '';
    this.sortHeaders.forEach(sortH => {
      if (sortH.id !== active) {
        sortH._viewState.toState = 'active';
        sortH._intl.changes.next();
      } else {
        sortH._setAnimationTransitionState({
          fromState: this.sort.direction,
          toState: 'active'
        });
        sortH._showIndicatorHint = false;
      }
    });
    this.setMatSort();
  }

  registerSortListener() {
    const self = this;
    this.sortSubscription = this.sort.sortChange.subscribe((sort: Sort) => {
      self.sortColArray = [];
      if (sort.direction !== '') {
        self.sortColArray.push({
          columnName: sort.active,
          ascendent: sort.direction === Codes.ASC_SORT
        });
      }
      if (self.pageable) {
        self.reloadData();
      }
    });
  }

  setDatasource() {
    this.dataSource = new OTableDataSource(this);
    if (this.daoTable) {
      this.dataSource.resultsLength = this.daoTable.data.length;
    }
  }

  /**
   * This method manages the call to the service
   * @param parentItem it is defined if its called from a form
   * @param ovrrArgs
   */
  queryData(parentItem: any = undefined, ovrrArgs?: any) {
    //if exit tab and not is active then waiting call queryData
    if (this.tabContainer && !this.tabContainer.isActive) {
      this.pendingQuery = true;
      this.pendingQueryFilter = parentItem;
      return;
    }
    this.pendingQuery = false;
    this.pendingQueryFilter = undefined;
    super.queryData(parentItem, ovrrArgs);
  }

  getComponentFilter(existingFilter: any = {}): any {
    let filter = existingFilter;
    let quickFilterExpr = (this.pageable && this.oTableQuickFilterComponent) ? this.oTableQuickFilterComponent.filterExpression : undefined;
    if (quickFilterExpr) {
      const parentItemExpr = FilterExpressionUtils.buildExpressionFromObject(filter);
      const filterExpr = FilterExpressionUtils.buildComplexExpression(parentItemExpr, quickFilterExpr, FilterExpressionUtils.OP_AND);
      filter = {};
      filter[FilterExpressionUtils.FILTER_EXPRESSION_KEY] = filterExpr;
    }
    return filter;
  }

  updatePaginationInfo(queryRes: any) {
    super.updatePaginationInfo(queryRes);
  }

  protected setData(data: any, sqlTypes: any) {
    this.daoTable.sqlTypesChange.next(sqlTypes);
    this.daoTable.dataChange.next(data);
    this.daoTable.isLoadingResults = false;
    if (this.pageable) {
      ObservableWrapper.callEmit(this.onPaginatedTableDataLoaded, data);
    }
    ObservableWrapper.callEmit(this.onTableDataLoaded, this.daoTable.data);
  }

  showDialogError(error: string, errorOptional?: string) {
    if (Util.isDefined(error) && !Util.isObject(error)) {
      this.dialogService.alert('ERROR', error);
    } else {
      this.dialogService.alert('ERROR', errorOptional);
    }
  }

  getAttributesValuesToQuery(): Object {
    let columns = [];
    this.colArray.forEach(col => {
      if (this.avoidQueryColumns.indexOf(col) === -1) {
        columns.push(col);
      }
    });
    return columns;
  }

  getQueryArguments(filter: Object, ovrrArgs?: any): Array<any> {
    let queryArguments = super.getQueryArguments(filter, ovrrArgs);
    queryArguments[1] = this.getAttributesValuesToQuery();
    if (this.pageable) {
      queryArguments[5] = this.paginator.isShowingAllRows(queryArguments[5]) ? this.state.totalQueryRecordsNumber : queryArguments[5];
      queryArguments[6] = this.sortColArray;
    }
    return queryArguments;
  }

  onExportButtonClicked() {
    let exportCnfg: OTableExportConfiguration = new OTableExportConfiguration();
    // Table data
    exportCnfg.data = this.getRenderedValue();
    // get column's attr whose renderer is OTableCellRendererImageComponent
    let colsNotIncluded: string[] = this._oTableOptions.columns.filter(c => void 0 !== c.renderer && c.renderer instanceof OTableCellRendererImageComponent).map(c => c.attr);
    colsNotIncluded.forEach(attr => exportCnfg.data.forEach(row => delete row[attr]));
    // Table columns
    exportCnfg.columns = this._oTableOptions.visibleColumns.filter(c => colsNotIncluded.indexOf(c) === -1);
    // Table column names
    let tableColumnNames = {};
    this._oTableOptions.visibleColumns.filter(c => colsNotIncluded.indexOf(c) === -1).map(c => tableColumnNames[c] = this.translateService.get(c));
    exportCnfg.columnNames = tableColumnNames;
    // Table column sqlTypes
    exportCnfg.sqlTypes = this.getSqlTypes();
    // Table service, needed for configuring ontimize export service with table service configuration
    exportCnfg.service = this.service;

    let dialogRef = this.dialog.open(OTableExportDialogComponent, {
      data: exportCnfg,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => result ? this.snackBarService.open('MESSAGES.SUCCESS_EXPORT_TABLE_DATA', { icon: 'check_circle' }) : null);
  }

  onChangeColumnsVisibilityClicked() {
    let columnsArray = this.visibleColArray;
    this._oTableOptions.columns.forEach(col => {
      if (col.definition !== undefined && columnsArray.indexOf(col.attr) === -1) {
        columnsArray.push(col.attr);
      }
    });
    let dialogRef = this.dialog.open(OTableVisibleColumnsDialogComponent, {
      data: {
        columnArray: columnsArray,
        columnsData: this._oTableOptions.columns
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.visibleColArray = dialogRef.componentInstance.getVisibleColumns();
        this._oTableOptions.visibleColumns = this.visibleColArray;
        this._oTableOptions.columns = dialogRef.componentInstance.getColumnsData();
        if (this.oTableEditableRow) {
          this.oTableEditableRow.cd.detectChanges();
        }
      }
    });
  }

  onMatTableContentChanged() {
    console.log('onMatTableContentChanged');
  }

  add() {
    super.insertDetail();
  }

  remove(clearSelectedItems: boolean = false) {
    if ((this.keysArray.length > 0) && !this.selection.isEmpty()) {
      this.dialogService.confirm('CONFIRM', 'MESSAGES.CONFIRM_DELETE').then(res => {
        if (res === true) {
          if (this.dataService && (this.deleteMethod in this.dataService) && this.entity) {
            let filters = ServiceUtils.getArrayProperties(this.selection.selected, this.keysArray);
            this.daoTable.removeQuery(filters).subscribe(res => {
              console.log('[OTable.remove]: response', res);
              ObservableWrapper.callEmit(this.onRowDeleted, this.selection.selected);
            }, error => {
              this.showDialogError(error, 'MESSAGES.ERROR_DELETE');
              console.log('[OTable.remove]: error', error);
            }, () => {
              console.log('[OTable.remove]: success');
              this.reloadData();
            });
          } else {
            // remove local
            this.deleteLocalItems();
          }
        } else if (clearSelectedItems) {
          this.clearSelection();
        }
      }
      );
    }
  }

  refresh() {
    this.reloadData();
  }

  reloadPaginatedDataFromStart(val: any) {
    if (this.pageable) {
      this.clearSelection();
      this.finishQuerySubscription = false;
      this.pendingQuery = true;

      let queryArgs = {
        offset: 0,
        length: this.queryRows
      };
      this.queryData(this.parentItem, queryArgs);
    }
  }

  reloadData() {
    this.clearSelection();
    this.finishQuerySubscription = false;
    this.pendingQuery = true;

    let queryArgs;
    if (this.pageable) {
      queryArgs = {
        offset: this.currentPage * this.queryRows,
        length: this.queryRows
      };
    }
    this.queryData(this.parentItem, queryArgs);
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

  private saveDataNavigationInLocalStorage() {
    //save data of the table in navigation-data in the localstorage
    let navigationDataStorage = new OFormDataNavigation(this.injector);
    navigationDataStorage.setDataToStore(this.getKeysValues());
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
    const editingColumn = this.oTableOptions.columns.filter(item => item.editing);
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
    column.editing = false;
    this.editingCell = undefined;
    if (saveChanges && this.editingRow !== undefined) {
      Object.assign(this.editingRow, data);
    }
    this.editingRow = undefined;
  }

  protected getKeysValues(): any[] {
    let data = this.getAllValues();
    const _self = this;
    return data.map(function (row, i, a) {
      let obj = {};
      _self.keysArray.map(function (key, i, a) {
        if (row[key] !== undefined) {
          obj[key] = row[key];
        }
      });

      return obj;
    });
  }

  onShowsSelects(event?) {
    this._oTableOptions.selectColumn.visible = !this._oTableOptions.selectColumn.visible;
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
    const numRows = this.dataSource.renderedData.length;
    return numSelected === numRows;
  }

  masterToggle(event: MatCheckboxChange) {
    event.checked ? this.dataSource.renderedData.forEach(row => this.selection.select(row)) : this.clearSelection();
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
      let intersection = self.asyncLoadColumns.filter(c => self._oTableOptions.visibleColumns.indexOf(c) !== -1);
      if (self.asyncLoadColumns.length && intersection.length > 0 && !this.finishQuerySubscription) {
        self.queryRowAsyncData(index, item);
        if (index === (this.daoTable.data.length - 1)) {
          self.finishQuerySubscription = true;
        }
        return item;
      } else {
        return item;
      }
    };
  }

  queryRowAsyncData(rowIndex: number, rowData: any) {
    let kv = ServiceUtils.getObjectProperties(rowData, this.keysArray);
    // repeating checking of visible column
    let av = this.asyncLoadColumns.filter(c => this._oTableOptions.visibleColumns.indexOf(c) !== -1);
    if (av.length === 0) {
      //skipping query if there are not visible asyncron columns
      return;
    }
    const columnQueryArgs = [kv, av, this.entity, undefined, undefined, undefined, undefined];
    let queryMethodName = this.pageable ? this.paginatedQueryMethod : this.queryMethod;
    if (this.dataService && (queryMethodName in this.dataService) && this.entity) {
      //const self = this;
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
          this.daoTable.setAsincronColumn(data, rowData);
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
    return this.dataSource.sqlTypes;
  }

  setOTableColumnsFilter(tableColumnsFilter: OTableColumnsFilterComponent) {
    this.oTableColumnsFilterComponent = tableColumnsFilter;
  }

  getStoredColumnsFilters() {
    return this.state['column-value-filters'] || [];
  }

  onFilterByColumnClicked() {
    if (this.showFilterByColumnIcon && this.dataSource.isColumnValueFilterActive()) {
      const self = this;
      this.dialogService.confirm('CONFIRM', 'MESSAGES.CONFIRM_DISCARD_FILTER_BY_COLUMN').then(res => {
        if (res) {
          self.dataSource.clearColumnFilters();
        }
        self.showFilterByColumnIcon = !res;
      });
    } else {
      this.showFilterByColumnIcon = !this.showFilterByColumnIcon;
    }
  }

  isColumnFilterable(column: OColumn): boolean {
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
    const columnDataArray: ITableFilterByColumnDataInterface[] = this.dataSource.getColumnDataToFilter(column, this);
    let dialogRef = this.dialog.open(OTableFilterByColumnDataDialogComponent, {
      data: {
        previousFilter: this.dataSource.getColumnValueFilterByAttr(column.attr),
        column: column,
        columnDataArray: columnDataArray,
        preloadValues: this.oTableColumnsFilterComponent.preloadValues
      },
      disableClose: true,
      panelClass: 'cdk-overlay-pane-custom'
    });
    const self = this;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let columnValueFilter = dialogRef.componentInstance.getColumnValuesFilter();
        self.dataSource.addColumnFilter(columnValueFilter);
      }
    });
  }

  get showTableMenuButton(): boolean {
    const staticOpt = this.selectAllCheckbox || this.exportButton || this.columnsVisibilityButton || this.oTableColumnsFilterComponent !== undefined;
    return staticOpt || this.tableOptions.length > 0;
  }

  setOTableInsertableRow(tableInsertableRow: OTableInsertableRowComponent) {
    this.oTableInsertableRowComponent = tableInsertableRow;
    this.showFirstInsertableRow = this.oTableInsertableRowComponent.isFirstRow();
    this.showLastInsertableRow = !this.showFirstInsertableRow;
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

  usePlainRender(column: OColumn, row: any): boolean {
    return !column.renderer && (!column.editor || (!column.editing || !this.selection.isSelected(row)));
  }

  useCellRenderer(column: OColumn, row: any): boolean {
    return column.renderer && (!column.editing || column.editing && !this.selection.isSelected(row));
  }

  useCellEditor(column: OColumn, row: any): boolean {
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
    if (!this.pageable) {
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

    const queryArgs = {
      offset: newStartRecord,
      length: queryLength
    };
    this.finishQuerySubscription = false;
    this.queryData(this.parentItem, queryArgs);
  }

  getOColumn(attr: string): OColumn {
    return this._oTableOptions ? this._oTableOptions.columns.find(item => item.name === attr) : undefined;
  }

  insertRecord(recordData: any): Observable<any> {
    return this.daoTable.insertQuery(recordData);
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

}

@NgModule({
  declarations: [
    OTableComponent,
    OTableColumnComponent,
    OTableColumnCalculatedComponent,
    OTableContextMenuComponent,
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
    DndModule.forRoot(),
    OContextMenuModule
  ],
  exports: [
    OTableComponent,
    OTableColumnComponent,
    CdkTableModule,
    OTableColumnCalculatedComponent,
    OTableContextMenuComponent,
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
  }]
})
export class OTableModule {
}
