import { Component, OnDestroy, OnInit, Injector, forwardRef, Inject, ComponentFactoryResolver, ComponentFactory, ViewChild, ViewContainerRef, EventEmitter, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { InputConverter } from '../../../decorators';
import {
  OTableCellRendererDateComponent,
  OTableCellRendererCurrencyComponent,
  OTableCellRendererImageComponent,
  OTableCellRendererIntegerComponent,
  OTableCellRendererRealComponent,
  OTableCellRendererBooleanComponent,
  OTableCellRendererPercentageComponent,
  OTableCellRendererActionComponent
} from './cell-renderer/cell-renderer';

import { OTableComponent } from '../o-table.component';
import { Util } from '../../../util/util';

import {
  OTableCellEditorTextComponent,
  OTableCellEditorBooleanComponent,
  OTableCellEditorDateComponent,
  OTableCellEditorIntegerComponent,
  OTableCellEditorRealComponent
} from './cell-editor/cell-editor';

import { DateFilterFunction } from '../../../components/input/date-input/o-date-input.component';
import { SQLTypes } from '../../../util/sqltypes';

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

  'width',

  'class',

  // break-word [no|yes|true|false]: content column can show in multiple lines if it not catch in the cell. Default: no and if content of the cell overflow.
  'breakWord: break-word',

  // async-load [no|yes|true|false]: asynchronous query. Default: no
  'asyncLoad : async-load',

  // sqltype[string]: Data type according to Java standard. See SQLType ngClass. Default: 'OTHER'
  'sqlType: sql-type',

  ...OTableCellRendererBooleanComponent.DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_BOOLEAN,
  ...OTableCellRendererCurrencyComponent.DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_CURRENCY, // includes Integer and Real
  ...OTableCellRendererDateComponent.DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_DATE,
  ...OTableCellRendererImageComponent.DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_IMAGE,
  ...OTableCellRendererActionComponent.DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_ACTION,

  ...OTableCellEditorBooleanComponent.DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_BOOLEAN,
  ...OTableCellEditorDateComponent.DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_DATE,
  ...OTableCellEditorRealComponent.DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_REAL, // includes Integer
  ...OTableCellEditorTextComponent.DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_TEXT
];

export const DEFAULT_OUTPUTS_O_TABLE_COLUMN = [
  ...OTableCellEditorTextComponent.DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_TEXT
];

@Component({
  selector: 'o-table-column',
  templateUrl: './o-table-column.component.html',
  styleUrls: ['./o-table-column.component.scss'],
  inputs: DEFAULT_INPUTS_O_TABLE_COLUMN,
  outputs: DEFAULT_OUTPUTS_O_TABLE_COLUMN,
  host: {
    '[class.columnBreakWord]': 'breakWord'
  }
})
export class OTableColumnComponent implements OnDestroy, OnInit, AfterViewInit {

  public static DEFAULT_INPUTS_O_TABLE_COLUMN = DEFAULT_INPUTS_O_TABLE_COLUMN;
  public static DEFAULT_OUTPUTS_O_TABLE_COLUMN = DEFAULT_OUTPUTS_O_TABLE_COLUMN;

  protected static renderersMapping = {
    'action': OTableCellRendererActionComponent,
    'boolean': OTableCellRendererBooleanComponent,
    'currency': OTableCellRendererCurrencyComponent,
    'date': OTableCellRendererDateComponent,
    'image': OTableCellRendererImageComponent,
    'integer': OTableCellRendererIntegerComponent,
    'percentage': OTableCellRendererPercentageComponent,
    'real': OTableCellRendererRealComponent
  };

  protected static editorsMapping = {
    'boolean': OTableCellEditorBooleanComponent,
    'date': OTableCellEditorDateComponent,
    'integer': OTableCellEditorIntegerComponent,
    'real': OTableCellEditorRealComponent,
    'percentage': OTableCellEditorRealComponent,
    'currency': OTableCellEditorRealComponent,
    'text': OTableCellEditorTextComponent
  };

  public renderer: any;
  public editor: any;

  public type: string;
  public attr: string;
  public title: string;
  public sqlType: string;
  protected _SQLType: number;
  protected _defaultSQLTypeKey: string = 'OTHER';
  protected _orderable: boolean = true;
  protected _searchable: boolean = true;
  @InputConverter()
  public editable: boolean = false;
  public width: string = '';

