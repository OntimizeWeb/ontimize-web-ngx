import * as $ from 'jquery';
import { Component, OnInit, Inject, Injector, forwardRef, EventEmitter } from '@angular/core';
import { ObservableWrapper } from '../../../util/async';


import { OTableColumnComponent, ITableCellEditor } from '../o-table-column.component';
import { OTableComponent } from '../o-table.component';
import { OntimizeService } from '../../../services';
import { dataServiceFactory } from '../../../services/data-service.provider';
import { Util } from '../../../utils';

export const DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_COMBO = [

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
  selector: 'o-table-cell-editor-combo',
  template: '',
  providers: [
    { provide: OntimizeService, useFactory: dataServiceFactory, deps: [Injector] }
  ],
  inputs: [
    ...DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_COMBO
  ]
})
export class OTableCellEditorComboComponent implements OnInit, ITableCellEditor {

  public static DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_COMBO = DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_COMBO;

  public onFocus: EventEmitter<any> = new EventEmitter();
  public onBlur: EventEmitter<any> = new EventEmitter();
  public onSubmit: EventEmitter<any> = new EventEmitter();

  protected tableColumn: OTableColumnComponent;
  protected insertTableInput: any;
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
  protected dataType: string;

  constructor( @Inject(forwardRef(() => OTableColumnComponent)) tableColumn: OTableColumnComponent,
    protected injector: Injector) {
    this.tableColumn = tableColumn;
    this.tableColumn.registerEditor(this);
    this.componentData = {};
    this.dataType = 'undefined';
  }

  public ngOnInit() {
    if (typeof (this.separator) === 'undefined') {
      this.separator = '';
    }
    if (typeof (this.queryMethod) === 'undefined') {
      this.queryMethod = 'query';
    }
    this.init(undefined);
  }

  public init(parameters: any) {
    if (typeof (parameters) !== 'undefined') {
      if (typeof (parameters.service) !== 'undefined') {
        this.service = parameters.service;
      }
      if (typeof (parameters.entity) !== 'undefined') {
        this.entity = parameters.entity;
      }
      if (typeof (parameters.valueColumn) !== 'undefined') {
        this.valueColumn = parameters.valueColumn;
      }
      if (typeof (parameters.columns) !== 'undefined') {
        this.columns = parameters.columns;
      }
      if (typeof (parameters.visibleColumns) !== 'undefined') {
        this.visibleColumns = parameters.visibleColumns;
      }
      if (typeof (parameters.separator) !== 'undefined') {
        this.separator = parameters.separator;
      }
      if (typeof (parameters.queryMethod) !== 'undefined') {
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
    this.configureService();

    // query service data
    this.queryData();
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

  public getHtml(data: any): string {
    let html = '<select onclick="event.stopPropagation();" ondblclick="event.stopPropagation();">';
    html += '<option value="null"></option>';
    for (let i in this.componentData) {
      html += '<option value="' + i + '">' + String(this.componentData[i]) + '</option>';
    }
    html += '</select>';
    return html;
  }

  public handleCellFocus(cellElement: any, data: any) {
    this.create(cellElement, data);
  }

  public handleCellBlur(cellElement: any) {
    this.performInsertion(cellElement);
  }

  public create(cellElement: any, data: any) {
    let input = cellElement.find('select');
    if (input.length === 0) {
      cellElement.addClass('editing');
      cellElement.html(this.getHtml(data));
      input = cellElement.find('select');
      if (typeof (data) !== 'undefined') {
        this.dataType = typeof (data);
        input.val(data);
      }
      input.bind('change', (e) => {
        ObservableWrapper.callEmit(this.onSubmit, { editor: this });
        this.performInsertion(cellElement);
      });
      input.bind('focus', (e) => {
        ObservableWrapper.callEmit(this.onFocus, { editor: this });
      });
      input.bind('focusout', (e) => {
        ObservableWrapper.callEmit(this.onBlur, { editor: this });
        this.performInsertion(cellElement);
      });
      input.focus();
    }
  }

  public destroy(cellElement: any) {
    let input = cellElement.find('select');
    if (input.length > 0) {
      cellElement.removeClass('editing');
      input.remove();
    }
  }

  public performInsertion(cellElement: any) {
    let input = cellElement.find('select');
    if (input.length > 0) {
      let newValue = input.val();
      if (newValue === 'null') {
        newValue = null;
      } else {
        switch (this.dataType) {
          case 'number':
            newValue = parseInt(newValue);
            break;
        }
      }
      this.destroy(cellElement);
      this.tableColumn.updateCell(cellElement, newValue);
    }
  }

  public createEditorForInsertTable(cellElement: any, data: any) {
    cellElement.html(this.getHtml(data));
    this.insertTableInput = cellElement.find('select');
    if (typeof (data) !== 'undefined') {
      this.dataType = typeof (data);
      this.insertTableInput.val(data);
    }
    this.insertTableInput.bind('change', (e) => {
      ObservableWrapper.callEmit(this.onSubmit, { insertTable: true, editor: this });
    });
    this.insertTableInput.bind('focus', (e) => {
      ObservableWrapper.callEmit(this.onFocus, { insertTable: true, editor: this });
    });
    this.insertTableInput.bind('focusout', (e) => {
      ObservableWrapper.callEmit(this.onBlur, { insertTable: true, editor: this });
    });
  }

  public getInsertTableValue(): any {
    let value = undefined;
    if (typeof (this.insertTableInput) !== 'undefined') {
      value = this.insertTableInput.val();
      if (value === 'null') {
        value = null;
      } else {
        switch (this.dataType) {
          case 'number':
            value = parseInt(value);
            break;
        }
      }
    }
    return value;
  }

  protected queryData() {
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
              if (typeof (key) !== 'undefined') {
                let value = '';
                for (let j = 0; j < this.dataVisibleColumns.length; ++j) {
                  let col = this.dataVisibleColumns[j];
                  if (typeof (item[col]) !== 'undefined') {
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
            console.log('[OTableCellEditorComboComponent.init]: error code ' + res.code + ' when querying data');
          }
        },
        err => {
          console.log('[OTableCellEditorComboComponent.init]: error', err);
        }
        );
    }
  }

}
