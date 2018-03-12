import {
  Component, OnInit, OnDestroy, Inject, Injector, ElementRef, forwardRef,
  Optional, NgModule, ViewEncapsulation, ViewChild, EventEmitter, ContentChildren, QueryList
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';
import { SelectionModel, SelectionChange } from '@angular/cdk/collections';
import { MdDialog, MdSort, MdTabGroup, MdTab, MdPaginatorIntl, MdPaginator, MdCheckboxChange, MdMenu, PageEvent, Sort } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { DragulaModule } from 'ng2-dragula/ng2-dragula';

import { InputConverter } from '../../decorators';

import { dataServiceFactory } from '../../services/data-service.provider';
import { OntimizeService, SnackBarService } from '../../services';
import { OFormComponent } from '../form/o-form.component';
import { OSharedModule } from '../../shared';
import { OServiceComponent } from '../o-service-component.class';

import {
  O_TABLE_FOOTER_COMPONENTS,
  OTablePaginatorComponent,
  OTableMdPaginatorIntl,
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
  OTableQuickfilterComponent
} from './extensions/header/o-table-header-components';

import { OTableColumnComponent } from './column/o-table-column.component';
import { Util } from '../../util/util';
import { ObservableWrapper } from '../../util/async';

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
import { ServiceUtils } from '../service.utils';
import { FilterExpressionUtils, IFilterExpression } from '../filter-expression.utils';

export const DEFAULT_INPUTS_O_TABLE = [
  ...OServiceComponent.DEFAULT_INPUTS_O_SERVICE_COMPONENT,

  // insert-method [string]: name of the service method to perform inserts. Default: insert.
  'insertMethod: insert-method',

  // update-method [string]: name of the service method to perform updates. Default: update.
  'updateMethod: update-method',

  // visible-columns [string]: visible columns, separated by ';'. Default: no value.
  'visibleColumns: visible-columns',

  // editable-columns [string]: columns that can be edited directly over the table, separated by ';'. Default: no value.
  'editableColumns: editable-columns',

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

  // show-table-buttons-text [string][yes|no|true|false]: show text of header buttons
  'showTableButtonsText: show-table-buttons-text',

  // select-all-checkbox [string][yes|no|true|false]:
  'selectAllCheckbox: select-all-checkbox',

  // pagination-controls [string][yes|no|true|false]
  'paginationControls: pagination-controls',

  //filter [string][yes|no|true|false]
  'filterCaseSensitivePvt: filter-case-sensitive',

  //fix-header [string][yes|no|true|false]: fixed header and footer when the content is greather than its own height
  'fixedHeader: fixed-header',

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
  searchable: boolean;
  visible: boolean;
  renderer: any;
  editor: any;
  editing: boolean;
  width: string;
  aggregate: OColumnAggregate;
  calculate: string | OperatorFunction;
  definition: OTableColumnComponent;
}

export class OTableOptions {
  selectColumn: OColumn = new OColumn();
  columns: Array<OColumn> = [];
  visibleColumns: Array<any> = [];
  filter: boolean = true;
  filterCaseSensitive: boolean = false;
}

export type QuickFilterFunction = (filter: string) => IFilterExpression | Object;

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

  protected snackBarService: SnackBarService;

  constructor(
    injector: Injector,
    elRef: ElementRef,
    protected dialog: MdDialog,
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent
  ) {
    super(injector, elRef, form);
    try {
      this.mdTabGroupContainer = this.injector.get(MdTabGroup);
      this.mdTabContainer = this.injector.get(MdTab);
    } catch (error) {
      // Do nothing due to not always is contained on tab.
    }
    this.snackBarService = this.injector.get(SnackBarService);
  }

  public paginator: OTablePaginatorComponent;
  @ViewChild(MdPaginator) mdpaginator: MdPaginator;
  @ViewChild(MdSort) sort: MdSort;
  @ViewChild('columnFilterOption') columnFilterOption: OTableOptionComponent;
  @ContentChildren(OTableOptionComponent) tableOptions: QueryList<OTableOptionComponent>;
  @ViewChild('menu') mdMenu: MdMenu;

  public tableContextMenu: OContextMenuComponent;

  public static NAME_COLUMN_SELECT = 'select';
  public static TYPE_SEPARATOR = ':';
  public static VALUES_SEPARATOR = '=';
  public static TYPE_ASC_NAME = 'asc';
  public static TYPE_DESC_NAME = 'desc';
  public static DEFAULT_INSERT_METHOD = 'insert';
  public static DEFAULT_UPDATE_METHOD = 'update';

  @InputConverter()
  selectAllCheckbox: boolean = false;
  @InputConverter()
  exportButton: boolean = true;
  // @InputConverter()
  // columnsResizeButton: boolean = true;
  // @InputConverter()
  // columnsGroupButton: boolean = true;
  @InputConverter()
  pageable: boolean = true;
  @InputConverter()
  columnsVisibilityButton: boolean = true;
  @InputConverter()
  showTableButtonsText: boolean = true;

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
  protected editionMode: 'none' | 'inline' | 'click' | 'doubleclick' = 'none';
  protected selectionMode: 'none' | 'single' | 'multiple' = 'multiple';

  public daoTable: OTableDao | null;
  public dataSource: OTableDataSource | null;
  protected insertMethod: string;
  protected updateMethod: string;
  protected visibleColumns: string;
  protected sortColumns: string;

  /*parsed inputs variables */
  protected visibleColArray: Array<string> = [];

  /*end of parsed inputs variables */

  protected mdTabGroupContainer: MdTabGroup;
  protected mdTabContainer: MdTab;
  protected mdTabGroupChangeSubscription: Subscription;

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

  protected selection = new SelectionModel<Element>(true, []);
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

  protected sortColArray: Array<any> = [];
  protected currentPage: number = 0;
  public oTableQuickFilterComponent: OTableQuickfilterComponent;

  protected sortSubscription: Subscription;
  quickFilterCallback: QuickFilterFunction;

  ngOnInit() {
    this.initialize();
  }

  ngAfterViewInit() {
    this.afterViewInit();
    this.initTableAfterViewInit();
    if (this.elRef) {
      this.elRef.nativeElement.removeAttribute('title');
    }
  }

  ngOnDestroy() {
    this.destroy();
  }

  /**
   * Method what initialize vars and configuration
   */
  initialize(): any {
    super.initialize();
    // get previous position
    this.state = this.localStorageService.getComponentStorage(this);

    // initialize params of the table
    this.initializeParams();
  }

  protected initTableAfterViewInit() {
    this.setDatasource();

    if (this.pageable) {
      this.sortSubscription = this.sort.mdSortChange.subscribe((sort: Sort) => {
        this.sortColArray = [];
        if (sort.direction !== '') {
          this.sortColArray.push({
            column: sort.active,
            ascendent: sort.direction === OTableComponent.TYPE_ASC_NAME
          });
        }
        this.reloadData();
      });
    }

    this.showFilterByColumnIcon = this.getStoredColumnsFilters().length > 0;
    if (this.columnFilterOption) {
      this.columnFilterOption.active = this.showFilterByColumnIcon;
    }
    if (this.queryOnInit) {
      this.queryData(this.parentItem);
    }
  }

  destroy() {
    super.destroy();
    if (this.mdTabGroupChangeSubscription) {
      this.mdTabGroupChangeSubscription.unsubscribe();
    }
    if (this.selectionChangeSubscription) {
      this.selectionChangeSubscription.unsubscribe();
    }
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
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
    var dataToStore = {
      'filter': this.oTableQuickFilterComponent ? this.oTableQuickFilterComponent.value : '',
      'query-rows': this.mdpaginator ? this.mdpaginator.pageSize : ''
    };
    if (this.sortColArray.length > 0 && this.sort.active !== undefined) {
      dataToStore['sort-columns'] = this.sort.active + ':' + this.sort.direction;
    }
    if (this.oTableColumnsFilterComponent) {
      dataToStore['column-value-filters'] = this.dataSource.getColumnValueFilters();
    }
    return dataToStore;
  }

  registerQuickFilter(arg: OTableQuickfilterComponent) {
    this.oTableQuickFilterComponent = arg;
    this.oTableQuickFilterComponent.value = this.state.filter;
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
    colDef.width = '';

    if (typeof (column.attr) === 'undefined') {
      // column without 'attr' should contain only renderers that do not depend on cell data, but row data (e.g. actions)
      colDef.name = column;
      colDef.attr = column;
      colDef.title = column;
    } else {
      colDef.definition = column;
      // columns with 'attr' are linked to service data
      colDef.attr = column.attr;
      colDef.name = column.attr;
      colDef.title = column.title;
      if (column.width !== '') {
        colDef.width = column.width;
      }
      if (typeof column.orderable !== 'undefined') {
        colDef.orderable = column.orderable;
      }
      if (typeof column.searchable !== 'undefined') {
        colDef.searchable = column.searchable;
      }
      if (typeof column.renderer !== 'undefined') {
        colDef.renderer = column.renderer;
      }
      if (typeof column.editor !== 'undefined') {
        colDef.editor = column.editor;
      }
      if (typeof column.type !== 'undefined') {
        colDef.type = column.type;
        colDef.className = 'o-column-' + (colDef.type) + ' ';
      }
      if (typeof column.class !== 'undefined') {
        colDef.className = (typeof column.className !== 'undefined') ? (column.className + ' ' + column.class) : column.class;
      }
      if (typeof column.operation !== 'undefined' || typeof column.functionOperation !== 'undefined') {
        colDef.calculate = column.operation ? column.operation : column.functionOperation;
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
    if (typeof (column.attr) !== 'undefined') {
      const alreadyExisting = this.getOColumn(column.attr);
      if (alreadyExisting !== undefined) {
        var replacingIndex = this._oTableOptions.columns.indexOf(alreadyExisting);
        this._oTableOptions.columns[replacingIndex] = colDef;
      } else {
        this._oTableOptions.columns.push(colDef);
      }
    } else {
      this._oTableOptions.columns.push(colDef);
    }
    /*
    if(this.staticData && this.setStaticData){
      this.setDatasource();
      this.daoTable.setDataArray(this.staticData);
    }*/

  }

  registerColumnAggregate(column: OColumnAggregate) {
    this.showTotals = true;
    const alreadyExisting = this.getOColumn(column.attr);
    if (alreadyExisting !== undefined) {
      var replacingIndex = this._oTableOptions.columns.indexOf(alreadyExisting);
      this._oTableOptions.columns[replacingIndex].aggregate = column;
    }

  }

  parseSortColumns() {
    this.sortColArray = [];
    let sortColumnsParam = this.state['sort-columns'] || this.sortColumns;
    if (sortColumnsParam) {
      let cols = Util.parseArray(sortColumnsParam);
      cols.forEach((col) => {
        let colDef = col.split(OTableComponent.TYPE_SEPARATOR);
        if (colDef.length > 0) {
          let colName = colDef[0];
          let oCol = this.getOColumn(colName);
          if (oCol !== undefined) {
            const colSort = colDef[1] || OTableComponent.TYPE_ASC_NAME;
            this.sortColArray.push({
              column: colName,
              ascendent: colSort === OTableComponent.TYPE_ASC_NAME
            });
          }
        }
      });

      //set values of sort-columns to mdsort
      if ((typeof (this._oTableOptions.columns) !== 'undefined') && (this.sortColArray.length > 0)) {
        let temp = this.sortColArray[0];
        this.sort.active = temp.column;
        this.sort.direction = temp.ascendent ? 'asc' : 'desc';
      }
    }
  }

  /**
   * get/set parametres to component
   */
  initializeParams() {
    //add column checkbox
    //1. create object ocolumn
    //2. not add visiblesColumns
    let checkboxColumn = new OColumn();
    checkboxColumn.name = OTableComponent.NAME_COLUMN_SELECT;
    checkboxColumn.title = '';
    checkboxColumn.visible = false;
    this._oTableOptions.selectColumn = checkboxColumn;

    // initializing row selection listener
    this.selectionChangeSubscription = this.selection.onChange.subscribe((selectionData: SelectionChange<any>) => {
      if (selectionData && selectionData.added.length > 0) {
        ObservableWrapper.callEmit(this.onRowSelected, selectionData.added);
      }
      if (selectionData && selectionData.removed.length > 0) {
        ObservableWrapper.callEmit(this.onRowDeselected, selectionData.removed);
      }
    });

    // if not declare visible-columns then visible-columns is all columns
    if (!this.visibleColumns) {
      this.visibleColumns = this.columns;
    }
    this.visibleColArray = Util.parseArray(this.visibleColumns, true);
    this._oTableOptions.visibleColumns = this.visibleColArray;

    if (this.colArray.length) {
      this.colArray.map(x => this.registerColumn(x));
    }

    if (!this.insertMethod) {
      this.insertMethod = OTableComponent.DEFAULT_INSERT_METHOD;
    }
    if (!this.updateMethod) {
      this.updateMethod = OTableComponent.DEFAULT_UPDATE_METHOD;
    }

    if (this.state['query-rows'] !== undefined) {
      this.queryRows = this.state['query-rows'];
    }

    // Initializing quickFilter
    this._oTableOptions.filter = this.quickFilter;
    this._oTableOptions.filterCaseSensitive = this.filterCaseSensitive;

    this.parseSortColumns();

    if (this.mdTabGroupContainer && this.mdTabContainer) {
      /*
      * When table is contained into tab component, it is necessary to init
      * table component when attached to DOM.
      */
      var self = this;
      this.mdTabGroupChangeSubscription = this.mdTabGroupContainer.selectChange.subscribe((evt) => {
        var interval = setInterval(function () { timerCallback(evt.tab); }, 100);
        function timerCallback(tab: MdTab) {
          if (tab && tab.content.isAttached) {
            clearInterval(interval);
            if (tab === self.mdTabContainer) {
              if (self.pendingQuery) {
                self.queryData(self.pendingQueryFilter);
              }
            }
          }
        }

      });
    }
    let queryMethodName = this.pageable ? this.paginatedQueryMethod : this.queryMethod;
    const methods = {
      query: queryMethodName,
      update: this.updateMethod,
      delete: this.deleteMethod,
      insert: this.insertMethod
    };
    this.daoTable = new OTableDao(this.dataService, this.entity, methods);

    if (this.staticData) {
      this.setDataArray(this.staticData);
    }

    if (!this.paginator && this.paginationControls) {
      this.paginator = new OTablePaginatorComponent(this.injector, this);
      this.paginator.pageSize = this.queryRows;
    }
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
    if (this.mdTabContainer && !this.mdTabContainer.isActive) {
      this.pendingQuery = true;
      this.pendingQueryFilter = parentItem;
      return;
    }

    let queryMethodName = this.pageable ? this.paginatedQueryMethod : this.queryMethod;
    if (!this.dataService || !(queryMethodName in this.dataService) || !this.entity) {
      return;
    }

    this.pendingQuery = false;
    this.pendingQueryFilter = undefined;

    parentItem = ServiceUtils.getParentItemFromForm(parentItem, this._pKeysEquiv, this.form);

    if ((Object.keys(this._pKeysEquiv).length > 0) && parentItem === undefined) {
      this.setData([], []);
    } else {
      let filter = ServiceUtils.getFilterUsingParentKeys(parentItem, this._pKeysEquiv);

      let quickFilterExpr = (this.pageable && this.oTableQuickFilterComponent) ? this.oTableQuickFilterComponent.filterExpression : undefined;
      if (quickFilterExpr) {
        const parentItemExpr = FilterExpressionUtils.buildExpressionFromObject(filter);
        const filterExpr = FilterExpressionUtils.buildComplexExpression(parentItemExpr, quickFilterExpr, FilterExpressionUtils.OP_AND);
        filter[FilterExpressionUtils.FILTER_EXPRESSION_KEY] = filterExpr;
      }

      let queryArguments = this.getQueryArguments(filter, ovrrArgs);
      if (this.querySubscription) {
        this.querySubscription.unsubscribe();
      }
      this.querySubscription = this.daoTable.getQuery(queryArguments).subscribe(res => {
        let data = undefined;
        let sqlTypes = undefined;
        if (Util.isArray(res)) {
          data = res;
          sqlTypes = [];
        } else if (res.code === 0) {
          const arrData = (res.data !== undefined) ? res.data : [];
          data = Util.isArray(arrData) ? arrData : [];
          sqlTypes = res.sqlTypes;
          if (this.pageable) {
            this.updatePaginationInfo(res);
          }
        }
        this.setData(data, sqlTypes);
        if (this.pageable) {
          ObservableWrapper.callEmit(this.onPaginatedTableDataLoaded, data);
        }
        ObservableWrapper.callEmit(this.onTableDataLoaded, this.daoTable.data);
      }, err => {
        this.showDialogError(err, 'MESSAGES.ERROR_QUERY');
        //this.pendingQuery = false;
        this.setData([], []);
      });
    }
  }

  updatePaginationInfo(queryRes: any) {
    super.updatePaginationInfo(queryRes);
  }

  protected setData(data: any, sqlTypes: any) {
    this.daoTable.sqlTypesChange.next(sqlTypes);
    this.daoTable.dataChange.next(data);
    this.daoTable.isLoadingResults = false;
  }

  showDialogError(error: string, errorOptional?: string) {
    if (error && typeof error !== 'object') {
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
        this._oTableOptions.visibleColumns = dialogRef.componentInstance.getVisibleColumns();
        this._oTableOptions.columns = dialogRef.componentInstance.getColumnsData();
      }
    });
  }

  onMdTableContentChanged() {
    console.log('onMdTableContentChanged');
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
    if ((this.detailMode === OServiceComponent.DETAIL_MODE_CLICK)) {
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
    if (this.oenabled && (this.detailMode === OServiceComponent.DETAIL_MODE_DBLCLICK)) {
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
      && (this.detailMode !== OServiceComponent.DETAIL_MODE_CLICK)
      && (this.editionMode === OServiceComponent.DETAIL_MODE_CLICK)) {

      this.activateColumnEdition(column, row, event);
    }
  }

  handleCellDoubleClick(column: OColumn, row: any, event?) {
    if (this.oenabled && column.editor
      && (this.detailMode !== OServiceComponent.DETAIL_MODE_DBLCLICK)
      && (this.editionMode === OServiceComponent.DETAIL_MODE_DBLCLICK)) {

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
    column.editor.startEdtion(rowData);
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
      var obj = {};
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
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.renderedData.length;
    return numSelected === numRows;
  }

  masterToggle(event: MdCheckboxChange) {
    event.checked ? this.dataSource.renderedData.forEach(row => this.selection.select(row)) : this.clearSelection();
  }

  selectionCheckboxToggle(event: MdCheckboxChange, row: any) {
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
        if (res.code === 0) {
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
        columnAttr: column.attr,
        columnDataArray: columnDataArray
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
    return this.selectionMode === 'multiple';
  }

  isSelectionModeSingle(): boolean {
    return this.selectionMode === 'single';
  }

  isSelectionModeNone(): boolean {
    return this.selectionMode === 'none';
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
    return this._oTableOptions.columns.find(item => item.name === attr);
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
    DragulaModule,
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
    provide: MdPaginatorIntl,
    useClass: OTableMdPaginatorIntl
  }]
})
export class OTableModule {
}
