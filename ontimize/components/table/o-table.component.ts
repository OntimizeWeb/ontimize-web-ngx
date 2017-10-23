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
  ViewChild
} from '@angular/core';

import { InputConverter } from '../../decorators';

import { CommonModule } from '@angular/common';
import { dataServiceFactory } from '../../services/data-service.provider';
import { OntimizeService } from '../../services';
import { OFormComponent } from '../form/o-form.component';
import { OSharedModule } from '../../shared';
import { OServiceComponent } from '../o-service-component.class';
import { CdkTableModule } from "@angular/cdk/table";


import { OTableDataSource } from './o-table.datasource';
import { OTableDao } from './o-table.dao';


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
  'onRowSelected',
  'onRowDeselected',
  'onRowDeleted',
  'onDoubleClick',
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
  visible: boolean
  constructor() { }
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
  }
})


export class OTableComponent extends OServiceComponent implements OnInit, OnDestroy, OnChanges {
  constructor(
    injector: Injector,
    elRef: ElementRef,
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent
  ) {
    super(injector, elRef, form);
  }

  @ViewChild('filter') filter: ElementRef;


  protected visibleColumns: string;
  protected _visibleColumnsArray: Array<string> = [];

  get visibleColumnsArray(): Array<string> {
    return this._visibleColumnsArray
  }
  set visibleColumnsArray(value: Array<string>) {
    this._visibleColumnsArray = value;
  }

  protected _columnsArray: Array<any> = [];
  get columnsArray(): Array<any> {
    return this._columnsArray;
  }
  set columnsArray(value: Array<any>) {
    this._columnsArray = value;
  }


  @InputConverter()
  quickFilter: boolean = true;
  @InputConverter()
  selectAllCheckbox: boolean = true;
  @InputConverter()
  exportButton: boolean = true;
  @InputConverter()
  columnsResizeButton: boolean = true;
  @InputConverter()
  columnsGroupButton: boolean = true;
  @InputConverter()
  pageable: boolean = true;
  @InputConverter()
  showExportOptions: boolean = true;
  @InputConverter()
  columnsVisibilityButton: boolean = true;
  @InputConverter()
  filterCanseSentive: boolean = false;

  public daoTable: OTableDao | null;
  public dataSource: OTableDataSource | null;

  ngOnInit() {

    this.initialize();

  }

  /**
   * Method what initialize vars and configuration 
   */
  initialize(): any {

    super.initialize();

    //if not declare visible-columns then visible-columns is all columns
    if (this.visibleColumns)
      this.visibleColumns.split(";").map(x => this._visibleColumnsArray.push(x));
    else {
      this.visibleColumns = this.columns;
      this.columns.split(";").map(x => this._visibleColumnsArray.push(x));
    }

    if (this.columns)
      this.columns.split(";").map(x => this.registerColumn(x));


    let queryArguments = this.getQueryArguments({});
    let queryMethodName = this.pageable ? this.paginatedQueryMethod : this.queryMethod;
    this.daoTable = new OTableDao(this.injector, this.service, this.entity, queryMethodName, queryArguments);
    this.dataSource = new OTableDataSource(this.daoTable);

    if (this.staticData) {
      this.daoTable.setDataArray(this.staticData);
    } else if (this.queryOnInit) {
      //this.configureService();
      this.daoTable.getQuery();
    }

  }


  /**
   * Store all columns and properties in var columnsArray
   * @param column 
   */
  public registerColumn(column: any) {
    let colDef: OColumn = new OColumn();
    colDef.type = 'string',
      colDef.className = 'o-table-column ' + (column.class || '') + ' ';
    colDef.orderable = true;
    colDef.searchable = true;

    if (typeof (column.attr) === 'undefined') {
      // column without 'attr' should contain only renderers that do not depend on cell data, but row data (e.g. actions)
      colDef.className += ' o-table-column-action ';
      colDef.orderable = true;
      colDef.searchable = true;
      colDef.name = column;
      colDef.attr = column;
      colDef.title = column;

    } else {
      // columns with 'attr' are linked to service data
      colDef.name = column.attr;
      colDef.title = column.title;
      colDef.orderable = column.orderable;
      colDef.searchable = column.searchable;
      colDef.type = column.type
    }
    colDef.visible = (this.visibleColumns.indexOf(colDef.attr) !== -1);

    //find column definition by name
    if (typeof (column.attr) !== 'undefined') {

      var alreadyExisting = this.columnsArray.filter(function (existingColumn) {
        return existingColumn.name === column.attr;
      });
      if (alreadyExisting.length === 1) {
        var replacingIndex = this.columnsArray.indexOf(alreadyExisting[0]);
        this.columnsArray[replacingIndex] = colDef;
      } else if (alreadyExisting.length === 0) {
        this.columnsArray.push(colDef);
      }
    } else {
      this.columnsArray.push(colDef);
    }
    //return colDef;
  }

  ngOnDestroy() {
    // TODO
  }

  ngAfterViewInit() {
    // TODO
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    // TODO
  }
}

@NgModule({
  declarations: [
    OTableComponent
  ],
  imports: [
    CommonModule,
    OSharedModule,
    CdkTableModule

  ],
  exports: [
    OTableComponent
  ]
})
export class OTableModule {
}