  /*input renderer date */
  protected format: string;
  /*input renderer integer */
  protected grouping: any = true;
  protected thousandSeparator: string = ',';
  /*input renderer real */
  protected decimalSeparator: string = '.';
  protected decimalDigits: number = 2;
  /*input renderer currency */
  protected currencySymbol: string;
  protected currencySymbolPosition: string;

  /*input renderer boolean */
  protected trueValueType: string;
  protected trueValue: string;
  protected falseValueType: string;
  protected falseValue: string;
  protected booleanType: string = 'boolean';

  /*input image */
  protected imageType: string;
  protected avatar: string;
  protected emptyImage: string;

  /*input renderer action */
  protected icon: string;
  protected action: string;

  /*input editor */
  @InputConverter()
  protected orequired: boolean = false;
  @InputConverter()
  showPlaceHolder: boolean = false;
  olabel: string;

  /*input editor date */
  protected locale: string;
  protected oStartView: 'month' | 'year' = 'month';
  protected oMinDate: string;
  protected oMaxDate: string;
  @InputConverter()
  protected oTouchUi: boolean = false;
  protected oStartAt: string;
  protected filterDate: DateFilterFunction;

  /*input editor integer */
  @InputConverter()
  min: number;
  @InputConverter()
  max: number;
  @InputConverter()
  step: number;

  /*input editor boolean */
  @InputConverter()
  indeterminateOnNull: boolean = false;

  /* output cell editor */
  editionStarted: EventEmitter<Object> = new EventEmitter<Object>();
  editionCancelled: EventEmitter<Object> = new EventEmitter<Object>();
  editionCommitted: EventEmitter<Object> = new EventEmitter<Object>();

  @InputConverter()
  breakWord: boolean = false;
  @InputConverter()
  protected asyncLoad: boolean = false;

  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;

  private subscriptions = new Subscription();

  constructor(
    @Inject(forwardRef(() => OTableComponent)) public table: OTableComponent,
    protected resolver: ComponentFactoryResolver,
    protected injector: Injector
  ) {
    this.table = table;
  }

  ngOnInit() {
    this.grouping = Util.parseBoolean(this.grouping, true);
    this.table.registerColumn(this);
    this.subscriptions.add(this.table.onReinitialize.subscribe(() => this.table.registerColumn(this)));
  }

