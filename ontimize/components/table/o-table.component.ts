import {
  Component, OnInit, OnDestroy, OnChanges, SimpleChange,
  Inject, Injector, ElementRef,
  forwardRef, Optional, EventEmitter, NgModule,
  ModuleWithProviders, ViewEncapsulation, ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputConverter } from '../../decorators';
import { ObservableWrapper } from '../../util/async';
import { RouterModule, NavigationStart, RoutesRecognized } from '@angular/router';
import { OTranslateModule } from '../../pipes/o-translate.pipe';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeAll';
import { MdMenuModule, MdMenuTrigger, MdIconModule, MdProgressCircleModule, MdTabGroup, MdTab } from '@angular/material';

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
import { OntimizeService, MomentService } from '../../services';
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

import { OServiceComponent } from '../o-service-component.class';

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
  'paginationControls : pagination-controls'
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

export class OTableComponent extends OServiceComponent implements OnInit, OnDestroy, OnChanges {

  public static DEFAULT_INPUTS_O_TABLE = DEFAULT_INPUTS_O_TABLE;
  public static DEFAULT_OUTPUTS_O_TABLE = DEFAULT_OUTPUTS_O_TABLE;
  public static DEFAULT_DETAIL_ICON = 'search';

  public static COLUMNS_SEPARATOR = ';';
  public static COLUMNS_ALIAS_SEPARATOR = ':';
  public static OPTIONS_SEPARATOR = ';';
  public static VALUES_SEPARATOR = '=';
  public static TYPE_SEPARATOR = ':';
  public static TYPE_ASC_NAME = 'asc';
  public static TYPE_DESC_NAME = 'desc';
  public static DEFAULT_QUERY_ROWS_MENU = [
    [10, 25, 50, 100, -1],
    [10, 25, 50, 100, 'All']
  ];
  public static ROW_BUTTON_DETAIL = 'DETAIL';
  public static ROW_BUTTON_DELETE = 'DELETE';

  /* Inputs */
  protected insertMethod: string;
  protected updateMethod: string;
  protected visibleColumns: string;
  protected editableColumns: string;
  @InputConverter()
  editOnFocus: boolean = true;
  protected sortColumns: string;
  @InputConverter()
  quickFilter: boolean = true;
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
  insertTable: boolean = false;
  editionMode: string;
  @InputConverter()
  showTableButtonsText: boolean = true;
  @InputConverter()
  selectAllCheckbox: boolean = true;
  @InputConverter()
  singlePageMode: boolean = false;
  @InputConverter()
  paginationControls: boolean = true;
  /* End of Inputs */

  /*parsed inputs variables */
  protected visibleColumnsArray: Array<string>;
  protected editableColumnsArray: Array<string>;
  protected sortColumnsArray: Array<any>;
  protected dataParentKeys: Array<Object>;
  /* end of parsed inputs variables */

  protected initialized: boolean;
  protected momentService: MomentService;

  protected queryRowsMenu: Array<any>;
  protected editColumnIndex: number;
  protected detailColumnIndex: number;
  protected table: any;
  protected tableHtmlEl: any;
  protected dataTable: any;
  protected dataTableOptions: any;
  protected lastDeselection: any;
  protected groupColumnIndex: number;
  protected groupColumnOrder: string;
  protected onRouterNavigateSubscribe: any;
  protected onInsertRowFocusSubscribe: Array<any>;
  protected onInsertRowSubmitSubscribe: any;
  protected headerButtons: Array<OTableButtonComponent>;
  protected headerOptions: Array<OTableOptionComponent>;
  protected showOptionsButton: boolean = true;
  protected showExportOptions: boolean = false;

  protected mdTabGroupContainer: MdTabGroup;
  protected mdTabContainer: MdTab;

  protected pendingQuery: boolean = false;
  protected pendingQueryFilter = undefined;

  public onRowSelected: EventEmitter<any> = new EventEmitter();
  public onRowDeselected: EventEmitter<any> = new EventEmitter();
  public onRowDeleted: EventEmitter<any> = new EventEmitter();
  public onClick: EventEmitter<any> = new EventEmitter();
  public onDoubleClick: EventEmitter<any> = new EventEmitter();
  public onTableDataLoaded: EventEmitter<any> = new EventEmitter();
  public onPaginatedTableDataLoaded: EventEmitter<any> = new EventEmitter();

  protected storedRecordsIndexes: Array<any> = [];
  protected initialColumnsWidths: Array<any> = [];

  @ViewChild(MdMenuTrigger) menuTrigger: MdMenuTrigger;
  private columnWidthHandlerInterval: any;

  private isProgrammaticChange: boolean = false;

  constructor(
    injector: Injector,
    elRef: ElementRef,
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent
  ) {
    super(injector, elRef, form);

    try {
      this.mdTabGroupContainer = this.injector.get(MdTabGroup);
      this.mdTabContainer = this.injector.get(MdTab);
    } catch (error) {
      // Do nothing due to not always is contained on tab.
    }
    this.initialized = false;
    this.momentService = this.injector.get(MomentService);
    this.lastDeselection = undefined;
    this.groupColumnIndex = -1;
    this.groupColumnOrder = OTableComponent.TYPE_ASC_NAME;
    OTableComponent.DEFAULT_QUERY_ROWS_MENU[1][4] = this.translateService.get('TABLE.SHOW_ALL');

    this.headerButtons = [];
    this.headerOptions = [];

    this.onRouterNavigateSubscribe = this.router.events.subscribe(
      route => {
        if ((typeof (this.oattr) === 'undefined') ||
          !(route instanceof NavigationStart || route instanceof RoutesRecognized) ||
          ((route instanceof NavigationStart || route instanceof RoutesRecognized) && (!route.url.startsWith(this.router.url)))) {
          let localStorageState = localStorage.getItem('DataTables' + '_' + this.oattr + '_' + this.router.url);
          if (localStorageState) {
            let state = JSON.parse(localStorageState);
            delete state.start;
            delete state.selectedIndex;
            localStorage.setItem('DataTables' + '_' + this.oattr + '_' + this.router.url, JSON.stringify(state));
          }
        }
      }
    );

    this.onInsertRowFocusSubscribe = [];
    this.onInsertRowSubmitSubscribe = undefined;
    this.elRef.nativeElement.classList.add('o-table');
  }

