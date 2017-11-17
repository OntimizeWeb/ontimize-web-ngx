import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChange,
  Inject,
  Injector,
  ElementRef,
  forwardRef,
  Optional,
  NgModule,
  ViewEncapsulation,
  ViewChild,
  EventEmitter
} from '@angular/core';

import { DragulaModule } from 'ng2-dragula/ng2-dragula';

import { InputConverter } from '../../decorators';

import { CommonModule } from '@angular/common';
import { dataServiceFactory } from '../../services/data-service.provider';
import { OntimizeService } from '../../services';
import { OFormComponent } from '../form/o-form.component';
import { OSharedModule } from '../../shared';
import { OServiceComponent } from '../o-service-component.class';
import { CdkTableModule } from '@angular/cdk/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { MdDialog, MdSort, MdSortModule, MdTabGroup, MdTab } from '@angular/material';

import { OTableDataSource } from './o-table.datasource';
import { OTableDao } from './o-table.dao';
import { OTableButtonComponent } from './header/table-button/o-table-button.component';
import { OTableOptionComponent } from './header/table-option/o-table-option.component';

import { OTableColumnComponent } from './column/o-table-column.component';
import { Util } from '../../util/util';
import { ObservableWrapper } from '../../util/async';

import { OFormValue } from '../form/OFormValue';

import { OTableVisibleColumnsDialogComponent } from './dialog/visible-columns/o-table-visible-columns-dialog.component';

import {
  OTableCellRendererDateComponent,
  OTableCellRendererBooleanComponent,
  OTableCellRendererCurrencyComponent,
  OTableCellRendererImageComponent,
  OTableCellRendererIntegerComponent,
  OTableCellRendererRealComponent
} from './column/cell-renderer/cell-renderer';


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

  // edit-on-focus [no|yes]: edit cell of an editable column when gaining the focus. Default: yes.
  'editOnFocus: edit-on-focus',

  // sort-columns [string]: initial sorting, with the format column:[ASC|DESC], separated by ';'. Default: no value.
  'sortColumns: sort-columns',

  // quick-filter [no|yes]: show quick filter. Default: yes.
  'quickFilter: quick-filter',

  // delete-button [no|yes]: show delete button. Default: yes.
  'deleteButton: delete-button',

  // refresh-button [no|yes]: show refresh button. Default: yes.
  'refreshButton: refresh-button',

  // columns-visibility-button [no|yes]: show columns visibility button. Default: yes.
  'columnsVisibilityButton: columns-visibility-button',

  // columns-resize-button [no|yes]: show columns resize button. Default: yes.
  'columnsResizeButton: columns-resize-button',

  // columns-group-button [no|yes]: show columns group button. Default: yes.
  'columnsGroupButton: columns-group-button',

  // export-button [no|yes]: show export button. Default: yes.
  'exportButton: export-button',

  // insert-table [no|yes]: fix a row at the bottom that allows to insert new records. Default: no.
  'insertTable: insert-table',

  // edition-mode [inline || empty]: edition mode opened. Default none
  'editionMode: edition-mode',

  // show-table-buttons-text [string][yes|no|true|false]: show text of header buttons
  'showTableButtonsText: show-table-buttons-text',

  // select-all-checkbox [string][yes|no|true|false]:
  'selectAllCheckbox: select-all-checkbox',

  // pagination mode [string][yes|no|true|false]
  'singlePageMode : single-page-mode',

  // pagination-controls [string][yes|no|true|false]
  'paginationControls : pagination-controls',

  //filter [string][yes|no|true|false]
  'filterCaseSensitive: filter-case-sensitive'
];

export const DEFAULT_OUTPUTS_O_TABLE = [
  'onClick',
  'onDoubleClick'
  // ,
  // 'onRowSelected',
  // 'onRowDeselected',
  // 'onRowDeleted',
  // 'onTableDataLoaded',
  // 'onPaginatedTableDataLoaded'
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
  width: string;
}

export class OTableOptions {
  selectColumn: OColumn = new OColumn();
  columns: Array<OColumn> = [];
  visibleColumns: Array<any> = [];
  filter: boolean = true;
  filterCaseSensitive: boolean = false;
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
    '[class.ontimize-table]': 'true'
  }
})


