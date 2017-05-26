import * as $ from 'jquery';
import { Component, OnInit, Inject, Injector, forwardRef } from '@angular/core';


import { OTableColumnComponent, ITableCellRenderer } from '../o-table-column.component';
import { OTableComponent } from '../o-table.component';
import { OntimizeService } from '../../../services';
import { dataServiceFactory } from '../../../services/data-service.provider';
import { Util } from '../../../utils';

export const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_SERVICE = [

  // service [string]: JEE service path. Default: no value.
  'service',

  // query-method [string]: name of the service method to perform queries. Default: query.
  'queryMethod: query-method',

  // entity [string]: entity of the service. Default: no value.
  'entity',

  // value-column [string]: value column (similar to 'cod' attribute of ComboReferenceDataField of classic Ontimize Desktop).
  //  Default: no value.
  'valueColumn: value-column',

  // columns [string]: columns of the entity, separated by ';'. Default: no value.
  'columns',

  // visible-columns [string]: visible columns, separated by ';'. Default: no value.
  'visibleColumns: visible-columns',

  // separator [string]: visible columns separator. Default: no value.
  'separator'

];

@Component({
  selector: 'o-table-cell-renderer-service',
  template: '',
  inputs: [
    ...DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_SERVICE
  ],
  providers: [
    {provide: OntimizeService, useFactory:  dataServiceFactory, deps:[Injector]}
  ]
})
export class OTableCellRendererServiceComponent implements OnInit, ITableCellRenderer {

  public static DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_SERVICE = DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_SERVICE;

  protected service: string;
  protected dataService: any;
  protected componentData: any;
  protected entity: string;
  protected valueColumn: string;
  protected columns: string;
  protected dataColumns: Array<string>;
  protected visibleColumns: string;
  protected dataVisibleColumns: Array<string>;
  protected separator: string;
  protected queryMethod: string;

  constructor( @Inject(forwardRef(() => OTableColumnComponent)) tableColumn: OTableColumnComponent,
    protected injector: Injector) {
    tableColumn.registerRenderer(this);
    this.componentData = {};
  }

  public ngOnInit() {
    if (typeof(this.separator) === 'undefined') {
      this.separator = '';
    }
    if (typeof(this.queryMethod) === 'undefined') {
      this.queryMethod = 'query';
    }
    this.init(undefined);
  }

  public init(parameters: any) {
    if (typeof(parameters) !== 'undefined') {
      if (typeof(parameters.service) !== 'undefined') {
        this.service = parameters.service;
      }
      if (typeof(parameters.entity) !== 'undefined') {
        this.entity = parameters.entity;
      }
      if (typeof(parameters.valueColumn) !== 'undefined') {
        this.valueColumn = parameters.valueColumn;
      }
      if (typeof(parameters.columns) !== 'undefined') {
        this.columns = parameters.columns;
      }
      if (typeof(parameters.visibleColumns) !== 'undefined') {
        this.visibleColumns = parameters.visibleColumns;
      }
      if (typeof(parameters.separator) !== 'undefined') {
        this.separator = parameters.separator;
      }
      if (typeof(parameters.queryMethod) !== 'undefined') {
        this.queryMethod = parameters.queryMethod;
      }
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

    // initialize data service
    this.dataService = this.injector.get(OntimizeService);
    if (Util.isDataService(this.dataService)) {
      let serviceCfg = this.dataService.getDefaultServiceConfiguration(this.service);
      if (this.entity) {
        serviceCfg['entity'] = this.entity;
      }
      this.dataService.configureService(serviceCfg);
    }

    // query service data
    if (this.dataService && (this.queryMethod in this.dataService) && this.entity && this.valueColumn) {
      this.dataService[this.queryMethod](this.entity, {}, this.dataColumns)
        .subscribe(
          res => {
            let data = undefined;
            if (($ as any).isArray(res)) {
              data = res;
            } else if ((res.code === 0) && ($ as any).isArray(res.data)) {
              data = res.data;
            }
            if (($ as any).isArray(data)) {
              for (let i = 0; i < data.length; ++i) {
                let item = data[i];
                let key = item[this.valueColumn];
                if (typeof(key) !== 'undefined') {
                  let value = '';
                  for (let j = 0; j < this.dataVisibleColumns.length; ++j) {
                    let col = this.dataVisibleColumns[j];
                    if (typeof(item[col]) !== 'undefined') {
                      if (j > 0) {
                        value += this.separator;
                      }
                      value += String(item[col]);
                    }
                  }
                  this.componentData[key] = value;
                }
              }
            } else {
              console.log('[OTableCellRendererServiceComponent.init]: error code ' + res.code + ' when querying data');
            }
          },
          err => {
            console.log('[OTableCellRendererServiceComponent.init]: error', err);
          }
        );
    }
  }

  public render(data: any): string {
    return (typeof(this.componentData[data]) !== 'undefined') ? String(this.componentData[data]) : '';
  }

  public handleCreatedCell(cellElement: any, rowData: any) {
    // nothing to do here
  }

}
