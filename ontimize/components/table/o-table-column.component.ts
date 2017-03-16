import { Component, OnInit, Inject, Injector, forwardRef } from '@angular/core';

import { OTableComponent } from './o-table.component';
import { ITableCellRenderer, ITableCellEditor } from '../../interfaces';
import {
  OTableCellRendererStringComponent,
  OTableCellRendererBooleanComponent,
  OTableCellRendererIntegerComponent,
  OTableCellRendererRealComponent,
  OTableCellRendererCurrencyComponent,
  OTableCellRendererDateComponent,
  OTableCellRendererImageComponent,
  OTableCellRendererActionComponent
} from './cell-renderer/cell-renderer';
import {
  OTableCellEditorStringComponent,
  OTableCellEditorBooleanComponent,
  OTableCellEditorIntegerComponent,
  OTableCellEditorRealComponent,
  OTableCellEditorDateComponent
} from './cell-editor/cell-editor';
import { OTranslateService, MomentService, NumberService, CurrencyService } from '../../services';
import { Util } from '../../util/util';

export const DEFAULT_INPUTS_O_TABLE_COLUMN = [

  // attr [string]: column name.
  'attr',

  // title [string]: column title. Default: no value.
  'title',

  // orderable [no|yes]: column can be sorted. Default: yes.
  'orderable',

  // searchable [no|yes]: searchings are performed into column content. Default: yes.
  'searchable',

  // type [boolean|integer|real|currency|date|image]: column type. Default: no value (string).
  'type',

  // editable [no|yes]: column can be edited directly over the table. Default: no.
  'editable',

  // date-model-type [timestamp|string]: if a date column is editable, its model type must be defined to be able to save its value,
  // e.g. classic ontimize server dates come as timestamps (number), but to be able to save them they have to be send as strings with
  // the format 'YYYY-MM-DD HH:mm:ss' (especified in the date-model-format attribute). Default: timestamp.
  'dateModelType: date-model-type',

  // date-model-format [string]: if date model type is string, its date model format should be defined. Default: ISO date.
  'dateModelFormat: date-model-format',

  'width'
];

@Component({
  selector: 'o-table-column',
  templateUrl: 'table/o-table-column.component.html',
  styleUrls: [
    'table/o-table-column.component.css'
  ],
  inputs: [
    ...DEFAULT_INPUTS_O_TABLE_COLUMN,
    ...OTableCellRendererBooleanComponent.DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_BOOLEAN,
    ...OTableCellRendererCurrencyComponent.DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_CURRENCY, // includes Integer and Real
    ...OTableCellRendererDateComponent.DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_DATE,
    ...OTableCellRendererImageComponent.DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_IMAGE,
    ...OTableCellRendererActionComponent.DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_ACTION,
    ...OTableCellEditorDateComponent.DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_DATE
  ]
})
export class OTableColumnComponent implements OnInit {

  public static DEFAULT_INPUTS_O_TABLE_COLUMN = DEFAULT_INPUTS_O_TABLE_COLUMN;

  protected static DEFAULT_DATE_MODEL_TYPE = 'timestamp';
  protected static DEFAULT_DATE_MODEL_FORMAT = 'YYYY-MM-DD HH:mm:ss';

  protected table: OTableComponent;
  protected translateService: OTranslateService;
  protected momentService: MomentService;
  protected numberService: NumberService;
  protected currencyService: CurrencyService;

  protected renderer: ITableCellRenderer = undefined;
  protected editor: ITableCellEditor = undefined;

  public attr: string;
  public title: string;
  public orderable: any;
  public searchable: any;
  public editable: any;
  public type: string;
  protected format: string;
  protected dateModelType: string;
  protected dateModelFormat: string;
  protected trueValueType: string;
  protected trueValue: string;
  protected falseValueType: string;
  protected falseValue: string;
  protected grouping: any;
  protected thousandSeparator: string;
  protected decimalSeparator: string;
  protected decimalDigits: number;
  protected currencySymbol: string;
  protected currencySymbolPosition: string;
  protected imageType: string;
  protected avatar: string;
  protected emptyImage: string;
  protected action: string;
  protected renderType: string;
  protected renderValue: string;

  public generatedAttr: string;
  public width: string;

  public cellData: any;
  public cellElement: any;

  constructor( @Inject(forwardRef(() => OTableComponent)) table: OTableComponent,
    protected injector: Injector) {
    this.table = table;
    this.translateService = this.injector.get(OTranslateService);
    this.momentService = this.injector.get(MomentService);
    this.numberService = this.injector.get(NumberService);
    this.currencyService = this.injector.get(CurrencyService);
  }