  ngAfterViewInit(): void {
    this.createRenderer();
    this.createEditor();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  protected createRenderer() {
    if (!Util.isDefined(this.renderer) && Util.isDefined(this.type)) {
      const componentRef = OTableColumnComponent.renderersMapping[this.type];
      if (componentRef !== undefined) {
        let factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(componentRef);
        if (factory) {
          let ref = this.container.createComponent(factory);
          let newRenderer = ref.instance;
          switch (this.type) {
            case 'currency':
              newRenderer.currencySymbol = this.currencySymbol;
              newRenderer.currencySymbolPosition = this.currencySymbolPosition;
              newRenderer.decimalSeparator = this.decimalSeparator;
              newRenderer.decimalDigits = this.decimalDigits;
              newRenderer.grouping = this.grouping;
              newRenderer.thousandSeparator = this.thousandSeparator;
              break;
            case 'date':
              newRenderer.format = this.format;
              break;
            case 'integer':
              newRenderer.grouping = this.grouping;
              newRenderer.thousandSeparator = this.thousandSeparator;
              break;
            case 'boolean':
              newRenderer.trueValueType = this.trueValueType;
              newRenderer.trueValue = this.trueValue;
              newRenderer.falseValueType = this.falseValueType;
              newRenderer.falseValue = this.falseValue;
              newRenderer.booleanType = this.booleanType;
              break;
            case 'real':
            case 'percentage':
              newRenderer.decimalSeparator = this.decimalSeparator;
              newRenderer.decimalDigits = this.decimalDigits;
              newRenderer.grouping = this.grouping;
              newRenderer.thousandSeparator = this.thousandSeparator;
              break;
            case 'image':
              newRenderer.imageType = this.imageType;
              newRenderer.avatar = this.avatar;
              newRenderer.emptyImage = this.emptyImage;
              break;
            case 'action':
              newRenderer.icon = this.icon;
              newRenderer.action = this.action;
              break;
          }
          this.registerRenderer(newRenderer);
        }
      }
    }
  }

  buildCellEditor(type: string, resolver: ComponentFactoryResolver, container: ViewContainerRef, propsOrigin: any) {
    let editor = undefined;
    const componentRef = OTableColumnComponent.editorsMapping[type] || OTableColumnComponent.editorsMapping['text'];
    if (componentRef === undefined) {
      return editor;
    }
    let factory: ComponentFactory<any> = resolver.resolveComponentFactory(componentRef);
    if (factory) {
      let ref = container.createComponent(factory);
      editor = ref.instance;
      if (propsOrigin !== undefined) {
        switch (type) {
          case 'date':
            editor.format = propsOrigin.format;
            editor.locale = propsOrigin.locale;
            editor.oStartView = propsOrigin.oStartView;
            editor.oMinDate = propsOrigin.oMinDate;
            editor.oMaxDate = propsOrigin.oMaxDate;
            editor.oTouchUi = propsOrigin.oTouchUi;
            editor.oStartAt = propsOrigin.oStartAt;
            editor.filterDate = propsOrigin.filterDate;
            break;
          case 'boolean':
            editor.indeterminateOnNull = propsOrigin.indeterminateOnNull;
            editor.trueValue = propsOrigin.trueValue;
            editor.falseValue = propsOrigin.falseValue;
            editor.booleanType = propsOrigin.booleanType;
            break;
          case 'integer':
            editor.min = propsOrigin.min;
            editor.max = propsOrigin.max;
            editor.step = Util.isDefined(propsOrigin.step) ? propsOrigin.step : editor.step;
          case 'percentage':
          case 'currency':
          case 'real':
            editor.min = propsOrigin.min;
            editor.max = propsOrigin.max;
            editor.step = Util.isDefined(propsOrigin.step) ? propsOrigin.step : editor.step;
            break;
          case 'image':
            break;
          default:
            break;
        }
        editor.olabel = propsOrigin.olabel;
        editor.type = propsOrigin.type;
      }
    }
    return editor;
  }

  protected createEditor() {
    if (!Util.isDefined(this.editor) && this.editable) {
      let newEditor = this.buildCellEditor(this.type, this.resolver, this.container, this);
      if (newEditor) {
        newEditor.orequired = this.orequired;
        newEditor.showPlaceHolder = this.showPlaceHolder;
        newEditor.editionStarted = this.editionStarted;
        newEditor.editionCancelled = this.editionCancelled;
        newEditor.editionCommitted = this.editionCommitted;
        this.registerEditor(newEditor);
      }
    }
  }

  public registerRenderer(renderer: any) {
    this.renderer = renderer;
    const oCol = this.table.getOColumn(this.attr);
    if (oCol !== undefined) {
      oCol.renderer = this.renderer;
    }
  }

  public registerEditor(editor: any) {
    this.editor = editor;
    const oCol = this.table.getOColumn(this.attr);
    if (oCol !== undefined) {
      oCol.editor = this.editor;
    }
  }

  static addEditor(type: string, editorClassReference: any) {
    if (!OTableColumnComponent.editorsMapping.hasOwnProperty(type) && Util.isDefined(editorClassReference)) {
      OTableColumnComponent.editorsMapping[type] = editorClassReference;
    }
  }

  set orderable(val: any) {
    this._orderable = typeof val === 'boolean' ? val : Util.parseBoolean(val, true);
    const oCol = this.table.getOColumn(this.attr);
    if (oCol) {
      oCol.orderable = this._orderable;
    }
  }

  get orderable(): any {
    return this._orderable;
  }

  set searchable(val: any) {
    this._searchable = typeof val === 'boolean' ? val : Util.parseBoolean(val, true);
    const oCol = this.table.getOColumn(this.attr);
    if (oCol) {
      oCol.searchable = this._searchable;
    }
  }

  get searchable(): any {
    return this._searchable;
  }

  getSQLType(): number {
    if (!(this.sqlType && this.sqlType.length > 0)) {
      switch (this.type) {
        case 'date':
          this.sqlType = 'TIMESTAMP';
          break;
        case 'integer':
          this.sqlType = 'INTEGER';
          break;
        case 'boolean':
          this.sqlType = 'BOOLEAN';
          break;
        case 'real':
        case 'percentage':
        case 'currency':
          this.sqlType = 'DOUBLE';
          break;
      }
    }
    let sqlt = this.sqlType && this.sqlType.length > 0 ? this.sqlType : this._defaultSQLTypeKey;
    this._SQLType = SQLTypes.getSQLTypeValue(sqlt);
    return this._SQLType;
  }

}
