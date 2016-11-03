import {
  Component, OnInit, OnDestroy, OnChanges,
  SimpleChange, Inject, Injector,
  ElementRef, forwardRef, Optional,
  EventEmitter, NgModule, ModuleWithProviders, ViewEncapsulation,
  ViewChild
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { InputConverter } from '../../decorators';
import { ObservableWrapper } from '../../util/async';
import { Router, ActivatedRoute, NavigationStart, RoutesRecognized } from '@angular/router';
import { OTranslateModule } from '../../pipes/o-translate.pipe';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeAll';
import { MdMenuModule, MdMenuTrigger } from '@angular2-material/menu';
import { MdIconModule } from '@angular2-material/icon';

import { OTableColumnComponent } from './o-table-column.component';
import {
  OTableCellEditorBooleanComponent,
  OTableCellEditorComboComponent,
  OTableCellEditorDateComponent,
  OTableCellEditorIntegerComponent,
  OTableCellEditorRealComponent,
  OTableCellEditorStringComponent
} from './cell-editor/cell-editor';

import {
  OTableCellRendererActionComponent,
  OTableCellRendererBooleanComponent,
  OTableCellRendererCurrencyComponent,
  OTableCellRendererDateComponent,
  OTableCellRendererImageComponent,
  OTableCellRendererIntegerComponent,
  OTableCellRendererRealComponent,
  OTableCellRendererServiceComponent,
  OTableCellRendererStringComponent
} from './cell-renderer/cell-renderer';

import {
  OTableButtonComponent,
  OTableOptionComponent,
} from './header-components/header-components';

import { dataServiceFactory } from '../../services/data-service.provider';
import { AuthGuardService, DialogService, OTranslateService, OntimizeService, MomentService } from '../../services';
import { Util } from '../../util/util';
import { OFormComponent } from '../form/o-form.component';
import { OFormValue } from '../form/OFormValue';

import './o-table.loader';


const TABLE_CHECKBOX_TEMPLATE = `
  <div class="md-checkbox-inner-container">
    <input class="select-row" type="checkbox" name="id[]">
    <div class="md-checkbox-frame"></div>
    <div class="md-checkbox-background">
      <svg space="preserve" class="md-checkbox-checkmark" version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path class="md-checkbox-checkmark-path" d="M4.1,12.7 9,17.6 20.3,6.3" fill="none" stroke="white"></path>
      </svg>
      <div class="md-checkbox-mixedmark"></div>
    </div>
  </div>
`;

export const DEFAULT_INPUTS_O_TABLE = [

  // attr [string]: table identifier. It is mandatory if data are provided through the data attribute. Default: entity (if set).
  'attr',

  // title [string]: title to be shown in the documents exported. Default: no value.
  'title',

  // visible [no|yes]: visibility. Default: yes.
  'visible',

  // enabled [no|yes]: editability. Default: yes.
  'enabled',

  // data [array<object>]: way to populate with static data. Default: no value.
  'data',

  // service [string]: JEE service path. Default: no value.
  'service',

  // query-method [string]: name of the service method to perform queries. Default: query.
  'queryMethod: query-method',

  // insert-method [string]: name of the service method to perform inserts. Default: insert.
  'insertMethod: insert-method',

  // update-method [string]: name of the service method to perform updates. Default: update.
  'updateMethod: update-method',

  // delete-method [string]: name of the service method to perform deletions. Default: delete.
  'deleteMethod: delete-method',

  // entity [string]: entity of the service. Default: no value.
  'entity',

  // keys [string]: entity keys, separated by ';'. Default: no value.
  'keys',

  // parent-keys [string]: parent keys to filter, separated by ';'. Default: no value.
  'parentKeys: parent-keys',

  // columns [string]: columns of the entity, separated by ';'. Default: no value.
  'columns',

  // visible-columns [string]: visible columns, separated by ';'. Default: no value.
  'visibleColumns: visible-columns',

  // editable-columns [string]: columns that can be edited directly over the table, separated by ';'. Default: no value.
  'editableColumns: editable-columns',

  // edit-on-focus [no|yes]: edit cell of an editable column when gaining the focus. Default: yes.
  'editOnFocus: edit-on-focus',

  // sort-columns [string]: initial sorting, with the format column:[ASC|DESC], separated by ';'. Default: no value.
  'sortColumns: sort-columns',

  // query-rows [number]: number of rows per page. Default: 10.
  'queryRows: query-rows',

  // query-on-init [no|yes]: query table on init. Default: yes.
  'queryOnInit: query-on-init',

  // quick-filter [no|yes]: show quick filter. Default: yes.
  'quickFilter: quick-filter',

  // insert-button [no|yes]: show insert button. Default: yes.
  'insertButton: insert-button',

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

  // detail-mode [none|click|doubleclick]: way to open the detail form of a row. Default: 'none'.
  'detailMode: detail-mode',

  // detail-form-route [string]: route of detail form. Default: 'detail'.
  'detailFormRoute: detail-form-route',

  // recursive-detail [no|yes]: do not append detail keys when navigate (overwrite current). Default: no.
  'recursiveDetail: recursive-detail',

  // insert-table [no|yes]: fix a row at the bottom that allows to insert new records. Default: no.
  'insertTable: insert-table',

  // detail-button-in-row [no|yes]: adding a button in row for opening detail form. Default: yes.
  'detailButtonInRow: detail-button-in-row',

  // detail-button-in-row-icon [string]: material icon. Default: mode_edit.
  'detailButtonInRowIcon: detail-button-in-row-icon',

  // edit-button-in-row [no|yes]: adding a button in row for opening edition form. Default: no.
  'editButtonInRow: edit-button-in-row',

  // edit-button-in-row-icon [string]: material icon. Default: search.
  'editButtonInRowIcon: edit-button-in-row-icon',

  // edition-mode [inline || empty]: edition mode opened. Default none
  'editionMode: edition-mode',

  // edit-form-route [string]: route of edit form. Default: 'edit'.
  'editFormRoute: edit-form-route',

  // recursive-edit [no|yes]: do not append detail keys when navigate (overwrite current). Default: no.
  'recursiveEdit: recursive-edit',

  // show-header-buttons-text [string][yes|no|true|false]: show text of header buttons
  'showHeaderButtonsText: show-header-buttons-text',

  // select-all-checkbox [string][yes|no|true|false]:
  'selectAllCheckbox: select-all-checkbox',

  //controls [string][yes|no|true|false]:
  'controls',

  // row-height [small | medium | large]
  'rowHeight : row-height'
];

export const DEFAULT_OUTPUTS_O_TABLE = [
];



@Component({
  selector: 'o-table',
  templateUrl: './table/o-table.component.html',
  styleUrls: [
    './table/o-table.component.css'
  ],
  providers: [
    { provide: OntimizeService, useFactory: dataServiceFactory, deps: [Injector] }
  ],
  inputs: [
    ...DEFAULT_INPUTS_O_TABLE
  ],
  outputs: [
    ...DEFAULT_OUTPUTS_O_TABLE
  ],
  encapsulation: ViewEncapsulation.None
})

export class OTableComponent implements OnInit, OnDestroy, OnChanges {

  public static DEFAULT_INPUTS_O_TABLE = DEFAULT_INPUTS_O_TABLE;
  public static DEFAULT_OUTPUTS_O_TABLE = DEFAULT_OUTPUTS_O_TABLE;

  public static COLUMNS_SEPARATOR = ';';
  public static COLUMNS_ALIAS_SEPARATOR = ':';
  public static OPTIONS_SEPARATOR = ';';
  public static VALUES_SEPARATOR = '=';
  public static TYPE_SEPARATOR = ':';
  public static TYPE_ASC_NAME = 'asc';
  public static TYPE_DESC_NAME = 'desc';
  public static DEFAULT_QUERY_ROWS = 10;
  public static DEFAULT_QUERY_ROWS_MENU = [
    [10, 25, 50, 100, -1],
    [10, 25, 50, 100, 'All']
  ];
  public static DEFAULT_DETAIL_MODE = 'none';
  public static ROW_BUTTON_DETAIL = 'DETAIL';
  public static ROW_BUTTON_DELETE = 'DELETE';

  protected initialized: boolean;

  protected authGuardService: AuthGuardService;
  protected translateService: OTranslateService;
  protected dialogService: DialogService;
  protected momentService: MomentService;

  @InputConverter()
  quickFilter: boolean = true;
  @InputConverter()
  insertButton: boolean = true;
  @InputConverter()
  deleteButton: boolean = true;
  @InputConverter()
  refreshButton: boolean = true;
  @InputConverter()
  columnsVisibilityButton: boolean = true;
  @InputConverter()
  columnsResizeButton: boolean = true;
  @InputConverter()
  columnsGroupButton: boolean = true;
  @InputConverter()
  exportButton: boolean = true;
  @InputConverter()
  editOnFocus: boolean = true;
  @InputConverter()
  queryOnInit: boolean = true;
  @InputConverter()
  recursiveDetail: boolean = false;
  @InputConverter()
  insertTable: boolean = false;
  @InputConverter()
  detailButtonInRow: boolean = true;
  @InputConverter()
  editButtonInRow: boolean = true;
  @InputConverter()
  recursiveEdit: boolean = false;
  @InputConverter()
  selectAllCheckbox: boolean = false;
  @InputConverter()
  showHeaderButtonsText: boolean = false;
  @InputConverter()
  controls: boolean = true;


  protected attr: string;
  protected title: string;
  @InputConverter()
  visible: boolean = true;
  @InputConverter()
  enabled: boolean = true;
  protected data: Array<any>;
  protected service: string;
  protected dataService: any;
  protected componentData: Array<any>;
  protected entity: string;
  protected keys: string;
  protected dataKeys: Array<string>;
  protected parentKeys: string;
  protected dataParentKeys: Array<Object>;
  protected parentItem: any;
  protected filterForm: boolean;
  protected columns: string;
  protected dataColumns: Array<string>;
  protected visibleColumns: string;
  protected dataVisibleColumns: Array<string>;
  protected editableColumns: string;
  protected dataEditableColumns: Array<string>;
  protected sortColumns: string;
  protected dataSortColumns: Array<any>;
  protected queryRows: any;
  protected queryRowsMenu: Array<any>;
  protected queryMethod: string;
  protected insertMethod: string;
  protected updateMethod: string;
  protected deleteMethod: string;
  protected detailMode: string;
  protected detailFormRoute: string;
  protected editColumnIndex: number;
  protected detailColumnIndex: number;
  protected detailButtonInRowIcon: string;
  protected editButtonInRowIcon: string;
  protected editionMode: string;
  protected editFormRoute: string;
  protected state: any;
  protected table: any;
  protected tableHtmlEl: any;
  protected dataTable: any;
  protected dataTableOptions: any;
  protected columnComponentsRegistered: boolean;
  protected selectedItems: Array<Object>;
  protected lastDeselection: any;
  protected groupColumnIndex: number;
  protected groupColumnOrder: string;
  protected onFormDataSubscribe: any;
  protected onLanguageChangeSubscribe: any;
  protected onRouterNavigateSubscribe: any;
  protected onInsertRowFocusSubscribe: Array<any>;
  protected onInsertRowSubmitSubscribe: any;
  protected headerButtons: Array<OTableButtonComponent>;
  protected headerOptions: Array<OTableOptionComponent>;
  protected showOptionsButton: boolean = true;
  protected showExportOptions: boolean = false;
  protected rowHeight: string;

  public onRowSelected: EventEmitter<any> = new EventEmitter();
  public onRowDelected: EventEmitter<any> = new EventEmitter();
  public onClick: EventEmitter<any> = new EventEmitter();
  public onDoubleClick: EventEmitter<any> = new EventEmitter();

  @ViewChild(MdMenuTrigger) trigger: MdMenuTrigger;

  constructor(
    protected _router: Router,
    protected _actRoute: ActivatedRoute,
    public element: ElementRef,
    protected injector: Injector,
    @Optional() @Inject(forwardRef(() => OFormComponent)) protected form: OFormComponent
  ) {

    this.initialized = false;

    this.authGuardService = injector.get(AuthGuardService);
    this.momentService = injector.get(MomentService);
    this.dialogService = injector.get(DialogService);
    this.translateService = injector.get(OTranslateService);
    this.parentItem = undefined;
    this.filterForm = false;
    this.columnComponentsRegistered = false;
    this.selectedItems = [];
    this.lastDeselection = undefined;
    this.groupColumnIndex = -1;
    this.groupColumnOrder = OTableComponent.TYPE_ASC_NAME;
    OTableComponent.DEFAULT_QUERY_ROWS_MENU[1][4] = this.translateService.get('TABLE.SHOW_ALL');
    this.detailMode = OTableComponent.DEFAULT_DETAIL_MODE;

    this.headerButtons = [];
    this.headerOptions = [];

    this.onLanguageChangeSubscribe = this.translateService.onLanguageChanged.subscribe(
      res => {
        //if (this.initialized) {
        this.dataTable.fnDestroy();
        this.dataTable = null;
        this.initTableOnInit(this.dataTableOptions.columns);
        this.initTableAfterViewInit();
        if ((typeof (this.table) !== 'undefined') && (this.dataSortColumns.length > 0)) {
          this.table.order(this.dataSortColumns);
          this.table.draw();
        }
        //}
      }
    );

    this.onRouterNavigateSubscribe = this._router.events.subscribe(
      route => {
        if ((typeof (this.attr) === 'undefined') ||
          !(route instanceof NavigationStart || route instanceof RoutesRecognized) ||
          ((route instanceof NavigationStart || route instanceof RoutesRecognized) && (!route.url.startsWith(this._router.url)))) {
          let localStorageState = localStorage.getItem('DataTables' + '_' + this.attr + '_' + this._router.url);
          if (localStorageState) {
            let state = JSON.parse(localStorageState);
            delete state.start;
            delete state.selectedIndex;
            localStorage.setItem('DataTables' + '_' + this.attr + '_' + this._router.url, JSON.stringify(state));
          }
        }
      }
    );

    this.onInsertRowFocusSubscribe = [];
    this.onInsertRowSubmitSubscribe = undefined;
  }

  public ngOnInit(): any {

    if (typeof (this.attr) === 'undefined') {
      if (typeof (this.entity) !== 'undefined') {
        this.attr = this.entity.replace('.', '_');
      }
    }

    if (typeof (this.title) !== 'undefined') {
      this.title = this.translateService.get(this.title);
    }

    this.authGuardService.getPermissions(this._router.url, this.attr)
      .then(
      permissions => {
        if (typeof (permissions) !== 'undefined') {
          if (this.visible && permissions.visible === false) {
            this.visible = false;
          }
          if (this.enabled && permissions.enabled === false) {
            this.enabled = false;
          }
        }
      }
      );

    if (this.keys) {
      this.dataKeys = this.keys.split(OTableComponent.COLUMNS_SEPARATOR);
    } else {
      this.dataKeys = [];
    }

    this.dataParentKeys = [];
    if (this.parentKeys) {
      let keys = this.parentKeys.split(OTableComponent.COLUMNS_SEPARATOR);
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

    if (this.queryRows) {
      this.queryRows = parseInt(this.queryRows);
    } else {
      this.queryRows = OTableComponent.DEFAULT_QUERY_ROWS;
    }
    this.queryRowsMenu = OTableComponent.DEFAULT_QUERY_ROWS_MENU;

    this.rowHeight = this.rowHeight ? this.rowHeight.toLowerCase() : this.rowHeight;
    if (!this.rowHeight || (['small', 'medium', 'large'].indexOf(this.rowHeight) === -1)) {
      this.rowHeight = 'medium';
    }

    // get previous position
    let localStorageState = localStorage.getItem('DataTables' + '_' + this.attr + '_' + this._router.url);
    if (localStorageState) {
      this.state = JSON.parse(localStorageState);
    } else {
      this.state = {};
    }

    if (this.data) {
      this.componentData = this.data;
    } else {
      this.componentData = [];
      this.configureService();
    }

    if (this.columns) {
      this.dataColumns = this.columns.split(OTableComponent.COLUMNS_SEPARATOR);
    } else {
      this.dataColumns = [];
    }

    if (this.visibleColumns) {
      this.dataVisibleColumns = this.visibleColumns.split(OTableComponent.COLUMNS_SEPARATOR);
    } else {
      this.dataVisibleColumns = [];
    }

    if (this.editableColumns) {
      this.dataEditableColumns = this.editableColumns.split(OTableComponent.COLUMNS_SEPARATOR);
    } else {
      this.dataEditableColumns = [];
    }

    //TODO: get default values from ICrudConstants
    if (!this.queryMethod) {
      this.queryMethod = 'query';
    }
    if (!this.insertMethod) {
      this.insertMethod = 'insert';
    }
    if (!this.updateMethod) {
      this.updateMethod = 'update';
    }
    if (!this.deleteMethod) {
      this.deleteMethod = 'delete';
    }

    if (this.form) {
      this.setFormComponent(this.form);
    }

    this.initTableOnInit();
  }

  configureService() {
    this.dataService = this.injector.get(OntimizeService);

    if (Util.isDataService(this.dataService)) {
      let serviceCfg = this.dataService.getDefaultServiceConfiguration(this.service);
      if (this.entity) {
        serviceCfg['entity'] = this.entity;
      }
      this.dataService.configureService(serviceCfg);
    }
  }

  public ngOnDestroy() {
    this.onLanguageChangeSubscribe.unsubscribe();
    this.onRouterNavigateSubscribe.unsubscribe();
    for (let i = 0; i < this.onInsertRowFocusSubscribe.length; ++i) {
      this.onInsertRowFocusSubscribe[i].unsubscribe();
    }
    if (typeof (this.onInsertRowSubmitSubscribe) !== 'undefined') {
      this.onInsertRowSubmitSubscribe.unsubscribe();
    }
    if (typeof (this.onFormDataSubscribe) !== 'undefined') {
      this.onFormDataSubscribe.unsubscribe();
    }
  }

  public ngAfterViewInit() {
    this.initTableAfterViewInit();
    if (this.trigger) {
      this.trigger.onMenuOpen.subscribe(args => this.onOptionsMenuShow(args));
    }
  }

  public ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    if ((typeof (changes['data']) !== 'undefined') && (typeof (this.dataTable) !== 'undefined')) {
      this.dataTable.fnClearTable();
      this.componentData = changes['data'].currentValue;
      if (this.componentData.length > 0) {
        this.dataTable.fnAddData(this.componentData);
      }
      this.dataTable.fnDraw();
    }
  }

  public refresh() {
    this.update(this.parentItem);
  }

  protected initTableOnInit(columns: any = undefined) {
    var self = this;

    let domOption = 'rtpil';
    if (this.controls) {
      domOption = '<"dataTables_top_wrapper"B<"dataTables_filter_wrapper"<"dataTables_hidden_options">f><"dataTables_options">>' + domOption;
    }

    this.dataTableOptions = {
      data: this.componentData,
      /*dom attribute
      B: buttons
      f: {filter}
      r: {processing}
      t: {table}
      p: {pagination}
      i: {information}
      l: {length}
      */
      // dom: '<"dataTables_top_wrapper"B<"dataTables_filter_wrapper"<"dataTables_hidden_options">f><"dataTables_options">>rtpil',
      dom: domOption,
      buttons: this.getTableButtons(),
      select: !this.selectAllCheckbox,
      autoWidth: false,
      stateSave: true,
      filter: this.quickFilter,
      ordering: true,
      info: true,
      paging: true,
      pageLength: this.queryRows,
      lengthMenu: this.queryRowsMenu,
      pagingType: 'full', // simple, simple_numbers, full, full_numbers,
      colResize: {
        tableWidthFixed: false
      },
      language: this.getLanguageLabels(),
      keys: true,
      columns: [
        /*{
          orderable: false,
          searchable: false,
          className: 'o-table-select-checkbox'
        }*/
      ],
      createdRow: (row, data, dataIndex) => {
        let tr = $(row) as any;
        tr.children().each(function (i, e) {
          let td = $(e) as any;
          let order = td.children().attr('data-order');
          if ((td.children().length > 0) && (typeof (order) !== 'undefined')) {
            td.attr('data-order', order);
            td.html(td.children().text());
          } else {
            td.attr('data-order', td.text());
          }
        });
      },
      initComplete: (settings) => {
        this.handleColumnWidth();
        let controlButtons = $('#' + this.attr + '_wrapper .generic-action') as any;
        ($ as any).each(controlButtons, function (i, el) {
          ($(this) as any).attr('title', ($(this) as any).find('span').text());


        });

        let customButtons = $('#' + this.attr + '_wrapper .custom-generic-action') as any;
        ($ as any).each(customButtons, function (i, el) {
          var btnEl = ($(this) as any);
          var iconMatch = btnEl.attr('class').match(/icon-(.*)/);
          var icon = '';
          if (iconMatch !== null) {
            icon = iconMatch[1];
          }
          btnEl.attr('data-icon', icon);
          btnEl.attr('title', ($(this) as any).find('span').text());
        });

        let filterButton = $('#' + this.attr + '_wrapper .generic-action-filter') as any;
        let filterInput = ($('#' + this.attr + '_filter') as any).find('input');
        if ((filterInput.length > 0) && (filterInput.val().length > 0)) {
          filterButton.addClass('filtering');
        } else {
          filterButton.removeClass('filtering');
        }
        filterInput.keyup(function () {
          if (filterInput.val().length > 0) {
            filterButton.addClass('filtering');
          } else {
            filterButton.removeClass('filtering');
          }
        });
      },
      drawCallback: (settings) => {
        if (this.groupColumnIndex >= 0) {
          let api = this.dataTable.api();
          let rows = api.rows({ page: 'current' }).nodes();
          let last = null;
          api.column(this.groupColumnIndex, { page: 'current' }).data().each((group, i) => {
            if (last !== group) {
              ($(rows) as any).eq(i).before(
                '<tr class="group"><td colspan="100%">' +
                this.dataTableOptions.columns[this.groupColumnIndex].component.render(group) +
                '</td></tr>'
              );
              last = group;
            }
          });
        }
        if (this.insertTable && this.enabled) {

          for (let i = 0; i < this.onInsertRowFocusSubscribe.length; ++i) {
            this.onInsertRowFocusSubscribe[i].unsubscribe();
          }
          this.onInsertRowFocusSubscribe = [];
          if (typeof (this.onInsertRowSubmitSubscribe) !== 'undefined') {
            this.onInsertRowSubmitSubscribe.unsubscribe();
            this.onInsertRowSubmitSubscribe = undefined;
          }

          let tbody = $('#' + this.attr + '_wrapper table tbody') as any;
          tbody.append('<tr class="insertRow"></tr>');
          var insertRow = tbody.find('.insertRow');
          let lastEditor = true;
          for (let i = settings.aoColumns.length - 1; i >= 0; --i) {
            let colDef = settings.aoColumns[i];
            if (colDef.bVisible) {
              insertRow.prepend('<td></td>');
              if (colDef.editable && (typeof (colDef.component) !== 'undefined') &&
                (typeof (colDef.component.editor) !== 'undefined')) {
                let insertCell = insertRow.find('td:first');
                colDef.component.editor.createEditorForInsertTable(insertCell, undefined);
                this.onInsertRowFocusSubscribe.push(
                  colDef.component.editor.onFocus.subscribe(
                    res => {
                      if (res.inserTable) {
                        this.table.rows().deselect();
                        this.table.cell.blur();
                      }
                    }
                  )
                );
                if (lastEditor && this.dataService && (this.insertMethod in this.dataService) && this.entity) {
                  this.onInsertRowSubmitSubscribe = colDef.component.editor.onSubmit.subscribe(
                    res => {
                      if (res.inserTable) {

                        // get av from insert row
                        let av = {};
                        for (let j = 0; j < settings.aoColumns.length; ++j) {
                          let iColDef = settings.aoColumns[j];
                          if (iColDef.bVisible && iColDef.editable && (typeof (iColDef.component) !== 'undefined') &&
                            (typeof (iColDef.component.editor) !== 'undefined')) {
                            let iName = iColDef.name;
                            let iValue = iColDef.component.editor.getInsertTableValue();
                            if (typeof (iValue) !== 'undefined') {
                              av[iName] = iValue;
                            }
                          }
                        }

                        // add parent-keys to av
                        if ((this.dataParentKeys.length > 0) && (typeof (this.parentItem) !== 'undefined')) {
                          for (let k = 0; k < this.dataParentKeys.length; ++k) {
                            let parentKey = this.dataParentKeys[k];
                            if (this.parentItem.hasOwnProperty(parentKey['alias'])) {
                              let currentData = this.parentItem[parentKey['alias']];
                              if (currentData instanceof OFormValue) {
                                currentData = currentData.value;
                              }
                              av[parentKey['name']] = currentData;
                            }
                          }
                        }

                        // perform insert
                        console.log('[OTable.initTableOnInit]: insert', av);
                        this.dataService[this.insertMethod](av, this.entity)
                          .subscribe(
                          res => {
                            if ((typeof (res.code) === 'undefined') ||
                              ((typeof (res.code) !== 'undefined') && (res.code === 0))) {
                              this.update(this.parentItem);
                              console.log('[OTable.initTableOnInit]: insert ok', res);
                            } else {
                              console.log('[OTable.initTableOnInit]: error', res.code);
                              this.dialogService.alert('ERROR', 'MESSAGES.ERROR_INSERT');
                            }
                          },
                          err => {
                            console.log('[OTable.initTableOnInit]: error', err);
                            this.dialogService.alert('ERROR', 'MESSAGES.ERROR_INSERT');
                          }
                          );

                      }
                    }
                  );
                  lastEditor = false;
                }
              }
            }
          }

        }
        let emptyRow = $('.dataTables_empty') as any;
        if (emptyRow.length > 0) {
          emptyRow.parent().addClass('empty');
        }
      },
      headerCallback: function (thead, data, start, end, display) {
        if (self.selectAllCheckbox) {
          var checkboxCell = ($(thead) as any).find('th').eq(0);
          checkboxCell.attr('class', 'o-table-column-select-checkbox');
          checkboxCell.html(TABLE_CHECKBOX_TEMPLATE);
          checkboxCell.find('.select-row').attr('id', 'select_all');
        }
      }
    };

    if (typeof (columns) !== 'undefined') {
      // columns defined with 'o-table-column' directives
      for (let i = 0; i < columns.length; ++i) {
        let col = columns[i];
        if ((typeof (col.title) === 'string') && (col.name === col.title)) {
          // little trick to translate titles whose translation had not been loaded at initialization time
          col.title = this.translateService.get(col.name);
          col.sTitle = col.title;
        }
      }
      this.dataTableOptions.columns = columns;
    } else {
      // columns defined only with the 'columns' attribute
      for (let i = 0; i < this.dataColumns.length; ++i) {
        let col = this.dataColumns[i];
        let colDef = {
          data: col,
          name: col,
          title: this.translateService.get(col),
          className: 'o-table-column',
          defaultContent: '',
          orderable: true,
          searchable: true,
          editable: (this.dataEditableColumns.indexOf(col) !== -1),
          visible: (this.dataVisibleColumns.indexOf(col) !== -1)
        };
        if (this.editOnFocus && colDef.editable) {
          colDef.className += ' editable';
        }
        this.dataTableOptions.columns.push(colDef);
      }
    }

    this.dataSortColumns = [];
    if (this.sortColumns) {
      let cols = this.sortColumns.split(OTableComponent.COLUMNS_SEPARATOR);
      for (let i = 0; i < cols.length; ++i) {
        let col = cols[i];
        let colDef = col.split(OTableComponent.TYPE_SEPARATOR);
        if (colDef.length > 0) {
          let colName = colDef[0];
          for (let colIndex = 0; colIndex < this.dataTableOptions.columns.length; ++colIndex) {
            if (colName === this.dataTableOptions.columns[colIndex].name) {
              let sortDirection = OTableComponent.TYPE_ASC_NAME;
              if (colDef.length > 1) {
                sortDirection = colDef[1].toLowerCase();
                switch (sortDirection) {
                  case OTableComponent.TYPE_DESC_NAME:
                    sortDirection = OTableComponent.TYPE_DESC_NAME;
                    break;
                }
              }
              this.dataSortColumns.push([colIndex, sortDirection]);
            }
          }
        }
      }
      if ((typeof (columns) !== 'undefined') && (this.dataSortColumns.length > 0)) {
        this.dataTableOptions.order = this.dataSortColumns;
      }
    }

  }

  protected addDefaultRowButtons() {
    this.editColumnIndex = -1;
    this.detailColumnIndex = -1;

    if (this.editButtonInRow) {
      var editColumn = new OTableColumnComponent(this, this.injector);
      var editColumnRenderer = new OTableCellRendererActionComponent(editColumn, this.injector);
      editColumnRenderer.init({
        action: 'edit',
        editionMode: this.editionMode,
        renderType: 'icon',
        renderValue: this.editButtonInRowIcon
      });
      this.editColumnIndex = this.dataTableOptions.columns.length;
      this.registerColumn(editColumn);
    }
    if (this.detailButtonInRow) {
      var detailColumn = new OTableColumnComponent(this, this.injector);
      var detailColumnRenderer = new OTableCellRendererActionComponent(detailColumn, this.injector);
      detailColumnRenderer.init({
        action: 'detail',
        renderType: 'icon',
        renderValue: this.detailButtonInRowIcon
      });
      this.detailColumnIndex = this.dataTableOptions.columns.length;
      this.registerColumn(detailColumn);
    }
  }

  protected onOptionsMenuShow(args: any) {
    var menuEl = ($('.md-overlay-container .md-menu') as any);
    var menuContainer = menuEl.parent();
    var menuBtn = ($(this.element.nativeElement) as any).find('.o-table-menu-button');
    var menuBtnOffset = menuBtn.offset();
    var top = menuBtnOffset.top + menuBtn.outerHeight(true);
    var left = menuBtnOffset.left - menuEl.outerWidth(true) + menuBtn.outerWidth(true);
    menuContainer.css('transform', 'translateX(' + left + 'px) translateY(' + top + 'px)');
  }

  protected parseTableOptions() {
    let tableOptions = [];
    if (this.controls) {
      tableOptions = this.getTableOptions();
      if (tableOptions.length > 0) {
        var table = this.table;
        new ($ as any).fn.dataTable.Buttons(table, {
          buttons: tableOptions
        });
        table.buttons(1, null).container().appendTo(
          ($(table.table().container()) as any).find('.dataTables_top_wrapper .dataTables_hidden_options')
        );
      }
    }
    this.showOptionsButton = (tableOptions.length > 0 || this.headerOptions.length > 0);
  }

  protected initTableAfterViewInit() {
    this.tableHtmlEl = $('#' + this.attr) as any;
    if ((this.tableHtmlEl.length > 0) && (this.tableHtmlEl[0].tagName !== 'TABLE')) {
      this.tableHtmlEl = this.tableHtmlEl.find('table');
    }

    if ((typeof (this.editColumnIndex) === 'undefined') && (typeof (this.detailColumnIndex) === 'undefined')) {
      this.addDefaultRowButtons();
    }
    this.table = this.tableHtmlEl.DataTable(this.dataTableOptions);
    this.parseTableOptions();

    if (typeof (this.state.length) === 'number') {
      this.table.page.len(this.state.length);
    } else {
      this.table.page.len(this.queryRows);
    }

    if (!this.selectAllCheckbox) {

      this.table.on('select', (event: any, dt: Array<any>, type: string, indexes: Array<any>) => {
        if (this.enabled) {
          if (typeof (indexes) !== 'undefined') {
            this.handleSelection(event, dt, type, indexes);
          }
        }
      });

      this.table.on('deselect', (event: any, dt: Array<any>, type: string, indexes: Array<any>) => {
        if (this.enabled) {
          if (typeof (indexes) !== 'undefined') {
            this.handleDeselection(event, dt, type, indexes);
          }
        }
      });

    }

    this.table.on('key', (event, dt, key, cell, originalEvent) => {
      if (this.enabled) {
        let colIndex = cell.index()['column'];
        let colDef = this.table.settings().init().columns[colIndex];
        let colType = colDef.type;
        if (typeof (colDef.component) !== 'undefined') {
          colType = colDef.component.type;
        }
        // hide datepicker when moving with arrows
        if ((37 <= key) && (key <= 40) && (typeof (OTableCellEditorDateComponent.datePicker) !== 'undefined') && (colType !== 'date')) {
          OTableCellEditorDateComponent.datePicker.datepicker('hide');
          OTableCellEditorDateComponent.datePicker = undefined;
        }
      }
    });

    this.table.on('key-focus', (event, dt, cell) => {
      if (this.enabled) {
        // select row
        if (!this.selectAllCheckbox) {
          let indexes = [cell.index()['row']];
          this.table.rows(indexes).select();
        }
        // if cell is editable, create editor
        let cellEl = $(cell.nodes()) as any;
        let colIndex = cell.index()['column'];
        let colDef = this.table.settings().init().columns[colIndex];
        if (this.editOnFocus && colDef.editable && (typeof (colDef.component) !== 'undefined') &&
          (typeof (colDef.component.editor) !== 'undefined')) {
          if (cellEl.hasClass('editable')) {
            colDef.component.editor.handleCellFocus(cellEl, cell.data());
          } else {
            cellEl.removeClass('focus');
          }
        } else if (!this.editOnFocus) {
          cellEl.removeClass('focus');
        }
      }
    });
    this.table.on('key-blur', (event, dt, cell) => {
      if (this.enabled) {
        // if cell is editable, perform insertion
        let colIndex = cell.index()['column'];
        let colDef = this.table.settings().init().columns[colIndex];
        if (this.editOnFocus && colDef.editable && (typeof (colDef.component) !== 'undefined') &&
          (typeof (colDef.component.editor) !== 'undefined')) {
          let cellEl = $(cell.nodes()) as any;
          if (cellEl.hasClass('editable')) {
            colDef.component.editor.handleCellBlur(cellEl);
          } else {
            cellEl.removeClass('focus');
          }
        }
      }
    });
    var self = this;
    this.table.on('draw.dt', () => {
      self.tableHtmlEl.find('tr').off('click');
      self.tableHtmlEl.find('tr').on('click', (event: any) => this.handleClick(event));
      self.tableHtmlEl.find('tr').off('dblclick');
      self.tableHtmlEl.find('tr').on('dblclick', (event: any) => this.handleDoubleClick(event));

      if (this.selectAllCheckbox) {
        self.tableHtmlEl.find('th #select_all').off('click');
        self.tableHtmlEl.find('th #select_all').on('click', (event: any) => this.handleSelectAllClick(event));
        self.tableHtmlEl.find('tbody tr .select-row').off('change');
        self.tableHtmlEl.find('tbody tr .select-row').on('change', (event: any) => this.handleRowCheckboxChange(event));
      }
    });

    this.table.on('order.dt', () => {
      let order = this.table.order();
      if ((this.groupColumnIndex !== -1) && (order[0][0] !== this.groupColumnIndex)) {
        order.unshift([this.groupColumnIndex, this.groupColumnOrder]);
        this.table.order(order);
        this.dataTable.fnDraw();
      }
      this.handleOrderIndex();
      let emptyRow = $('.dataTables_empty') as any;
      if (emptyRow.length > 0) {
        emptyRow.parent().addClass('empty');
      }
    });
    this.table.on('column-visibility.dt', (e, settings, column, state) => {
      this.handleColumnWidth();
      this.handleOrderIndex();
      let resizeButton = $('#' + this.attr + '_wrapper .generic-action-resize') as any;
      if (resizeButton.hasClass('active')) {
        this.initColumnResize();
      }
      this.initColumnGroup();
    });
    this.table.on('length.dt', (e, settings, len) => {
      setTimeout(() => {
        let resizeButton = $('#' + this.attr + '_wrapper .generic-action-resize') as any;
        if (resizeButton.hasClass('active')) {
          this.initColumnResize();
        }
      }, 100);
    });
    this.table.on('search.dt', () => {
      setTimeout(() => {
        let resizeButton = $('#' + this.attr + '_wrapper .generic-action-resize') as any;
        if (resizeButton.hasClass('active')) {
          this.initColumnResize();
        }
      }, 100);
    });

    this.initColumnGroup();
    this.dataTable = this.tableHtmlEl.dataTable();
    if (this.queryOnInit) {
      this.update();
    } else {
      this.initialized = true;
    }
  }

  public registerColumn(column: OTableColumnComponent, index?: number) {
    if (!this.columnComponentsRegistered) {
      this.dataTableOptions.columns = [];

      if (this.selectAllCheckbox) {
        this.dataTableOptions.columns.push({
          'searchable': false,
          'orderable': false,
          'className': 'o-table-column-select-checkbox',
          'render': function (data, type, full, meta) {
            return TABLE_CHECKBOX_TEMPLATE;
          }
        });
      }

      this.columnComponentsRegistered = true;
    }
    let colDef = {
      data: undefined,
      name: undefined,
      component: column,
      title: this.translateService.get(column.title),
      type: 'string',
      className: 'o-table-column',
      defaultContent: '',
      orderable: true,
      searchable: true,
      editable: false,
      visible: true,
      render: (data: any, type: string, item: Object, meta: Object) => column.render(data, item),
      createdCell: (cellElement: any, cellData: any, item: Object, rowIndex: number, colIndex: number) =>
        column.handleCreatedCell($(cellElement) as any, item)
    };
    if (typeof (column.attr) === 'undefined') {
      // column without 'attr' should contain only renderers that do not depend on cell data, but row data (e.g. actions)
      colDef.className += ' o-table-column-action';
      colDef.orderable = false;
      colDef.searchable = false;
    } else {
      // columns with 'attr' are linked to service data
      colDef.data = column.attr;
      colDef.name = column.attr;
      switch (column.type) {
        case 'boolean':
          colDef.className = 'o-table-column o-table-column-boolean';
          colDef.type = 'string';
          break;
        case 'string':
          colDef.className = 'o-table-column o-table-column-string';
          colDef.type = 'string';
          break;
        case 'integer':
        case 'real':
        case 'currency':
          colDef.className = 'o-table-column o-table-column-number';
          colDef.type = 'num';
          break;
        case 'date':
          colDef.className = 'o-table-column o-table-column-date';
          colDef.type = 'timestamp';
          break;
        case 'image':
          colDef.className = 'o-table-column o-table-column-image';
          colDef.type = 'string';
          break;
        default:
          colDef.className = 'o-table-column o-table-column-string';
          colDef.type = 'string';
          break;
      }
      colDef.orderable = column.orderable;
      colDef.searchable = column.searchable;
      colDef.editable = column.editable;
      if (this.editOnFocus && colDef.editable) {
        colDef.className += ' editable';
      }
      colDef.visible = (this.dataVisibleColumns.indexOf(column.attr) !== -1);
    }
    this.dataTableOptions.columns.push(colDef);
  }

  public updateCell(cellElement: any, value: any) {
    let cell = this.table.cell(cellElement);
    if ((value !== cell.data()) && this.dataService && (this.updateMethod in this.dataService) && this.entity &&
      (this.dataKeys.length > 0)) {
      var oldValue = cell.data();
      // persist update
      let colIndex = cell.index()['column'];
      let colDef = this.table.settings().init().columns[colIndex];
      let indexes = [cell.index()['row']];
      let rowDataArray = this.table.rows(indexes).data().toArray();
      if (rowDataArray.length === 1) {
        let rowData = rowDataArray[0];
        console.log('[OTable.updateCell]: before update', rowData);
        let kv = {};
        for (let k = 0; k < this.dataKeys.length; ++k) {
          let key = this.dataKeys[k];
          kv[key] = rowData[key];
        }
        let av = {};
        av[colDef.name] = value;
        this.dataService[this.updateMethod](kv, av, this.entity)
          .subscribe(
          res => {
            if ((typeof (res.code) === 'undefined') ||
              ((typeof (res.code) !== 'undefined') && (res.code === 0))) {
              // set table data
              cell.data(value);
              if (typeof (cellElement.attr('data-order')) !== 'undefined') {
                cellElement.attr('data-order', value);
              }
              console.log('[OTable.updateCell]: after update', rowData);
            } else {
              console.log('[OTable.updateCell]: error', res.code);
              this.dialogService.alert('ERROR', 'MESSAGES.ERROR_UPDATE');
              cell.data(oldValue);
            }
          },
          err => {
            console.log('[OTable.updateCell]: error', err);
            this.dialogService.alert('ERROR', 'MESSAGES.ERROR_UPDATE');
            cell.data(oldValue);
          }
          );
      }
    } else {
      // removing input element
      cell.data(value);
    }
  }

  public updateRow(cellElement: any, av: any) {
    if (typeof (av) !== 'undefined') {
      let rowCurrentData = this.table.row(cellElement).data();
      console.log('[OTable.updateRow]: before update', rowCurrentData);
      let kv = {};
      for (let k = 0; k < this.dataKeys.length; ++k) {
        let key = this.dataKeys[k];
        kv[key] = rowCurrentData[key];
      }
      this.dataService[this.updateMethod](kv, av, this.entity)
        .subscribe(
        res => {
          if ((typeof (res.code) === 'undefined') ||
            ((typeof (res.code) !== 'undefined') && (res.code === 0))) {
            console.log('[OTable.updateRow]: after update', this.table.row(cellElement).data());
          } else {
            console.log('[OTable.updateRow]: error', res.code);
            this.dialogService.alert('ERROR', 'MESSAGES.ERROR_UPDATE');
          }
        },
        err => {
          console.log('[OTable.updateRow]: error', err);
          this.dialogService.alert('ERROR', 'MESSAGES.ERROR_UPDATE');
        }
        );
    }
  }

  protected handleColumnWidth() {
    var fixedWidthColumns = 0;
    fixedWidthColumns += (this.selectAllCheckbox ? 1 : 0);
    var actionColumns = 0;
    actionColumns += (this.editColumnIndex !== -1 ? 1 : 0);
    actionColumns += (this.detailColumnIndex !== -1 ? 1 : 0);
    fixedWidthColumns += actionColumns;
    let columns = $('#' + this.attr + '_wrapper table thead th') as any;
    if (columns.length > 0) {
      let actionsWidth = ((fixedWidthColumns * 50) / ($('#' + this.attr) as any).outerWidth(true)) * 100;
      let width = String((100 - actionsWidth) / ((columns.length - fixedWidthColumns) || 1)) + '%';
      var self = this;

      ($ as any).each(columns, function (i, el) {
        let columnWidth = '0px';
        let isActionColumn = i >= (columns.length - actionColumns);
        if (self.selectAllCheckbox && i === 0) {
          columnWidth = '26px';
        } else if (!isActionColumn) {
          columnWidth = width;
        } else {
          // using width = 2 because padding-left and right is 24 (total width = 50  )
          columnWidth = '2px';
        }
        ($(this) as any).width(columnWidth);
      });
    }
  }

  protected handleOrderIndex() {
    let header = $('#' + this.attr + '_wrapper table thead') as any;
    header.find('.sorting-index').remove();
    let order = this.table.order();
    for (let i = 0; i < order.length; ++i) {
      let orderItem = order[i];
      header.find('th[data-column-index="' + orderItem[0] + '"]').append('<div class="sorting-index">' + (i + 1) + '</div>');
    }
  }

  public select(item: any) {
    this.table.rows().deselect();
    this.selectedItems = [item];
  }

  protected handleSelection(event: any, dt: Array<any>, type: string, indexes: Array<any>) {
    let localStorageState = localStorage.getItem('DataTables' + '_' + this.attr + '_' + this._router.url);
    if (localStorageState) {
      let state = JSON.parse(localStorageState);
      state.selectedIndex = indexes[0];
      localStorage.setItem('DataTables' + '_' + this.attr + '_' + this._router.url, JSON.stringify(state));

      let selection = this.table.rows(indexes).data().toArray();
      for (let i = 0; i < selection.length; ++i) {
        let selected = false;
        for (let j = this.selectedItems.length; j >= 0; --j) {
          if (selection[i] === this.selectedItems[j]) {
            selected = true;
            break;
          }
        }
        if (!selected) {
          this.selectedItems.push(selection[i]);
        }
      }
      let deleteButton = $('#' + this.attr + '_wrapper .generic-action-delete') as any;
      if (this.selectedItems.length > 0) {
        deleteButton.removeClass('disabled');
      } else {
        deleteButton.addClass('disabled');
      }
      ObservableWrapper.callEmit(this.onRowSelected, selection);
    }
  }

  protected handleDeselection(event: any, dt: Array<any>, type: string, indexes: Array<any>) {
    this.lastDeselection = {
      event: event,
      dt: dt,
      type: type,
      indexes: indexes
    };

    let localStorageState = localStorage.getItem('DataTables' + '_' + this.attr + '_' + this._router.url);
    if (localStorageState) {
      let state = JSON.parse(localStorageState);
      delete state.selectedIndex;
      localStorage.setItem('DataTables' + '_' + this.attr + '_' + this._router.url, JSON.stringify(state));
    }

    let selection = this.table.rows(indexes).data().toArray();
    for (let i = 0; i < selection.length; ++i) {
      for (let j = this.selectedItems.length; j >= 0; --j) {
        if (selection[i] === this.selectedItems[j]) {
          this.selectedItems.splice(j, 1);
          break;
        }
      }
    }
    let deleteButton = $('#' + this.attr + '_wrapper .generic-action-delete') as any;
    if (this.selectedItems.length > 0) {
      deleteButton.removeClass('disabled');
    } else {
      deleteButton.addClass('disabled');
    }
    ObservableWrapper.callEmit(this.onRowDelected, selection);
  }

  protected getRouteOfSelectedRow(item: any, modeRoute: any) {
    let route = [];
    // TODO: multiple keys
    let filter = undefined;
    if (typeof (item) === 'object') {
      for (let k = 0; k < this.dataKeys.length; ++k) {
        let key = this.dataKeys[k];
        filter = item[key];
      }
    }
    if (typeof (filter) !== 'undefined') {
      if (modeRoute) {
        route.push(modeRoute);
      }
      route.push(filter);
    }
    return route;
  }

  public viewDetail(item: any) {
    let route = this.getRouteOfSelectedRow(item, this.detailFormRoute);
    if (route.length > 0) {
      this._router.navigate(
        route,
        {
          relativeTo: this.recursiveDetail ? this._actRoute.parent : this._actRoute,
          queryParams: {
            'isdetail': 'true'
          }
        }
      );
    }
  }

  public editDetail(item: any) {
    let route = this.getRouteOfSelectedRow(item, this.editFormRoute);
    if (route.length > 0) {
      route.push('edit');
      this._router.navigate(
        route,
        {
          relativeTo: this.recursiveEdit ? this._actRoute.parent : this._actRoute,
          queryParams: {
            'isdetail': 'true'
          }
        }
      );
    }
  }

  protected handleSelectAllClick(event: any) {
    let headerCheckboxCol = this.tableHtmlEl.find('th.o-table-column-select-checkbox') as any;
    let wasIndeterminate = headerCheckboxCol.hasClass('md-checkbox-indeterminate');

    headerCheckboxCol.attr('class', 'o-table-column-select-checkbox');
    if (event.target.checked) {
      headerCheckboxCol.addClass('md-checkbox-checked md-checkbox-anim-unchecked-checked');
    } else if (wasIndeterminate) {
      headerCheckboxCol.addClass('md-checkbox-anim-indeterminate-unchecked');
    } else {
      headerCheckboxCol.addClass('md-checkbox-anim-checked-unchecked');
    }
    let tableRows = this.table.rows();
    tableRows.nodes().$('input[type="checkbox"].select-row').prop('checked', event.target.checked).change();
  }

  protected handleRowCheckboxChange(event: any) {
    let rowEL = ($(event.target) as any).parents('tr:first');
    let checkBoxColumn = rowEL.find('.o-table-column-select-checkbox:first');
    checkBoxColumn.attr('class', 'o-table-column-select-checkbox');

    let tableRow = this.table.rows(rowEL);

    if (event.target.checked) {
      checkBoxColumn.addClass('md-checkbox-checked md-checkbox-anim-unchecked-checked');
      tableRow.select();
    } else {
      checkBoxColumn.addClass('md-checkbox-anim-checked-unchecked');
      tableRow.deselect();
      var selectAllEL = this.tableHtmlEl.find('th #select_all')[0];
      // If "Select all" control is checked and has 'indeterminate' property
      if (selectAllEL && selectAllEL.checked && ('indeterminate' in selectAllEL)) {
        // Set visual state of "Select all" control as 'indeterminate'
        selectAllEL.indeterminate = true;
        let headerCheckboxCol = this.tableHtmlEl.find('th.o-table-column-select-checkbox');
        headerCheckboxCol.attr('class', 'o-table-column-select-checkbox');
        headerCheckboxCol.addClass('md-checkbox-indeterminate md-checkbox-anim-checked-indeterminate');
      }
    }

    let deleteButton = $('#' + this.attr + '_wrapper .generic-action-delete') as any;
    if (this.table.rows('.selected').nodes().length) {
      deleteButton.removeClass('disabled');
    } else {
      deleteButton.addClass('disabled');
    }
  }

  protected handleClick(event: any) {
    let item = this.table.row(event.target).data();
    ObservableWrapper.callEmit(this.onClick, item);
    let cellEl = $(this.table.cell(event.target).nodes()) as any;
    if (this.enabled && (this.detailMode === 'click') && !cellEl.hasClass('editable')) {
      this.viewDetail(item);
    }
  }

  protected handleDoubleClick(event: any) {
    let item = this.table.row(event.target).data();
    ObservableWrapper.callEmit(this.onClick, item);
    let cellEl = $(this.table.cell(event.target).nodes()) as any;
    cellEl.addClass('noselect');
    if (this.enabled && (this.detailMode === 'doubleclick') && !cellEl.hasClass('editable')) {
      this.viewDetail(item);
    }
    cellEl.removeClass('noselect');
  }

  protected initColumnResize() {

    if (typeof (this.tableHtmlEl) !== 'undefined') {
      let disabledResizeColumns = [];

      if (this.selectAllCheckbox) {
        disabledResizeColumns.push(0);
      }
      if (this.editButtonInRow) {
        disabledResizeColumns.push(this.editColumnIndex);
        if (disabledResizeColumns.indexOf(this.editColumnIndex - 1) === -1) {
          disabledResizeColumns.push(this.editColumnIndex - 1);
        }
      }
      if (this.detailButtonInRow) {
        disabledResizeColumns.push(this.detailColumnIndex);
        if (disabledResizeColumns.indexOf(this.detailColumnIndex - 1) === -1) {
          disabledResizeColumns.push(this.detailColumnIndex - 1);
        }
      }

      ($('#' + this.attr + '_wrapper .JCLRgrips') as any).remove();
      this.tableHtmlEl.colResizable({
        liveDrag: false,
        postbackSafe: false,
        partialRefresh: true,
        minWidth: 50,
        disabledColumns: disabledResizeColumns
        // onResize: (e) => {
        // }*/
      });
    }
  }

  protected initColumnGroup() {
    let header = this.tableHtmlEl.find('th');
    header.on('click', (event: any) => {
      // TODO: only .off this event handler, instead of stopping propagation
      if (event.isPropagationStopped()) {
        return;
      }
      event.stopPropagation();
      let groupButton = $('#' + this.attr + '_wrapper .generic-action-group') as any;
      if (groupButton.hasClass('active')) {
        header.removeClass('group');
        let th = $(event.target) as any;
        let order = this.table.order();
        let columnIndex = parseInt(th.attr('data-column-index'));
        if (this.groupColumnIndex === columnIndex) {
          if ((order[0][0] === this.groupColumnIndex) && (order[0][1] === OTableComponent.TYPE_ASC_NAME)) {
            this.groupColumnOrder = OTableComponent.TYPE_DESC_NAME;
            order[0][1] = this.groupColumnOrder;
            th.addClass('group');
          } else {
            order = order.slice(1);
            this.groupColumnIndex = -1;
          }
        } else {
          if (this.groupColumnIndex !== -1) {
            order = order.slice(1);
          }
          this.groupColumnIndex = columnIndex;
          this.groupColumnOrder = OTableComponent.TYPE_ASC_NAME;
          let orderByGroupColumn = true;
          for (let i = 0; i < order.length; ++i) {
            if (order[i][0] === this.groupColumnIndex) {
              orderByGroupColumn = false;
              break;
            }
          }
          if (orderByGroupColumn) {
            order.unshift([this.groupColumnIndex, this.groupColumnOrder]);
          }
          th.addClass('group');
        }
        this.table.order(order);
        this.dataTable.fnDraw();
        let emptyRow = $('.dataTables_empty') as any;
        if (emptyRow.length > 0) {
          emptyRow.parent().addClass('empty');
        }
      }
    });
  }

  protected update(parentItem: any = undefined) {
    if (this.dataService && (this.queryMethod in this.dataService) && this.entity) {

      if (typeof (this.dataTable) !== 'undefined') {
        this.dataTable.fnClearTable();
      }

      if (this.filterForm && (typeof (parentItem) === 'undefined')) {
        parentItem = {};
        let formComponents = this.form.getComponents();
        if ((this.dataParentKeys.length > 0) && (Object.keys(formComponents).length > 0)) {
          for (let k = 0; k < this.dataParentKeys.length; ++k) {
            let parentKey = this.dataParentKeys[k];
            if (formComponents.hasOwnProperty(parentKey['alias'])) {
              let currentData = formComponents[parentKey['alias']].getValue();
              switch (typeof (currentData)) {
                case 'string':
                  if (currentData.trim().length > 0) {
                    parentItem[parentKey['alias']] = currentData.trim();
                  }
                  break;
                case 'number':
                  if (!isNaN(currentData)) {
                    parentItem[parentKey['alias']] = currentData;
                  }
                  break;
              }
            }
          }
        }
      }

      if ((this.dataParentKeys.length > 0) && (typeof (parentItem) === 'undefined')) {
        this.componentData = [];
        this.dataTable.fnClearTable();
        this.dataTable.fnDraw();
        let emptyRow = $('.dataTables_empty') as any;
        if (emptyRow.length > 0) {
          emptyRow.parent().addClass('empty');
        }
      } else {

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
        console.log('[OTable.update]: filter', filter);

        this.dataService[this.queryMethod](filter, this.dataColumns, this.entity)
          .subscribe(
          res => {

            let data = undefined;
            if (($ as any).isArray(res)) {
              data = res;
            } else if ((res.code === 0) && ($ as any).isArray(res.data)) {
              data = res.data;
            }

            // set table data
            if (($ as any).isArray(data)) {
              this.dataTable.fnClearTable();
              this.componentData = data;
              if (this.componentData.length > 0) {
                this.dataTable.fnAddData(this.componentData);
              }
              this.dataTable.fnDraw();
              let emptyRow = $('.dataTables_empty') as any;
              if (emptyRow.length > 0) {
                emptyRow.parent().addClass('empty');
              }
              if (typeof (this.state.start) === 'number' && typeof (this.state.length) === 'number') {
                this.dataTable.fnPageChange(Math.ceil(this.state.start / this.state.length));
              }
              if (typeof (this.state.selectedIndex) !== 'undefined') {
                this.table.rows(this.state.selectedIndex).select();
              }
              this.state = {};
            } else {
              console.log('[OTable.update]: error code ' + res.code + ' when querying data');
            }

            this.initialized = true;
          },
          err => {
            console.log('[OTable.update]: error', err);
            this.initialized = true;
          }
          );

      }
    }
  }

  public remove(clearSelectedItems: boolean = false) {
    if ((this.dataKeys.length > 0) && (this.selectedItems.length > 0)) {
      this.dialogService.confirm('CONFIRM', 'MESSAGES.CONFIRM_DELETE')
        .then(
        res => {
          if (res === true) {

            if (this.dataService && (this.deleteMethod in this.dataService) && this.entity && (this.dataKeys.length > 0)) {

              let filters = [];
              this.selectedItems.map(item => {
                let kv = {};
                for (let k = 0; k < this.dataKeys.length; ++k) {
                  let key = this.dataKeys[k];
                  kv[key] = item[key];
                }
                filters.push(kv);
              });

              let observable = (Observable as any).from(filters)
                .map(kv => this.dataService[this.deleteMethod](kv, this.entity)).mergeAll();
              observable.subscribe(
                res => {
                  console.log('[OTable.remove]: response', res);
                },
                error => {
                  console.log('[OTable.remove]: error', error);
                  this.dialogService.alert('ERROR', 'MESSAGES.ERROR_DELETE');
                },
                () => {
                  console.log('[OTable.remove]: success');
                  this.update(this.parentItem);
                }
              );

            } else {
              // remove local
              for (let i = 0; i < this.selectedItems.length; ++i) {
                let selectedItem = this.selectedItems[i];
                let selectedItemKv = {};
                for (let k = 0; k < this.dataKeys.length; ++k) {
                  let key = this.dataKeys[k];
                  selectedItemKv[key] = selectedItem[key];
                }
                for (let j = this.componentData.length - 1; j >= 0; --j) {
                  let item = this.componentData[j];
                  let itemKv = {};
                  for (let k = 0; k < this.dataKeys.length; ++k) {
                    let key = this.dataKeys[k];
                    itemKv[key] = item[key];
                  }
                  let found = false;
                  for (let k in selectedItemKv) {
                    if (selectedItemKv.hasOwnProperty(k)) {
                      found = itemKv.hasOwnProperty(k) && (selectedItemKv[k] === itemKv[k]);
                    }
                  }
                  if (found) {
                    this.componentData.splice(j, 1);
                    break;
                  }
                }
              }
              let deleteButton = $('#' + this.attr + '_wrapper .generic-action-delete') as any;
              deleteButton.addClass('disabled');
              this.selectedItems = [];
              this.dataTable.fnClearTable();
              if (this.componentData.length > 0) {
                this.dataTable.fnAddData(this.componentData);
              }
              this.dataTable.fnDraw();
              let emptyRow = $('.dataTables_empty') as any;
              if (emptyRow.length > 0) {
                emptyRow.parent().addClass('empty');
              }
            }

          } else if (clearSelectedItems) {
            this.selectedItems = [];
          }
        }
        );
    }
  }

  protected add() {
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
    let extras = { relativeTo: this._actRoute };
    this._router.navigate(
      route,
      extras
    ).catch(err => {
      console.error(err.message);
    });
  }

  protected getTableOptions() {
    let options = [];
    var self = this;
    // export actions
    if (this.exportButton) {
      options.push({
        extend: 'copyHtml5',
        name: 'copyHtml5',
        text: this.translateService.get('TABLE.BUTTONS.COPY_TO_CLIPBOARD'),
        className: 'export-action',
        exportOptions: {
          columns: ':visible:not(.o-table-select-checkbox)'
        }
      });
      options.push({
        extend: 'print',
        name: 'print',
        text: this.translateService.get('TABLE.BUTTONS.PRINT'),
        className: 'export-action',
        exportOptions: {
          columns: ':visible:not(.o-table-select-checkbox)'
        }
      });
      options.push({
        extend: 'excelHtml5',
        text: 'Excel',
        name: 'excel',
        className: 'export-action',
        filename: this.title ? this.title : '*',
        exportOptions: {
          columns: ':visible:not(.o-table-select-checkbox)'
        }
      });
      options.push({
        extend: 'csvHtml5',
        text: 'CSV',
        name: 'csv',
        className: 'export-action',
        filename: this.title ? this.title : '*',
        fieldSeparator: ',',
        extension: '.csv',
        exportOptions: {
          columns: ':visible:not(.o-table-select-checkbox)'
        }
      });
      options.push({
        extend: 'pdfHtml5',
        text: 'PDF',
        name: 'pdf',
        className: 'export-action',
        filename: this.title ? this.title : '*',
        title: this.title ? this.title : '*',
        orientation: 'portrait',
        pageSize: 'A4',
        exportOptions: {
          columns: ':visible:not(.o-table-select-checkbox)',
          orthogonal: 'export'
        }
      });
      options.push({
        text: this.translateService.get('TABLE.BUTTONS.EXPORT'),
        className: 'generic-action generic-action-export',
        action: () => {
          self.exportButtonAction();
        }
      });
    }

    // group rows
    if (this.columnsGroupButton) {
      options.push({
        text: this.translateService.get('TABLE.BUTTONS.GROUP_ROWS'),
        className: 'generic-action generic-action-group',
        action: () => {
          self.columnsGroupButtonAction();
        }
      });
    }

    // resize columns
    if (this.columnsResizeButton) {
      options.push({
        text: this.translateService.get('TABLE.BUTTONS.RESIZE_COLUMNS'),
        className: 'generic-action generic-action-resize',
        action: () => {
          self.columnsResizeButtonAction();
        }
      });
    }

    // columns visibility option
    if (this.columnsVisibilityButton) {
      let columnsParam = undefined;
      if (this.selectAllCheckbox) {
        columnsParam = ':gt(0)';
      }
      if (this.editButtonInRow) {
        columnsParam += ':not(:nth-child(' + (this.editColumnIndex + 1) + '))';
      }
      if (this.detailButtonInRow) {
        columnsParam += ':not(:nth-child(' + (this.detailColumnIndex + 1) + '))';
      }

      let colVisOptions = {
        extend: 'colvis',
        text: this.translateService.get('TABLE.BUTTONS.COLVIS'),
        className: 'generic-action generic-action-view-column',
        collectionLayout: 'fixed'
      };

      if (typeof columnsParam !== 'undefined') {
        colVisOptions['columns'] = columnsParam;
      }
      options.push(colVisOptions);
    }
    return options;
  }

  protected exportButtonAction() {
    this.showExportOptions = !this.showExportOptions;
  }

  protected columnsGroupButtonAction() {
    let header = this.tableHtmlEl.find('th');
    let groupButton = $('#' + this.attr + '_wrapper .generic-action-group') as any;
    if (groupButton.hasClass('active')) {
      groupButton.removeClass('active');
      header.removeClass('grouping');
      this.dataTable.fnSortOnOff('_all', true);
    } else {
      groupButton.addClass('active');
      header.addClass('grouping');
      this.dataTable.fnSortOnOff('_all', false);
    }
  }

  protected columnsResizeButtonAction() {
    let resizeButton = $('#' + this.attr + '_wrapper .generic-action-resize') as any;
    if (resizeButton.hasClass('active')) {
      resizeButton.removeClass('active');
      ($('#' + this.attr + '_wrapper .JCLRgrips') as any).remove();
    } else {
      resizeButton.addClass('active');
      this.initColumnResize();
    }
  }

  protected columnsVisibilityButtonAction() {
    this.table.buttons('.generic-action-view-column').trigger();
  }

  protected exportAction(buttonName: String) {
    this.table.buttons(buttonName + ':name').trigger();
  }


  protected getTableButtons() {
    let buttons = [];
    let buttonTextClass = this.showHeaderButtonsText ? '': ' hidden-action-text';
    // add
    if (this.insertButton) {
      buttons.push({
        text: this.translateService.get('TABLE.BUTTONS.ADD'),
        className: 'generic-action generic-action-add' + buttonTextClass,
        action: () => {
          this.add();
        }
      });
    }

    // delete
    if (this.deleteButton) {
      buttons.push({
        text: this.translateService.get('TABLE.BUTTONS.DELETE'),
        className: 'generic-action generic-action-delete disabled' + buttonTextClass,
        action: () => {
          this.remove();
        }
      });
    }

    // refresh
    if (this.refreshButton) {
      buttons.push({
        text: this.translateService.get('TABLE.BUTTONS.REFRESH'),
        className: 'generic-action generic-action-refresh' + buttonTextClass,
        action: () => {
          this.update(this.parentItem);
        }
      });
    }

    for (var i = 0; i < this.headerButtons.length; i++) {
      var headerBtn = this.headerButtons[i];
      buttons.push({
        text: this.translateService.get(headerBtn.getText()),
        className: 'custom-generic-action icon-' + headerBtn.getIcon() + buttonTextClass,
        action: () => {
          headerBtn.innerOnClick();
        }

      });
    }
    return buttons;
  }

  protected getLanguageLabels() {
    let labels = {
      'emptyTable': this.translateService.get('TABLE.EMPTY'),
      'info': this.translateService.get('TABLE.INFO'),
      'infoEmpty': this.translateService.get('TABLE.INFO_EMPTY'),
      'infoFiltered': this.translateService.get('TABLE.INFO_FILTERED'),
      'infoPostFix': this.translateService.get('TABLE.INFO_POST_FIX'),
      'lengthMenu': this.translateService.get('TABLE.LENGTH_MENU'),
      'loadingRecords': this.translateService.get('TABLE.LOADING_RECORDS'),
      'processing': this.translateService.get('TABLE.PROCESSING'),
      'search': this.translateService.get('TABLE.SEARCH'),
      'zeroRecords': this.translateService.get('TABLE.ZERO_RECORDS'),
      'paginate': {
        'first': this.translateService.get('TABLE.PAGINATE.FIRST'),
        'last': this.translateService.get('TABLE.PAGINATE.LAST'),
        'next': this.translateService.get('TABLE.PAGINATE.NEXT'),
        'previous': this.translateService.get('TABLE.PAGINATE.PREVIOUS')
      },
      'aria': {
        'sortAscending': this.translateService.get('TABLE.ARIA.SORT_ASCENDING'),
        'sortDescending': this.translateService.get('TABLE.ARIA.SORT_DESCENDING')
      },
      'buttons': {
        'colvis': this.translateService.get('TABLE.BUTTONS.COLVIS'),
        'copyTitle': this.translateService.get('TABLE.BUTTONS.COPY_TITLE'),
        'copySuccess': {
          '_': this.translateService.get('TABLE.BUTTONS.COPY_SUCCESS._'),
          '1': this.translateService.get('TABLE.BUTTONS.COPY_SUCCESS.1')
        }
      },
      'select': {
        'rows': {
          '_': this.translateService.get('TABLE.SELECT.ROWS._'),
          '0': this.translateService.get('TABLE.SELECT.ROWS.0'),
          '1': this.translateService.get('TABLE.SELECT.ROWS.1')
        }
      }
    };
    return labels;
  }

  public setFormComponent(form: OFormComponent) {
    var self = this;
    this.onFormDataSubscribe = this.form.onFormDataLoaded.subscribe(data => {
      self.parentItem = data;
      self.update(data);
    }
    );

    let dataValues = this.form.getDataValues();
    if (dataValues) {
      self.parentItem = dataValues;
      self.update(dataValues);
    } else {
      this.filterForm = true;
    }
    // var self = this;
    // this.form.onFormDataLoaded.subscribe(data => {
    // //  if (self.queryOnBind) {
    //     self.parentItem = data;
    //      self.update(data);
    //       // self.onFormDataBind(data);
    //     // }
    // });
  }

  public isColumnEditable(column: string) {
    return (this.dataEditableColumns.indexOf(column) !== -1);
  }

  public renderRowRenderers(cellElement: any, rowData: any) {
    let currentCols = this.table.settings()[0].aoColumns;
    let rowEl = $(this.table.row(cellElement).nodes()) as any;
    rowEl.removeClass('editRow');
    let rowCellsEl = rowEl.find('td');
    for (let i = 0; i < rowCellsEl.length; ++i) {
      let cellEl = $(rowCellsEl[i]) as any;
      let colIndex = this.table.column(rowCellsEl[i]).index();
      if (colIndex < currentCols.length) {
        let colDef = currentCols[colIndex];
        if (colDef.editable) {
          if (this.editOnFocus) {
            cellEl.addClass('editable');
          }
          let data = rowData[colDef.name];
          this.table.cell(rowCellsEl[i]).data(data);
        }
      }
    }
  }

  public renderRowEditors(cellElement: any) {
    let currentCols = this.table.settings()[0].aoColumns;
    let rowEl = $(this.table.row(cellElement).nodes()) as any;
    rowEl.addClass('editRow');
    let rowCellsEl = rowEl.find('td');
    for (let i = 0; i < rowCellsEl.length; ++i) {
      let cellEl = $(rowCellsEl[i]) as any;
      cellEl.removeClass('editable focus');
      let cellData = this.table.cell(rowCellsEl[i]).data();
      let colIndex = this.table.column(rowCellsEl[i]).index();
      if (colIndex < currentCols.length) {
        let colDef = currentCols[colIndex];
        if (colDef.editable && (typeof (colDef.component) !== 'undefined') &&
          (typeof (colDef.component.editor) !== 'undefined')) {
          colDef.component.editor.createEditorForInsertTable(cellEl, cellData);
        } else {
          //cellEl.html('');
          //cellEl.off();
        }
      } else {
        //cellEl.html('');
        //cellEl.off();
      }
    }
  }

  public getRowEditorsAttrValues(cellElement: any) {
    let rowData = undefined;
    let currentCols = this.table.settings()[0].aoColumns;
    let rowEl = $(this.table.row(cellElement).nodes()) as any;
    let rowCellsEl = rowEl.find('td');
    for (let i = 0; i < rowCellsEl.length; ++i) {
      // let cellEl = $(rowCellsEl[i]) as any;
      let colIndex = this.table.column(rowCellsEl[i]).index();
      if (colIndex < currentCols.length) {
        let colDef = currentCols[colIndex];
        if (colDef.editable && (typeof (colDef.component) !== 'undefined') &&
          (typeof (colDef.component.editor) !== 'undefined')) {
          let cellData = this.table.cell(rowCellsEl[i]).data();
          let newData = colDef.component.editor.getInsertTableValue();
          if (cellData !== newData) {
            if (typeof (rowData) === 'undefined') {
              rowData = {};
            }
            rowData[colDef.name] = newData;
          }
        }
      }
    }
    return rowData;
  }

  public registerHeaderButton(button: OTableButtonComponent) {
    this.headerButtons.push(button);
  }

  public registerHeaderOption(option: OTableOptionComponent) {
    this.headerOptions.push(option);
  }
}

@NgModule({
  declarations: [
    OTableComponent,
    OTableColumnComponent,
    OTableCellRendererActionComponent,
    OTableCellRendererBooleanComponent,
    OTableCellRendererCurrencyComponent,
    OTableCellRendererDateComponent,
    OTableCellRendererImageComponent,
    OTableCellRendererIntegerComponent,
    OTableCellRendererRealComponent,
    OTableCellRendererServiceComponent,
    OTableCellRendererStringComponent,
    OTableCellEditorBooleanComponent,
    OTableCellEditorComboComponent,
    OTableCellEditorDateComponent,
    OTableCellEditorIntegerComponent,
    OTableCellEditorRealComponent,
    OTableCellEditorStringComponent,
    OTableButtonComponent,
    OTableOptionComponent
  ],
  imports: [CommonModule, MdMenuModule, OTranslateModule, MdIconModule],
  exports: [OTableComponent,
    OTableColumnComponent,
    OTableCellRendererActionComponent,
    OTableCellRendererBooleanComponent,
    OTableCellRendererCurrencyComponent,
    OTableCellRendererDateComponent,
    OTableCellRendererImageComponent,
    OTableCellRendererIntegerComponent,
    OTableCellRendererRealComponent,
    OTableCellRendererServiceComponent,
    OTableCellRendererStringComponent,
    OTableCellEditorBooleanComponent,
    OTableCellEditorComboComponent,
    OTableCellEditorDateComponent,
    OTableCellEditorIntegerComponent,
    OTableCellEditorRealComponent,
    OTableCellEditorStringComponent,
    OTableButtonComponent,
    OTableOptionComponent
  ]
})
export class OTableModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OTableModule,
      providers: []
    };
  }
}