export class OTableComponent extends OServiceComponent implements OnInit, OnDestroy, OnChanges {
  constructor(
    injector: Injector,
    elRef: ElementRef,
    private dialog: MdDialog,
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent
  ) {
    super(injector, elRef, form);
    try {
      this.mdTabGroupContainer = this.injector.get(MdTabGroup);
      this.mdTabContainer = this.injector.get(MdTab);
    } catch (error) {
      // Do nothing due to not always is contained on tab.
    }
  }

  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MdSort) sort: MdSort;

  public static NAME_COLUMN_SELECT = 'select';
  public static TYPE_SEPARATOR = ':';
  public static VALUES_SEPARATOR = '=';
  public static TYPE_ASC_NAME = 'asc';
  public static TYPE_DESC_NAME = 'desc';
  public static COLUMNS_ALIAS_SEPARATOR = ':';

  @InputConverter()
  selectAllCheckbox: boolean = false;
  @InputConverter()
  exportButton: boolean = true;
  @InputConverter()
  columnsResizeButton: boolean = true;
  @InputConverter()
  columnsGroupButton: boolean = true;
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
  set quickFilter(value: boolean) {
    this._oTableOptions.filter = value;
    if (value) {
      this.initializeEventFilter();
    }
    this.setDatasource();
  }

  @InputConverter()
  set filterCaseSensitive(value: boolean) {
    this._oTableOptions.filterCaseSensitive = value;
    this.setDatasource();
  }
  @InputConverter()
  insertButton: boolean = true;

  @InputConverter()
  refreshButton: boolean = true;

  @InputConverter()
  deleteButton: boolean = true;

  public daoTable: OTableDao | null;
  public dataSource: OTableDataSource | null;

  protected visibleColumns: string;
  protected sortColumns: string;
  protected dataParentKeys: Array<Object>;

  protected mdTabGroupContainer: MdTabGroup;
  protected mdTabContainer: MdTab;
  protected mdTabGroupChangeSubscription: Subscription;

  protected pendingQuery: boolean = true;
  protected pendingQueryFilter = undefined;

  protected setStaticData: boolean = false;
  protected asyncLoadColumns: Array<any> = [];
  protected asyncLoadSubscriptions: Object = {};

  protected querySubscription: Subscription;
  protected finishQuerSubscription: boolean = false;


  public onClick: EventEmitter<any> = new EventEmitter();
  public onDoubleClick: EventEmitter<any> = new EventEmitter();
  protected selection = new SelectionModel<Element>(true, []);

   get selectedItemsLenght() {
    return this.selectedItems.length;
  }

  ngOnInit() {
    this.initialize();
  }

  ngAfterViewInit() {
    this.initTableAfterViewInit();
    if (this._oTableOptions.filter) {
      this.initializeEventFilter();
    }
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    // TODO
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
    let queryArguments = this.getQueryArguments({});
    this.setDatasource();
    if (this.staticData) {
      this.daoTable.setDataArray(this.staticData);
    } else if (this.queryOnInit) {
      this.queryData(queryArguments);
    }
  }

  destroy() {
    super.destroy();
    if (this.mdTabGroupChangeSubscription) {
      this.mdTabGroupChangeSubscription.unsubscribe();
    }
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
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
    return {
      'sort-columns': this.sort.active + ':' + this.sort.direction,
      'filter': this.filter ? this.filter.nativeElement.value : ''
    };
  }

  /**
   * Store all columns and properties in var columnsArray
   * @param column
   */
  public registerColumn(column: any) {
    let colDef: OColumn = new OColumn();
    colDef.type = 'string';
    colDef.className = 'o-table-column ' + (column.class || '') + ' ';
    colDef.orderable = true;
    colDef.searchable = true;
    colDef.width = '';

    if (typeof (column.attr) === 'undefined') {
      // column without 'attr' should contain only renderers that do not depend on cell data, but row data (e.g. actions)
      colDef.className += ' o-table-column-action ';
      colDef.name = column;
      colDef.attr = column;
      colDef.title = column;
    } else {
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
      colDef.type = column.type;
    }
    colDef.visible = (this.visibleColumns.indexOf(colDef.attr) !== -1);
    if (column.asyncLoad) {
      this.asyncLoadColumns.push(column.attr);
    }
    //find column definition by name
    if (typeof (column.attr) !== 'undefined') {
      var alreadyExisting = this._oTableOptions.columns.filter(function (existingColumn) {
        return existingColumn.name === column.attr;
      });
      if (alreadyExisting.length === 1) {
        var replacingIndex = this._oTableOptions.columns.indexOf(alreadyExisting[0]);
        this._oTableOptions.columns[replacingIndex] = colDef;
      } else if (alreadyExisting.length === 0) {
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

  /**
   * initialize event to filtering the columns, when change value then filter the data
   */
  initializeEventFilter() {
    setTimeout(() => {
      if (this.filter) {
        Observable.fromEvent(this.filter.nativeElement, 'keyup')
          .debounceTime(150)
          .distinctUntilChanged()
          .subscribe(() => {
            if (!this.dataSource) { return; }
            this.dataSource.filter = this.filter.nativeElement.value;
          });


        //if exists filter value in storage then filter result table
        let filterValue = this.state.filter || this.filter.nativeElement.value;
        this.filter.nativeElement.value = filterValue;
        if (this.dataSource) {
          this.dataSource.filter = filterValue;
        }
      }
    });
  }

  /**
   * get/set parametres to component
   */
  initializeParams() {

    this.dataParentKeys = [];
    if (this.parentKeys) {
      let keys = Util.parseArray(this.parentKeys);
      for (let i = 0; i < keys.length; ++i) {
        let key = keys[i];
        let keyDef = key.split(OTableComponent.COLUMNS_ALIAS_SEPARATOR);
        if (keyDef.length === 1) {
          this.dataParentKeys.push({
            'alias': keyDef[0],
            'name': keyDef[0]
          });
        } else if (keyDef.length === 2) {
          this.dataParentKeys.push({
            'alias': keyDef[0],
            'name': keyDef[1]
          });
        }
      }
    }
    //add column checkbox
    //1. create object ocolumn
    //2. not add visiblesColumns
    let checkboxColumn = new OColumn();
    checkboxColumn.name = OTableComponent.NAME_COLUMN_SELECT;
    checkboxColumn.title = '';
    checkboxColumn.visible = false;
    this._oTableOptions.selectColumn = checkboxColumn;



    //if not declare visible-columns then visible-columns is all columns
    if (this.visibleColumns) {
      this.visibleColumns.split(';').map(x => this._oTableOptions.visibleColumns.push(x));
    } else {
      this.visibleColumns = this.columns;
      this.columns.split(';').map(x => this._oTableOptions.visibleColumns.push(x));
    }

    if (this.columns) {
      this.columns.split(';').map(x => this.registerColumn(x));
    }
    //parse input sort-columns
    let sortColumnsArray = [];
    let sortColumnsParam = this.state['sort-columns'] || this.sortColumns;
    if (sortColumnsParam) {
      let cols = Util.parseArray(sortColumnsParam);
      for (let i = 0; i < cols.length; ++i) {
        let col = cols[i];
        let colDef = col.split(OTableComponent.TYPE_SEPARATOR);
        if (colDef.length > 0) {
          let colName = colDef[0];
          for (let colIndex = 0; colIndex < this._oTableOptions.columns.length; ++colIndex) {
            if (colName === this._oTableOptions.columns[colIndex].name) {
              let sortDirection = OTableComponent.TYPE_ASC_NAME;
              if (colDef.length > 1) {
                sortDirection = colDef[1].toLowerCase();
                switch (sortDirection) {
                  case OTableComponent.TYPE_DESC_NAME:
                    sortDirection = OTableComponent.TYPE_DESC_NAME;
                    break;
                }
              }
              sortColumnsArray.push([colName, sortDirection]);
            }
          }
        }
      }

      //set values of sort-columns to mdsort
      if ((typeof (this._oTableOptions.columns) !== 'undefined') && (sortColumnsArray.length > 0)) {
        let temp = sortColumnsArray[0];
        this.sort.active = temp[0];
        this.sort.direction = temp[1].toLowerCase();
      }
    }

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
    this.daoTable = new OTableDao(this.injector, this.service, this.entity, queryMethodName);
    this.setDatasource();
  }

  setDatasource() {
    this.dataSource = new OTableDataSource(this.daoTable, this._oTableOptions, this.sort);
    if (this.daoTable) {
      this.dataSource.resultsLength = this.daoTable.data.length;
    }
    /*  this.dataSource.resultsLength = 0;*/

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

    if (this.pendingQuery) {
      let filter = {};
      if ((this.dataParentKeys.length > 0) && (typeof (parentItem) !== 'undefined')) {
        for (let k = 0; k < this.dataParentKeys.length; ++k) {
          let parentKey = this.dataParentKeys[k];
          if (parentItem.hasOwnProperty(parentKey['alias'])) {
            let currentData = parentItem[parentKey['alias']];
            if (currentData instanceof OFormValue) {
              currentData = currentData.value;
            }
            filter[parentKey['name']] = currentData;
          }
        }
      }

      let queryArguments = this.getQueryArguments(filter, ovrrArgs);
      if (this.querySubscription) {
        this.querySubscription.unsubscribe();
      }
      this.querySubscription = this.daoTable.getQuery(queryArguments).subscribe(res => {
        let data = undefined;
        if (Util.isArray(res)) {
          data = res;
        } else if ((res.code === 0) && Util.isArray(res.data)) {
          res.data = (res.data !== undefined) ? res.data : [];

        }
        //this.dataSource.sqlTypes = res.sqlTypes;
        this.daoTable.dataChange.next(res);
        this.daoTable.isLoadingResults = true;
      }, err => {
        this.showDialogError(err, 'MESSAGES.ERROR_QUERY');
        this.pendingQuery = false;
        this.daoTable.dataChange.next([]);
        this.daoTable.isLoadingResults = true;
      });
    }
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
      if (this.asyncLoadColumns.indexOf(col) === -1) {
        columns.push(col);
      }
    });
    return columns;
  }

  getQueryArguments(filter: Object, ovrrArgs?: any): Array<any> {
    let queryArguments = super.getQueryArguments(filter, ovrrArgs);
    queryArguments[1] = this.getAttributesValuesToQuery();
    return queryArguments;
  }

  onExportButtonClicked() {
    console.log('onExportButtonClicked');
    console.log('get value', this.getValue());
    console.log('get valueRenderer', this.getRenderedValue());
    console.log('get valueRenderer', this.getSqlTypes());
  }

  onChangeColumnsVisibilityClicked() {
    let dialogRef = this.dialog.open(OTableVisibleColumnsDialogComponent, {
      data: {
        columnArray: Util.parseArray(this.visibleColumns),
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
    let route = [];
    if (this.detailFormRoute) {
      route.push(this.detailFormRoute);
    }
    route.push('new');
    // adding parent-keys info...
    if ((this.dataParentKeys.length > 0) && (typeof (this.parentItem) !== 'undefined')) {
      let pKeys = {};
      for (let k = 0; k < this.dataParentKeys.length; ++k) {
        let parentKey = this.dataParentKeys[k];
        if (this.parentItem.hasOwnProperty(parentKey['alias'])) {
          let currentData = this.parentItem[parentKey['alias']];
          if (currentData instanceof OFormValue) {
            currentData = currentData.value;
          }
          pKeys[parentKey['name']] = currentData;
        }
      }
      if (Object.keys(pKeys).length > 0) {
        let encoded = Util.encodeParentKeys(pKeys);
        route.push({ 'pk': encoded });
      }
    }
    let extras = { relativeTo: this.actRoute };
    this.router.navigate(
      route,
      extras
    ).catch(err => {
      console.error(err.message);
    });
  }


  public remove(clearSelectedItems: boolean = false) {
    if ((this.keysArray.length > 0) && (this.selectedItems.length > 0)) {
      this.dialogService.confirm('CONFIRM', 'MESSAGES.CONFIRM_DELETE')
        .then(
        res => {
          if (res === true) {
            if (this.dataService && (this.deleteMethod in this.dataService) && this.entity && (this.keysArray.length > 0)) {
              let filters = [];
              this.selectedItems.map(item => {
                let kv = {};
                for (let k = 0; k < this.keysArray.length; ++k) {
                  let key = this.keysArray[k];
                  kv[key] = item[key];
                }
                filters.push(kv);
              });

              this.daoTable.removeQuery(this.deleteMethod, filters).subscribe(
                res => {
                  console.log('[OTable.remove]: response', res);
                  //ObservableWrapper.callEmit(this.onRowDeleted, this.selectedItems);
                },
                error => {
                  this.showDialogError(error, 'MESSAGES.ERROR_DELETE');
                  console.log('[OTable.remove]: error', error);
                },
                () => {
                  console.log('[OTable.remove]: success');
                  this.reloadData();
                }
              );
            } else {
              // remove local
              this.deleteLocalItems();
            }
          } else if (clearSelectedItems) {
            this.selectedItems = [];
          }
        }
        );
    }
  }

  public refresh() {
    this.reloadData();
  }

  public reloadData() {
    this.finishQuerSubscription = false;
    this.pendingQuery = true;
    let queryArguments = this.getQueryArguments({});
    this.queryData(queryArguments);
  }
  handleClick(item: any) {
    ObservableWrapper.callEmit(this.onClick, item);
    if (this.oenabled && (this.detailMode === OServiceComponent.DETAIL_MODE_CLICK)) {
      this.viewDetail(item);
    }
  }

  handleDoubleClick(item: any) {
    ObservableWrapper.callEmit(this.onDoubleClick, item);
    if (this.oenabled && (this.detailMode === OServiceComponent.DETAIL_MODE_DBLCLICK)) {
      this.viewDetail(item);
    }
  }

  onShowsSelects(event?) {
    this._oTableOptions.selectColumn.visible = !this._oTableOptions.selectColumn.visible;

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

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.renderedData.forEach(row => this.selection.select(row));
    this.selectedItems = this.selection.selected;
    this.deleteButton = this.selectedItems.length > 0 && this.deleteButton;
  }

  selectedRow(row: any) {
    this.selection.toggle(row);
    this.selectedItems = this.selection.selected;
    this.deleteButton = this.selectedItems.length > 0 && this.deleteButton;
  }

  getTrackByFunction(): Function {
    const self = this;

    return (index: number, item: any) => {
      if (self.asyncLoadColumns.length && !this.finishQuerSubscription) {
        self.queryRowAsyncData(index, item);
        if (index === (this.daoTable.data.length - 1)) {
          self.finishQuerSubscription = true;
        }
      } else {
        return item;
      }
    };
  }

  queryRowAsyncData(rowIndex: number, rowData: any) {
    let kv = {};
    for (let k = 0; k < this.keysArray.length; ++k) {
      let key = this.keysArray[k];
      kv[key] = rowData[key];
    }
    let av = [];
    for (let i = 0; i < this.asyncLoadColumns.length; i++) {
      av.push(this.asyncLoadColumns[i]);
    }
    const columnQueryArgs = [kv, av, this.entity];
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

  public getValue() {
    return this.dataSource.getCurrentData();
  }
  public getRenderedValue() {
    return this.dataSource.getCurrentRendererData();
  }

  public getSqlTypes() {
    return this.dataSource.sqlTypes;
  }

}

@NgModule({
  declarations: [
    OTableComponent,
    OTableColumnComponent,
    OTableCellRendererDateComponent,
    OTableCellRendererBooleanComponent,
    OTableCellRendererImageComponent,
    OTableCellRendererIntegerComponent,
    OTableCellRendererRealComponent,
    OTableCellRendererCurrencyComponent,
    OTableVisibleColumnsDialogComponent,
    OTableButtonComponent,
    OTableOptionComponent
  ],
  imports: [
    CommonModule,
    OSharedModule,
    CdkTableModule,
    MdSortModule,
    DragulaModule
  ],
  exports: [
    OTableComponent,
    OTableButtonComponent,
    OTableOptionComponent,
    OTableColumnComponent,
    OTableCellRendererDateComponent,
    OTableCellRendererBooleanComponent,
    OTableCellRendererImageComponent,
    OTableCellRendererIntegerComponent,
    OTableCellRendererRealComponent,
    OTableCellRendererCurrencyComponent
  ],
  entryComponents: [
    OTableCellRendererDateComponent,
    OTableCellRendererBooleanComponent,
    OTableCellRendererImageComponent,
    OTableCellRendererIntegerComponent,
    OTableCellRendererRealComponent,
    OTableCellRendererCurrencyComponent,
    OTableVisibleColumnsDialogComponent
  ]
})
export class OTableModule {
}