  onLanguageChangeCallback(res: any) {
    if (this.mdTabContainer === undefined || this.mdTabContainer.content.isAttached) {
      this.reinitializeTable();
    }
  }

  getComponentKey(): string {
    return 'DataTables_' + this.oattr;
  }

  protected reinitializeTable() {
    if (this.dataTable) {
      this.dataTable.fnDestroy();
    }
    this.dataTable = null;
    if (this.dataTableOptions) {
      this.initTableOnInit(this.dataTableOptions.columns);
      this.initTableAfterViewInit();
      if ((typeof (this.table) !== 'undefined') && (this.sortColumnsArray.length > 0)) {
        this.table.order(this.sortColumnsArray);
        this.table.draw();
      }
    }
  }

  ngOnInit(): void {
    this.initialize();
  }

  initialize(): any {

    if (!this.detailButtonInRowIcon) {
      this.detailButtonInRowIcon = OTableComponent.DEFAULT_DETAIL_ICON;
    }

    super.initialize();

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

    this.queryRowsMenu = OTableComponent.DEFAULT_QUERY_ROWS_MENU;
    if (this.queryRowsMenu[0].indexOf(this.queryRows) === -1) {
      for (let i = 0; i < this.queryRowsMenu[0].length; i++) {
        var item = this.queryRowsMenu[0][i];
        if (item > this.queryRows || item === -1) {
          this.queryRowsMenu[0].splice(i, 0, this.queryRows);
          this.queryRowsMenu[1].splice(i, 0, this.queryRows);
          break;
        }
      }
    }

    // get previous position
    let localStorageState = localStorage.getItem('DataTables' + '_' + this.oattr + '_' + this.router.url);
    if (localStorageState) {
      this.state = JSON.parse(localStorageState);
    } else {
      this.state = {};
    }

    this.visibleColumnsArray = Util.parseArray(this.visibleColumns);
    this.editableColumnsArray = Util.parseArray(this.editableColumns);

    //TODO: get default values from ICrudConstants
    if (!this.insertMethod) {
      this.insertMethod = 'insert';
    }
    if (!this.updateMethod) {
      this.updateMethod = 'update';
    }

    if (this.insertButton === undefined) {
      this.insertButton = true;
    }

    if (this.mdTabGroupContainer && this.mdTabContainer) {
      /*
      * When table is contained into tab component, it is necessary to init
      * table component when attached to DOM.
      */
      var self = this;
      this.mdTabGroupContainer.selectChange.subscribe((evt) => {
        var interval = setInterval(function () { timerCallback(evt.tab); }, 100);
        function timerCallback(tab: MdTab) {
          if (tab && tab.content.isAttached) {
            clearInterval(interval);
            if (tab === self.mdTabContainer) {
              if (self.table === undefined) {
                self.reinitializeTable();
              }
              if (self.pendingQuery) {
                self.queryData(self.pendingQueryFilter);
              }
            }
          }
        }

      });
    }
    this.initTableOnInit();
  }

  ngOnDestroy() {
    this.destroy();
  }

  destroy() {
    super.destroy();
    this.onRouterNavigateSubscribe.unsubscribe();
    for (let i = 0; i < this.onInsertRowFocusSubscribe.length; ++i) {
      this.onInsertRowFocusSubscribe[i].unsubscribe();
    }
    if (typeof (this.onInsertRowSubmitSubscribe) !== 'undefined') {
      this.onInsertRowSubmitSubscribe.unsubscribe();
    }
  }

  public ngAfterViewInit() {
    if (this.mdTabContainer === undefined
      || this.mdTabContainer.content.isAttached) {
      this.initTableAfterViewInit();
    }
    if (this.menuTrigger) {
      this.menuTrigger.onMenuOpen.subscribe(args => this.onOptionsMenuShow(args));
    }
  }