  public ngOnInit() {
    this.orderable = Util.parseBoolean(this.orderable, true);
    this.searchable = Util.parseBoolean(this.searchable, true);
    this.editable = (typeof (this.editable) !== 'undefined') ?
      Util.parseBoolean(this.editable, false) :
      this.table.isColumnEditable(this.attr);
    this.grouping = Util.parseBoolean(this.grouping, true);
    if (typeof (this.dateModelType) === 'undefined') {
      this.dateModelType = OTableColumnComponent.DEFAULT_DATE_MODEL_TYPE;
      this.dateModelType = OTableCellEditorDateComponent.DEFAULT_DATE_MODEL_TYPE;
    }
    if (typeof (this.dateModelFormat) === 'undefined') {
      this.dateModelFormat = OTableColumnComponent.DEFAULT_DATE_MODEL_FORMAT;
      this.dateModelFormat = OTableCellEditorDateComponent.DEFAULT_DATE_MODEL_FORMAT;
    }
    if (typeof (this.thousandSeparator) === 'undefined') {
      this.thousandSeparator = this.numberService.thousandSeparator;
    }
    if (typeof (this.decimalSeparator) === 'undefined') {
      this.decimalSeparator = this.numberService.decimalSeparator;
    }
    if (typeof (this.decimalDigits) === 'undefined') {
      this.decimalDigits = this.numberService.decimalDigits;
    }
    if (typeof (this.currencySymbol) === 'undefined') {
      this.currencySymbol = this.currencyService.symbol;
    }
    if (typeof (this.currencySymbolPosition) === 'undefined') {
      this.currencySymbolPosition = this.currencyService.symbolPosition;
    }
    // create renderer
    // create renderer and editor
    if (typeof (this.renderer) === 'undefined') {
      switch (this.type) {
        case 'boolean':
          this.renderer = new OTableCellRendererBooleanComponent(this, this.injector);
          this.renderer.init({
            trueValueType: this.trueValueType,
            trueValue: this.trueValue,
            falseValueType: this.falseValueType,
            falseValue: this.falseValue
          });
          if (this.editable && (typeof (this.editor) === 'undefined')) {
            this.editor = new OTableCellEditorBooleanComponent(this);
          }
          break;
        case 'integer':
          this.renderer = new OTableCellRendererIntegerComponent(this, this.injector);
          this.renderer.init({
            grouping: this.grouping,
            thousandSeparator: this.thousandSeparator
          });
          if (this.editable && (typeof (this.editor) === 'undefined')) {
            this.editor = new OTableCellEditorIntegerComponent(this);
          }
          break;
        case 'real':
          this.renderer = new OTableCellRendererRealComponent(this, this.injector);
          this.renderer.init({
            grouping: this.grouping,
            thousandSeparator: this.thousandSeparator,
            decimalSeparator: this.decimalSeparator,
            decimalDigits: this.decimalDigits
          });
          if (this.editable && (typeof (this.editor) === 'undefined')) {
            this.editor = new OTableCellEditorRealComponent(this);
          }
          break;
        case 'currency':
          this.renderer = new OTableCellRendererCurrencyComponent(this, this.injector);
          this.renderer.init({
            grouping: this.grouping,
            thousandSeparator: this.thousandSeparator,
            decimalSeparator: this.decimalSeparator,
            decimalDigits: this.decimalDigits,
            currencySymbol: this.currencySymbol,
            currencySymbolPosition: this.currencySymbolPosition
          });
          if (this.editable && (typeof (this.editor) === 'undefined')) {
            this.editor = new OTableCellEditorRealComponent(this);
          }
          break;
        case 'date':
          this.renderer = new OTableCellRendererDateComponent(this, this.injector);
          this.renderer.init({
            format: this.format
          });
          if (this.editable && (typeof (this.editor) === 'undefined')) {
            this.editor = new OTableCellEditorDateComponent(this, this.injector);
            this.editor.init({
              dateModelType: this.dateModelType,
              dateModelFormat: this.dateModelFormat,
              rendererFormat: this.format
            });
          }
          break;
        case 'image':
          this.renderer = new OTableCellRendererImageComponent(this);
          this.renderer.init({
            imageType: this.imageType,
            avatar: this.avatar,
            emptyImage: this.emptyImage
          });
          break;
        case 'action':
          this.renderer = new OTableCellRendererActionComponent(this, this.injector);
          this.renderer.init({
            action: this.action,
            renderType: this.renderType,
            renderValue: this.renderValue
          });
          break;
        default:
          this.renderer = new OTableCellRendererStringComponent(this);
          if (this.editable && (typeof (this.editor) === 'undefined')) {
            this.editor = new OTableCellEditorStringComponent(this);
          }
          break;
      }
    }
    if (this.attr === undefined) {
      let columnIndex = this.table.getColumsNumber();
      this.generatedAttr = 'o-table-column-' + columnIndex;
    }
    if (this.width && this.width.length && this.width.endsWith('px')) {
      // using width -= 24 because padding-left and right is 24
      let newWidth = (parseInt(this.width) - 24);
      if (newWidth <= 0) {
        newWidth = 1;
      }
      this.width = newWidth + 'px';
    }
    this.table.registerColumn(this);
  }

  public setWidth(value) {
    this.width = value;
    this.table.setInitialColumnWidth(this);
  }

  public getColumnName() {
    return this.attr || this.generatedAttr;
  }

  public registerRenderer(renderer: ITableCellRenderer) {
    this.renderer = renderer;
  }

  public registerEditor(editor: ITableCellEditor) {
    this.editor = editor;
  }

  public render(cellData: any, rowData: any) {
    this.cellData = cellData;
    return this.renderer.render(cellData, rowData);
  }

  public handleCreatedCell(cellElement: any, rowData: any) {
    this.cellElement = cellElement;
    this.renderer.handleCreatedCell(cellElement, rowData);
  }

  public updateCell(cellElement: any, value: any) {
    this.table.updateCell(cellElement, value);
  }

  public updateRow(cellElement: any, av: any) {
    this.table.updateRow(cellElement, av);
  }

  public viewDetail(item: any) {
    this.table.viewDetail(item);
  }

  public editDetail(item: any) {
    this.table.editDetail(item);
  }

  public remove(item: any) {
    this.table.select(item);
    this.table.remove(true);
  }

  public renderRowRenderers(cellElement: any, rowData: any) {
    this.table.renderRowRenderers(cellElement, rowData);
  }

  public renderRowEditors(cellElement: any) {
    this.table.renderRowEditors(cellElement);
  }

  public getRowEditorsAttrValues(cellElement: any) {
    return this.table.getRowEditorsAttrValues(cellElement);
  }

  public getRowData() {
    if (!this.table || !this.cellElement) {
      return undefined;
    }
    return this.table.getRowDataFromColumn(this);
  }

}