  public ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    if ((typeof (changes['data']) !== 'undefined') && (typeof (this.dataTable) !== 'undefined')) {
      this.dataTable.fnClearTable(false);
      this.dataArray = changes['data'].currentValue;
      if (this.dataArray.length > 0) {
        this.dataTable.fnAddData(this.dataArray);
      }
      this.dataTable.fnDraw();
    }
  }

  /**
   *@deprecated
   */
  public refresh() {
    this.reloadData();
  }

  public reloadData() {
    let queryArgs = {
      offset: this.state.queryRecordOffset - this.queryRows,
      length: this.queryRows,
      resultRecordsIndex: this.state.queryRecordOffset - this.queryRows,
      replace: true
    };
    this.queryData(this.parentItem, queryArgs);
  }

  protected initTableOnInit(columns: any = undefined) {
    var self = this;

    let domOption = 'r<"dataTables_fill_remaining"<"o-table-scroll"t>>';
    if (this.paginationControls) {
      domOption += '<"dataTables_pagination_wrapper"pil>';
    }
    if (this.controls) {
      domOption = '<"dataTables_top_wrapper"B<"dataTables_filter_wrapper"<"dataTables_hidden_options">f><"dataTables_options">>' + domOption;
    }

    this.dataTableOptions = {
      data: this.dataArray,
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
        this.handleColumnWidth(settings);
        let controlButtons = $('#' + this.oattr + '_wrapper .generic-action') as any;
        ($ as any).each(controlButtons, function (i, el) {
          ($(this) as any).attr('title', ($(this) as any).find('span').text());
        });

        let customButtons = $('#' + this.oattr + '_wrapper .custom-generic-action') as any;
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

        let filterButton = $('#' + this.oattr + '_wrapper .generic-action-filter') as any;
        let filterInput = ($('#' + this.oattr + '_filter') as any).find('input');
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
        if (this.insertTable && this.oenabled) {
          for (let i = 0; i < this.onInsertRowFocusSubscribe.length; ++i) {
            this.onInsertRowFocusSubscribe[i].unsubscribe();
          }
          this.onInsertRowFocusSubscribe = [];
          if (typeof (this.onInsertRowSubmitSubscribe) !== 'undefined') {
            this.onInsertRowSubmitSubscribe.unsubscribe();
            this.onInsertRowSubmitSubscribe = undefined;
          }

          let tbody = $('#' + this.oattr + '_wrapper table tbody') as any;
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
                        this.loaderSuscription = this.load();
                        this.dataService[this.insertMethod](av, this.entity)
                          .subscribe(
                          res => {
                            if ((typeof (res.code) === 'undefined') ||
                              ((typeof (res.code) !== 'undefined') && (res.code === 0))) {
                              this.queryData(this.parentItem);
                              console.log('[OTable.initTableOnInit]: insert ok', res);
                            } else {
                              console.log('[OTable.initTableOnInit]: error', res.code);
                              this.dialogService.alert('ERROR', 'MESSAGES.ERROR_INSERT');
                            }
                            this.loaderSuscription.unsubscribe();
                          },
                          err => {
                            console.log('[OTable.initTableOnInit]: error', err);
                            this.loaderSuscription.unsubscribe();
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
        if (self.pageable && self.dataArray && self.dataArray.length) {
          self.updatePageableTable(!settings._drawHold);
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
      if (this.selectAllCheckbox) {
        this.dataTableOptions.columns.push({
          searchable: false,
          orderable: false,
          className: 'o-table-column-select-checkbox',
          render: function (data, type, full, meta) {
            return TABLE_CHECKBOX_TEMPLATE;
          }
        });
      }
      // columns defined only with the 'visible-columns' attribute
      for (let i = 0; i < this.visibleColumnsArray.length; ++i) {
        let col = this.visibleColumnsArray[i];
        let colDef = {
          data: col,
          name: col,
          title: this.translateService.get(col),
          className: 'o-table-column',
          defaultContent: '',
          orderable: true,
          searchable: true,
          editable: (this.editableColumnsArray.indexOf(col) !== -1),
          visible: (this.visibleColumnsArray.indexOf(col) !== -1)
        };
        if (this.editOnFocus && colDef.editable) {
          colDef.className += ' editable';
        }
        this.dataTableOptions.columns.push(colDef);
      }
    }

    this.sortColumnsArray = [];
    if (this.sortColumns) {
      let cols = Util.parseArray(this.sortColumns);
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
              this.sortColumnsArray.push([colIndex, sortDirection]);
            }
          }
        }
      }
      if ((typeof (columns) !== 'undefined') && (this.sortColumnsArray.length > 0)) {
        this.dataTableOptions.order = this.sortColumnsArray;
      }
    }
  }

  getColumsNumber(): number {
    return this.dataTableOptions.columns.length;
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
    var menuBtn = ($(this.elRef.nativeElement) as any).find('.o-table-menu-button');
    var menuBtnOffset = menuBtn.offset();
    var top = menuBtnOffset.top + menuBtn.outerHeight(true) - 30;
    var left = menuBtnOffset.left - menuEl.outerWidth(true) + menuBtn.outerWidth(true) - 16;
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
    this.tableHtmlEl = $('#' + this.oattr) as any;
    if ((this.tableHtmlEl.length > 0) && (this.tableHtmlEl[0].tagName !== 'TABLE')) {
      this.tableHtmlEl = this.tableHtmlEl.find('table');
    }

    if ((typeof (this.editColumnIndex) === 'undefined') && (typeof (this.detailColumnIndex) === 'undefined')) {
      this.addDefaultRowButtons();
    }
    this.table = this.tableHtmlEl.DataTable(this.dataTableOptions);
    new ($ as any).fn.dataTable.FixedHeader(this.table, {
      header: true
    });
    this.parseTableOptions();

    if (typeof (this.state.length) === 'number') {
      this.queryRows = this.state.length;
    }
    this.table.page.len(this.queryRows).draw(false);

    if (typeof (this.state.start) === 'number') {
      this.state.queryRecordOffset = this.state.start;
    }

    if (!this.selectAllCheckbox) {

      this.table.off('select').on('select', (event: any, dt: Array<any>, type: string, indexes: Array<any>) => {
        if (this.oenabled) {
          if (typeof (indexes) !== 'undefined') {
            event.preventDefault();
            event.stopPropagation();
            this.handleSelection(event, dt, type, indexes);
          }
        }
      });

      this.table.off('deselect').on('deselect', (event: any, dt: Array<any>, type: string, indexes: Array<any>) => {
        if (this.oenabled) {
          if (typeof (indexes) !== 'undefined') {
            event.preventDefault();
            event.stopPropagation();
            this.handleDeselection(event, dt, type, indexes);
          }
        }
      });

    }

    this.table.off('key').on('key', (event, dt, key, cell, originalEvent) => {
      if (this.oenabled) {
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

    this.table.off('key-focus').on('key-focus', (event, dt, cell) => {
      if (this.oenabled) {
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
    this.table.off('key-blur').on('key-blur', (event, dt, cell) => {
      if (this.oenabled) {
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
    this.table.off('draw.dt').on('draw.dt', () => {
      self.tableHtmlEl.find('tr').off('click').on('click', (event: any) => this.handleClick(event));
      self.tableHtmlEl.find('tr').off('dblclick').on('dblclick', (event: any) => this.handleDoubleClick(event));
      if (this.selectAllCheckbox) {
        self.tableHtmlEl.find('th #select_all').off('click').on('click', (event: any) => this.handleSelectAllClick(event));
        self.tableHtmlEl.find('tbody tr .select-row').off('change').on('change', (event: any) => this.handleRowCheckboxChange(event));
      }
    });

    this.table.off('order.dt').on('order.dt', () => {
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
    this.table.off('column-visibility.dt').on('column-visibility.dt', (e, settings, column, state) => {
      this.handleColumnWidth(settings);
      this.handleOrderIndex();
      let resizeButton = $('#' + this.oattr + '_wrapper .generic-action-resize') as any;
      if (resizeButton.hasClass('active')) {
        this.initColumnResize();
      }
      this.initColumnGroup();
    });

    this.table.off('length.dt').on('length.dt', (e, settings, len) => {
      setTimeout(() => {
        let resizeButton = $('#' + self.oattr + '_wrapper .generic-action-resize') as any;
        if (resizeButton.hasClass('active')) {
          self.initColumnResize();
        }
        if (self.pageable && self.dataArray && self.dataArray.length > 0) {
          let newFirstPageRecord = Math.floor((self.state.queryRecordOffset - self.queryRows) / len) * len;

          self.dataArray = [];
          self.storedRecordsIndexes = [];
          self.queryRows = len;

          let queryArgs = {
            offset: newFirstPageRecord,
            length: self.queryRows
          };
          self.queryData(this.parentItem, queryArgs);
        }
      }, 100);
    });

    this.table.off('search.dt').on('search.dt', () => {
      setTimeout(() => {
        let resizeButton = $('#' + this.oattr + '_wrapper .generic-action-resize') as any;
        if (resizeButton.hasClass('active')) {
          this.initColumnResize();
        }
      }, 100);
    });

    this.initColumnGroup();
    this.dataTable = this.tableHtmlEl.dataTable();
    this.initialized = true;
    if (this.queryOnInit) {
      this.queryData(this.parentItem);
    }
  }

  public setInitialColumnWidth(column: OTableColumnComponent) {
    // let existing: any = this.initialColumnsWidths.filter(
    //   element => element.name === column.getColumnName());
    // if (existing) {
    //   existing.width = column.width;
    // } else {
    this.initialColumnsWidths.push({
      name: column.getColumnName(),
      width: column.width
    });
    // }
  }

  public registerColumn(column: OTableColumnComponent, index?: number) {
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
    if (column.width) {
      this.setInitialColumnWidth(column);
    }

    if (typeof (column.attr) === 'undefined') {
      // column without 'attr' should contain only renderers that do not depend on cell data, but row data (e.g. actions)
      colDef.className += ' o-table-column-action';
      colDef.orderable = false;
      colDef.searchable = false;
      colDef.name = column.generatedAttr;
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
      colDef.visible = (this.visibleColumnsArray.indexOf(column.attr) !== -1);
    }

    //find column definition by name
    if (typeof (column.attr) !== 'undefined') {
      // adding to dataColums for using it in service queries
      if (this.colArray.indexOf(column.attr) === -1) {
        this.colArray.push(column.attr);
      }
      var alreadyExisting = this.dataTableOptions.columns.filter(function (existingColumn) {
        return existingColumn.name === column.attr;
      });
      if (alreadyExisting.length === 1) {
        var replacingIndex = this.dataTableOptions.columns.indexOf(alreadyExisting[0]);
        this.dataTableOptions.columns[replacingIndex] = colDef;
      } else if (alreadyExisting.length === 0) {
        this.dataTableOptions.columns.push(colDef);
      }
    } else {
      this.dataTableOptions.columns.push(colDef);
    }
  }

  public updateCell(cellElement: any, value: any) {
    let cell = this.table.cell(cellElement);
    if ((value !== cell.data()) && this.dataService && (this.updateMethod in this.dataService) && this.entity &&
      (this.keysArray.length > 0)) {
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
        for (let k = 0; k < this.keysArray.length; ++k) {
          let key = this.keysArray[k];
          kv[key] = rowData[key];
        }
        let av = {};
        av[colDef.name] = value;
        this.loaderSuscription = this.load();
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
            this.loaderSuscription.unsubscribe();
          },
          err => {
            console.log('[OTable.updateCell]: error', err);
            this.dialogService.alert('ERROR', 'MESSAGES.ERROR_UPDATE');
            cell.data(oldValue);
            this.loaderSuscription.unsubscribe();
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
      for (let k = 0; k < this.keysArray.length; ++k) {
        let key = this.keysArray[k];
        kv[key] = rowCurrentData[key];
      }
      this.loaderSuscription = this.load();
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
          this.loaderSuscription.unsubscribe();
        },
        err => {
          console.log('[OTable.updateRow]: error', err);
          this.dialogService.alert('ERROR', 'MESSAGES.ERROR_UPDATE');
          this.loaderSuscription.unsubscribe();
        }
        );
    }
  }

  protected handleColumnWidth(settings) {
    var tableEl = ($('#' + this.oattr) as any);
    if (!tableEl.is(':visible')) {
      var self = this;
      if (typeof this.columnWidthHandlerInterval === 'undefined') {
        this.columnWidthHandlerInterval = setInterval(function () {
          if (tableEl.is(':visible')) {
            clearInterval(self.columnWidthHandlerInterval);
            self.columnWidthHandlerInterval = undefined;
            self.handleColumnWidth(settings);
            console.log('columnWidthHandlerInterval');
          }
        }, 250);
      }
      return;
    }
    let api = ($ as any).fn.dataTable.Api(settings);
    let tableColumns = api.columns();
    let columnsNumber = tableColumns[0].length;

    var fixedWidthColumns = 0;
    fixedWidthColumns += (this.selectAllCheckbox ? 1 : 0);
    var actionColumns = 0;
    actionColumns += (this.editColumnIndex !== -1 ? 1 : 0);
    actionColumns += (this.detailColumnIndex !== -1 ? 1 : 0);
    fixedWidthColumns += actionColumns;

    let tableWidth = tableEl.outerWidth(true);
    let actionsWidth = ((fixedWidthColumns * 50) / tableWidth) * 100;

    var self = this;
    var avoidIndex = [];
    let fixedWidths = 0;
    for (var i = 0; i < this.initialColumnsWidths.length; i++) {
      let colObj: any = this.initialColumnsWidths[i];
      let tableCol = api.column(colObj.name + ':name');
      if (tableCol) {
        avoidIndex.push(tableCol.index());
        let header = ($(tableCol.header()) as any);
        header.width(colObj.width);
        fixedWidths += parseInt(colObj.width);
      }
    }

    let remainingColumns = columnsNumber - this.initialColumnsWidths.length - fixedWidthColumns;
    let calcWidth = String((100 - actionsWidth - fixedWidths) / (remainingColumns || 1)) + '%';

    tableColumns.every(function (i) {
      if (avoidIndex.indexOf(i) === -1) {
        let columnWidth = '0px';
        let isActionColumn = (i >= (columnsNumber - actionColumns));
        if (self.selectAllCheckbox && i === 0) {
          columnWidth = '26px';
        } else if (!isActionColumn) {
          columnWidth = calcWidth;
        } else {
          // using width = 2 because padding-left and right is 24 (total width = 50)
          columnWidth = '2px';
        }
        ($(api.columns(i).header()) as any).width(columnWidth);
      }
    });
  }

  protected handleOrderIndex() {
    let header = $('#' + this.oattr + '_wrapper table thead') as any;
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
    let localStorageState = localStorage.getItem('DataTables' + '_' + this.oattr + '_' + this.router.url);
    if (localStorageState) {
      let state = JSON.parse(localStorageState);
      state.selectedIndex = indexes[0];
      localStorage.setItem('DataTables' + '_' + this.oattr + '_' + this.router.url, JSON.stringify(state));

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
      this.updateDeleteButtonState();
      if (!this.isProgrammaticChange) {
        ObservableWrapper.callEmit(this.onRowSelected, selection);
      }
    }
  }

  protected updateDeleteButtonState() {
    let deleteButton = $('#' + this.oattr + '_wrapper .generic-action-delete') as any;
    if (this.selectedItems.length > 0) {
      deleteButton.removeClass('disabled');
    } else {
      deleteButton.addClass('disabled');
    }
  }

  protected handleDeselection(event: any, dt: Array<any>, type: string, indexes: Array<any>) {
    this.lastDeselection = {
      event: event,
      dt: dt,
      type: type,
      indexes: indexes
    };

    let localStorageState = localStorage.getItem('DataTables' + '_' + this.oattr + '_' + this.router.url);
    if (localStorageState) {
      let state = JSON.parse(localStorageState);
      delete state.selectedIndex;
      localStorage.setItem('DataTables' + '_' + this.oattr + '_' + this.router.url, JSON.stringify(state));
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
    this.updateDeleteButtonState();
    if (!this.isProgrammaticChange) {
      ObservableWrapper.callEmit(this.onRowDeselected, selection);
    }
  }

  protected handleSelectAllClick(event: any) {
    this.setSelectAllCheckboxValue(event.target.checked);
  }

  public setSelectAllCheckboxValue(val: boolean) {
    if (this.selectAllCheckbox) {
      let headerCheckboxCol = this.tableHtmlEl.find('th.o-table-column-select-checkbox') as any;
      let wasIndeterminate = headerCheckboxCol.hasClass('md-checkbox-indeterminate');

      headerCheckboxCol.attr('class', 'o-table-column-select-checkbox');
      if (val) {
        headerCheckboxCol.addClass('md-checkbox-checked md-checkbox-anim-unchecked-checked');
      } else if (wasIndeterminate) {
        headerCheckboxCol.addClass('md-checkbox-anim-indeterminate-unchecked');
      } else {
        headerCheckboxCol.addClass('md-checkbox-anim-checked-unchecked');
      }
      var self = this;
      this.table.rows({ filter: 'applied' }).every(function (el) {
        let checkboxEl = self.table.row(el).node().querySelector('input[type="checkbox"].select-row');
        checkboxEl.checked = val;
        ($(checkboxEl) as any).change();
      });
    }
  }

  public selectRowsByData(data: Array<any>, value: boolean = true) {
    this.isProgrammaticChange = true;
    let rowsSelectors = [];
    for (var i = 0; i < data.length; i++) {
      let current = data[i];
      let currentSelector = {};
      this.keysArray.forEach(key => currentSelector[key] = current[key]);
      rowsSelectors.push(currentSelector);
    }
    if (this.table && rowsSelectors.length) {
      var self = this;
      let alterRowIndexes = [];
      this.table.rows({ filter: 'applied' }).eq(0).each(function (index) {
        var row = self.table.row(index);
        var rowData = row.data();
        rowsSelectors.forEach(selectorObj => {
          let props = Object.keys(selectorObj);
          let alterRow = true;
          for (var i = 0; i < props.length; i++) {
            alterRow = alterRow && (selectorObj[props[i]] === rowData[props[i]]);
          }
          if (alterRow && self.selectAllCheckbox) {
            let checkboxEl = row.node().querySelector('input[type="checkbox"].select-row');
            if (checkboxEl) {
              checkboxEl.checked = value;
              ($(checkboxEl) as any).change();
            }
          } else if (alterRow) {
            alterRowIndexes.push(index);
          }
        });
      });
      if (!this.selectAllCheckbox && alterRowIndexes.length) {
        if (value) {
          this.table.rows(alterRowIndexes).select();
        } else {
          this.table.rows(alterRowIndexes).deselect();
        }
      }
    }
    this.isProgrammaticChange = false;
  }

  protected handleRowCheckboxChange(event: any) {
    let rowEL = ($(event.target) as any).parents('tr:first');
    let checkBoxColumn = rowEL.find('.o-table-column-select-checkbox:first');
    checkBoxColumn.attr('class', 'o-table-column-select-checkbox');

    let tableRow = this.table.rows(rowEL);
    let rowData = tableRow.data().toArray()[0];
    if (event.target.checked) {
      checkBoxColumn.addClass('md-checkbox-checked md-checkbox-anim-unchecked-checked');
      tableRow.select();
      this.selectedItems.push(rowData);
    } else {
      checkBoxColumn.addClass('md-checkbox-anim-checked-unchecked');
      tableRow.deselect();
      this.selectedItems.splice(this.selectedItems.indexOf(rowData), 1);
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
    this.updateDeleteButtonState();
    if (!this.isProgrammaticChange && event.target.checked) {
      ObservableWrapper.callEmit(this.onRowSelected, rowData);
    } else if (!this.isProgrammaticChange) {
      ObservableWrapper.callEmit(this.onRowDeselected, rowData);
    }
  }

  protected handleClick(event: any) {
    let item = this.table.row(event.target).data();
    ObservableWrapper.callEmit(this.onClick, item);
    let cellEl = $(this.table.cell(event.target).nodes()) as any;
    if (this.oenabled && (this.detailMode === 'click') && !cellEl.hasClass('editable')) {
      this.viewDetail(item);
    }
  }

  protected handleDoubleClick(event: any) {
    let item = this.table.row(event.target).data();
    ObservableWrapper.callEmit(this.onClick, item);
    let cellEl = $(this.table.cell(event.target).nodes()) as any;
    cellEl.addClass('noselect');
    if (this.oenabled && (this.detailMode === 'doubleclick') && !cellEl.hasClass('editable')) {
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

      ($('#' + this.oattr + '_wrapper .JCLRgrips') as any).remove();
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
    header.off('click').on('click', (event: any) => {
      // TODO: only .off this event handler, instead of stopping propagation
      if (event.isPropagationStopped()) {
        return;
      }
      event.stopPropagation();
      let groupButton = $('#' + this.oattr + '_wrapper .generic-action-group') as any;
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

  /**
    * @deprecated
  */
  update(parentItem: any = undefined, ovrrArgs?: any) {
    this.queryData(parentItem, ovrrArgs);
  }

  queryData(parentItem: any = undefined, ovrrArgs?: any) {
    if (!this.initialized) {
      this.pendingQuery = true;
      this.pendingQueryFilter = parentItem;
      return;
    }
    let queryMethodName = this.pageable ? this.paginatedQueryMethod : this.queryMethod;
    if (this.dataService && (queryMethodName in this.dataService) && this.entity) {
      this.pendingQuery = false;
      this.pendingQueryFilter = undefined;

      if (typeof (this.dataTable) !== 'undefined' && !this.pageable) {
        this.dataTable.fnClearTable(false);
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
        this.dataArray = [];
        this.dataTable.fnClearTable(false);
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
        if (this.querySuscription) {
          this.querySuscription.unsubscribe();
          this.loaderSuscription.unsubscribe();
        }
        this.loaderSuscription = this.load();
        let queryArguments = this.getQueryArguments(filter, ovrrArgs);
        var self = this;
        this.querySuscription = this.dataService[queryMethodName].apply(this.dataService, queryArguments)
          .subscribe(
          res => {
            let data = undefined;
            if (($ as any).isArray(res)) {
              data = res;
            } else if ((res.code === 0) && ($ as any).isArray(res.data)) {
              data = res.data;
              if (self.pageable) {
                self.updatePaginationInfo(res);
              }
            }
            // set table data
            if (($ as any).isArray(data)) {
              self.dataTable.fnClearTable(false);
              if (!self.pageable) {
                self.dataArray = data;
              } else {
                self.setPaginatedTableData(data, ovrrArgs);
              }

              if (self.dataArray.length > 0) {
                self.dataTable.fnAddData(self.dataArray);
              }

              if (self.table && self.pageable) {
                let pagesInfo = self.table.page.info();
                let activePage = pagesInfo.pages > 0 ? (pagesInfo.pages - 1) : 0;
                if (!self.singlePageMode && ovrrArgs && ovrrArgs.hasOwnProperty('resultRecordsIndex')) {
                  activePage = Math.floor((ovrrArgs['resultRecordsIndex'] / self.queryRows));
                }
                self.table.page(activePage).draw(false);
                self.updatePaginationFooterText(true);
              } else {
                self.dataTable.fnDraw();
              }

              let emptyRow = $('.dataTables_empty') as any;
              if (emptyRow.length > 0) {
                emptyRow.parent().addClass('empty');
              }
              // if (typeof (self.state.start) === 'number' && typeof (self.state.length) === 'number') {
              //   let newPage = Math.ceil(self.state.start / self.state.length);
              //   if (self.table && newPage !== self.table.page.info().page) {
              //     self.dataTable.fnPageChange(newPage);
              //   }
              // }
              self.selectedItems = [];

              if (typeof (self.state.selectedIndex) !== 'undefined') {
                let selectedRow = self.table.rows(self.state.selectedIndex);
                let selectedRowData = selectedRow.data().toArray()[0];
                if (self.selectedItems.indexOf(selectedRowData) === -1) {
                  self.selectedItems.push(selectedRowData);
                }
              }
              self.updateDeleteButtonState();
            } else {
              console.log('[OTable.queryData]: error code ' + res.code + ' when querying data');
            }
            self.loaderSuscription.unsubscribe();
            if (self.pageable) {
              ObservableWrapper.callEmit(self.onPaginatedTableDataLoaded, data);
            }
            ObservableWrapper.callEmit(self.onTableDataLoaded, self.dataArray);
          },
          err => {
            console.log('[OTable.queryData]: error', err);
            self.loaderSuscription.unsubscribe();
          }
          );
      }
    }
  }

  protected setPaginatedTableData(data: any, ovrrArgs: any) {
    let parsedDataArray = [];
    if (this.singlePageMode) {
      parsedDataArray = data;
    } else if (ovrrArgs && ovrrArgs.hasOwnProperty('resultRecordsIndex')) {
      let initIndex = ovrrArgs['resultRecordsIndex'];
      let endIndex = (ovrrArgs && ovrrArgs['replace']) ? ovrrArgs['resultRecordsIndex'] + data.length : ovrrArgs['resultRecordsIndex'];
      let removeRowsIdx = [];
      if (ovrrArgs && ovrrArgs['replace']) {
        for (let ri = initIndex; ri < endIndex; ri++) {
          removeRowsIdx.push(ri);
        }
      }
      if (removeRowsIdx.length) {
        this.dataTable.fnDeleteRow(removeRowsIdx, undefined, false);
      }
      parsedDataArray = this.dataArray.slice(0, initIndex).concat(data).concat(this.dataArray.slice(endIndex));
    } else {
      parsedDataArray = this.dataArray.concat(data);
    }
    this.dataArray = parsedDataArray;
  }

  updatePaginationInfo(queryRes: any) {
    super.updatePaginationInfo(queryRes);
    if (!this.singlePageMode) {
      this.storedRecordsIndexes.push({
        start: queryRes.startRecordIndex,
        end: queryRes.startRecordIndex + queryRes.data.length
      });
    }
  }

  protected areRecordsLoaded(startIndex: Number, endIndex: Number): boolean {
    let result = false;
    for (var i = 0; i < this.storedRecordsIndexes.length; i++) {
      var storedStart = this.storedRecordsIndexes[i].start;
      var storedEnd = this.storedRecordsIndexes[i].end;

      if ((startIndex >= storedStart && startIndex <= storedEnd)
        && (endIndex >= storedStart && endIndex <= storedEnd)) {
        return true;
      }
    }
    return result;
  }

  protected updatePaginationFooterText(redraw: any) {
    let tableWrapperEl = this.tableHtmlEl.parents('.dataTables_wrapper:first');
    if (tableWrapperEl.length === 0 || !redraw) {
      return;
    }

    let footerTextEl = tableWrapperEl.find('.dataTables_pagination_wrapper .dataTables_info');
    if (footerTextEl && footerTextEl.length && this.state.queryTotalRecordNumber > 0) {
      let existingText = footerTextEl.text().trim();

      let initIndex = (this.state.queryRecordOffset - this.queryRows) + 1;
      initIndex = initIndex <= 0 ? 1 : initIndex;
      let endIndex = (this.state.queryRecordOffset < this.state.queryTotalRecordNumber) ? (initIndex + this.queryRows - 1) : this.state.queryRecordOffset;

      let newText = initIndex + ' - ' + endIndex + ' ';
      newText += existingText.substring(existingText.search('\d'), existingText.lastIndexOf(' '));
      newText += ' ' + this.state.queryTotalRecordNumber;

      footerTextEl.text(newText);
    }
  }

  protected updatePageableTable(redraw: any) {
    if (!this.table || !this.pageable) {
      return;
    }
    let tableWrapperEl = this.tableHtmlEl.parents('.dataTables_wrapper:first');
    let existingRows = this.dataArray.length;
    if (tableWrapperEl.length === 0 || existingRows === 0) {
      return;
    }
    this.updatePaginationFooterText(redraw);

    var currentPageInfo = this.table.page.info();

    var self = this;
    var tableState = this.state;

    let activateNextBtns = (tableState.queryRecordOffset + self.queryRows <= tableState.queryTotalRecordNumber);
    if (activateNextBtns) {
      let nextBtn = tableWrapperEl.find('.dataTables_pagination_wrapper .next');
      if (nextBtn) {
        nextBtn.removeClass('disabled').off('click').one('click', function () {
          let pagesInfo = self.table.page.info();

          let newStartRecord = Math.max(tableState.queryRecordOffset, pagesInfo.end);
          let newEndRecord = Math.min(newStartRecord + self.queryRows, tableState.queryTotalRecordNumber);
          let queryLength = Math.min(self.queryRows, newEndRecord - newStartRecord);

          let areRecordsLoaded = self.areRecordsLoaded(newStartRecord, newEndRecord);
          if (!areRecordsLoaded) {
            let queryArgs = {
              offset: newStartRecord,
              length: queryLength,
              resultRecordsIndex: Math.min(newStartRecord, self.dataArray.length)
            };
            self.queryData(self.parentItem, queryArgs);
          } else {
            tableState.queryRecordOffset = newEndRecord;
            self.table.page('next').draw(false);
            self.updatePaginationFooterText(true);
          }
        });
      }

      let lastBtn = tableWrapperEl.find('.dataTables_pagination_wrapper .last');
      if (lastBtn) {
        lastBtn.removeClass('disabled').off('click').one('click', function () {
          let lastPageRows = (tableState.queryTotalRecordNumber % self.queryRows) || self.queryRows;
          let newStartRecord = tableState.queryTotalRecordNumber - lastPageRows;
          let newEndRecord = newStartRecord + lastPageRows;
          let areRecordsLoaded = self.areRecordsLoaded(newStartRecord, newEndRecord);
          if (!areRecordsLoaded) {
            let queryArgs = {
              offset: newStartRecord,
              length: lastPageRows
            };
            self.queryData(self.parentItem, queryArgs);
          } else {
            tableState.queryRecordOffset = newEndRecord;
            self.table.page('last').draw(false);
            self.updatePaginationFooterText(true);
          }
        });
      }
    }

    let activatePrevBtns = self.singlePageMode ? tableState.queryRecordOffset > self.queryRows : (currentPageInfo.page > 0 || !self.areRecordsLoaded(0, 0));
    if (activatePrevBtns) {
      let prevBtn = tableWrapperEl.find('.dataTables_pagination_wrapper .previous');
      if (prevBtn) {
        prevBtn.removeClass('disabled').off('click').one('click', function () {
          let pagesInfo = self.table.page.info();

          let newStartRecord = (Math.max(tableState.queryRecordOffset - (pagesInfo.end - pagesInfo.start), pagesInfo.start) - self.queryRows);
          let newEndRecord = newStartRecord + self.queryRows;

          let areRecordsLoaded = self.areRecordsLoaded(newStartRecord, newEndRecord);
          if (!areRecordsLoaded) {
            let queryArgs = {
              offset: newStartRecord,
              length: self.queryRows,
              resultRecordsIndex: Math.min(newStartRecord, self.dataArray.length - (tableState.queryTotalRecordNumber - newEndRecord))
            };
            self.queryData(self.parentItem, queryArgs);
          } else {
            tableState.queryRecordOffset = newEndRecord;
            self.table.page('previous').draw(false);
            self.updatePaginationFooterText(true);
          }
        });
      }

      let firstBtn = tableWrapperEl.find('.dataTables_pagination_wrapper .first');
      if (firstBtn) {
        firstBtn.removeClass('disabled').off('click').one('click', function () {
          let areRecordsLoaded = self.areRecordsLoaded(0, self.queryRows);
          if (!areRecordsLoaded) {
            let queryArgs = {
              offset: 0,
              length: self.queryRows,
              resultRecordsIndex: 0
            };
            self.queryData(self.parentItem, queryArgs);
          } else {
            tableState.queryRecordOffset = self.queryRows;
            self.table.page('first').draw(false);
            self.updatePaginationFooterText(true);
          }
        });
      }
    }
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

              let observable = (Observable as any).from(filters)
                .map(kv => this.dataService[this.deleteMethod](kv, this.entity)).mergeAll();
              observable.subscribe(
                res => {
                  console.log('[OTable.remove]: response', res);
                  ObservableWrapper.callEmit(this.onRowDeleted, this.selectedItems);
                },
                error => {
                  console.log('[OTable.remove]: error', error);
                  this.dialogService.alert('ERROR', 'MESSAGES.ERROR_DELETE');
                },
                () => {
                  console.log('[OTable.remove]: success');
                  this.queryData(this.parentItem);
                }
              );

            } else {
              // remove local
              this.deleteLocalItems();
              this.updateDeleteButtonState();
              this.dataTable.fnClearTable(false);
              if (this.dataArray.length > 0) {
                this.dataTable.fnAddData(this.dataArray);
              }
              this.dataTable.fnDraw();
              let emptyRow = $('.dataTables_empty') as any;
              if (emptyRow.length > 0) {
                emptyRow.parent().addClass('empty');
              }
              ObservableWrapper.callEmit(this.onRowDeleted, this.selectedItems);
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
    let extras = { relativeTo: this.actRoute };
    this.router.navigate(
      route,
      extras
    ).catch(err => {
      console.error(err.message);
    });
  }

  protected getTableOptions() {
    let options = [];
    var self = this;
    var columnsSelector = ':visible:not(.o-table-select-checkbox):not(.o-table-column-action)';
    // export actions
    if (this.exportButton) {
      options.push({
        extend: 'copyHtml5',
        name: 'copyHtml5',
        text: this.translateService.get('TABLE.BUTTONS.COPY_TO_CLIPBOARD'),
        className: 'export-action',
        exportOptions: {
          columns: columnsSelector
        }
      });
      options.push({
        extend: 'print',
        name: 'print',
        text: this.translateService.get('TABLE.BUTTONS.PRINT'),
        className: 'export-action',
        exportOptions: {
          columns: columnsSelector
        }
      });
      options.push({
        extend: 'excelHtml5',
        text: 'Excel',
        name: 'excel',
        className: 'export-action',
        filename: this.title ? this.title : '*',
        exportOptions: {
          columns: columnsSelector
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
          columns: columnsSelector
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
          columns: columnsSelector,
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
      let colVisOptions = {
        extend: 'colvis',
        text: this.translateService.get('TABLE.BUTTONS.COLVIS'),
        className: 'generic-action generic-action-view-column',
        collectionLayout: 'fixed',
        columns: []
      };
      for (var i = 0; i < this.visibleColumnsArray.length; i++) {
        colVisOptions.columns.push(this.visibleColumnsArray[i] + ':name');
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
    let groupButton = $('#' + this.oattr + '_wrapper .generic-action-group') as any;
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
    let resizeButton = $('#' + this.oattr + '_wrapper .generic-action-resize') as any;
    if (resizeButton.hasClass('active')) {
      resizeButton.removeClass('active');
      ($('#' + this.oattr + '_wrapper .JCLRgrips') as any).remove();
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
    let buttonTextClass = this.showTableButtonsText ? '' : ' hidden-action-text';
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
          this.reloadData();
        }
      });
    }
    for (var i = 0; i < this.headerButtons.length; i++) {
      var headerBtn = this.headerButtons[i];
      buttons.push({
        text: this.translateService.get(headerBtn.getLabel()),
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

  public isColumnEditable(column: string) {
    return (this.editableColumnsArray.indexOf(column) !== -1);
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

  public getRowDataFromColumn(tableColumn: OTableColumnComponent) {
    if (tableColumn && tableColumn.cellElement) {
      return this.table.row(tableColumn.cellElement).data();
    }
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
  imports: [CommonModule, MdMenuModule, OTranslateModule, MdIconModule, MdProgressCircleModule, RouterModule],
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
