import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  EventEmitter,
  forwardRef,
  Inject,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { Subscription } from 'rxjs';

import { InputConverter } from '../../../decorators/input-converter';
import { OTableColumn } from '../../../interfaces/o-table-column.interface';
import { OPercentageValueBaseType } from '../../../pipes/o-percentage.pipe';
import { DateFilterFunction } from '../../../types/date-filter-function.type';
import { ErrorData } from '../../../types/error-data.type';
import { Expression } from '../../../types/expression.type';
import { ODateValueType } from '../../../types/o-date-value.type';
import { Codes } from '../../../util/codes';
import { SQLTypes } from '../../../util/sqltypes';
import { Util } from '../../../util/util';
import { OTableComponent } from '../o-table.component';
import { editorsMapping, O_TABLE_CELL_EDITORS_INPUTS, O_TABLE_CELL_EDITORS_OUTPUTS } from './cell-editor/cell-editor';
import {
  O_TABLE_CELL_RENDERERS_INPUTS,
  O_TABLE_CELL_RENDERERS_OUTPUTS,
  renderersMapping
} from './cell-renderer/cell-renderer';

export const DEFAULT_INPUTS_O_TABLE_COLUMN = [

  // attr [string]: column name.
  'attr',

  // title [string]: column title. Default: no value.
  'title',

  // title-align [start | center | end]: column title alignment. Default: center.
  'titleAlign: title-align',

  // content-align [start | center | end]: column content alignment.
  'contentAlign: content-align',

  // orderable [no|yes]: column can be sorted. Default: yes.
  'orderable',

  // searchable [no|yes]: searchings are performed into column content. Default: yes.
  'searchable',

  // groupable [no|yes|true|false]: Indicates whether or not the column can be groupable
  'groupable',

  // type [boolean|integer|real|currency|date|image]: column type. Default: no value (string).
  'type',

  // editable [no|yes]: column can be edited directly over the table. Default: no.
  'editable',

  'width',

  // only in pixels
  'minWidth: min-width',

  // only in pixels
  'maxWidth: max-width',

  // async-load [no|yes|true|false]: asynchronous query. Default: no
  'asyncLoad : async-load',

  // sqltype[string]: Data type according to Java standard. See SQLType class. Default: 'OTHER'
  'sqlType: sql-type',

  'tooltip',

  'tooltipValue: tooltip-value',

  'tooltipFunction: tooltip-function',

  'multiline',

  'resizable',

  'filterExpressionFunction: filter-expression-function',

  'class',

  'angularValidatorsFn: validators',

  'angularValidatorsFnErrors: validators-errors',

  'angularAsyncValidatorsFn: async-validators',

  ...O_TABLE_CELL_RENDERERS_INPUTS,
  ...O_TABLE_CELL_EDITORS_INPUTS
];

export const DEFAULT_OUTPUTS_O_TABLE_COLUMN = [
  ...O_TABLE_CELL_RENDERERS_OUTPUTS,
  ...O_TABLE_CELL_EDITORS_OUTPUTS
];

@Component({
  selector: 'o-table-column',
  templateUrl: './o-table-column.component.html',
  styleUrls: ['./o-table-column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: DEFAULT_INPUTS_O_TABLE_COLUMN,
  outputs: DEFAULT_OUTPUTS_O_TABLE_COLUMN
})
export class OTableColumnComponent implements OTableColumn, OnDestroy, OnInit, AfterViewInit {

  public renderer: any;
  public editor: any;

  public type: string;
  public attr: string;
  public title: string;
  public titleAlign: string;
  public contentAlign: 'start' | 'center' | 'end';
  public sqlType: string;
  protected _SQLType: number;
  protected _defaultSQLTypeKey: string = 'OTHER';
  protected _orderable: boolean;
  protected _resizable: boolean;
  protected _searchable: boolean = true;
  protected _groupable: boolean;
  @InputConverter()
  public editable: boolean = false;
  public width: string;
  public minWidth: string;
  public maxWidth: string;
  @InputConverter()
  public tooltip: boolean = false;
  tooltipValue: string;
  tooltipFunction: (rowData: any) => any;
  public class: string;

  set multiline(val: boolean) {
    val = Util.parseBoolean(String(val));
    this._multiline = val;
  }
  get multiline(): boolean {
    return this._multiline;
  }
  protected _multiline: boolean = false;

  public angularValidatorsFn: ValidatorFn[] = [];
  public angularValidatorsFnErrors: ErrorData[] = [];

  public angularAsyncValidatorsFn: AsyncValidatorFn[] = [];

  filterExpressionFunction: (columnAttr: string, quickFilter?: string) => Expression;

  /* input renderer base */
  public _filterSource: 'render' | 'data' | 'both' = 'render';
  public filterFunction: (cellValue: any, rowValue: any, quickFilter?: string) => boolean;
  /* input renderer date */
  protected format: string;
  /* input renderer integer */
  protected grouping: any = true;
  protected thousandSeparator: string = ',';
  /* input renderer real */
  protected decimalSeparator: string = '.';

  /* input renderer currency */
  protected currencySymbol: string;
  protected currencySymbolPosition: string;

  /* input renderer boolean */
  protected trueValue: any;
  protected falseValue: any;
  protected renderTrueValue: any;
  protected renderFalseValue: any;
  protected renderType: string = 'string';
  protected booleanType: string = 'boolean';

  /* input image */
  protected imageType: string;
  protected avatar: string;
  protected emptyImage: string;

  /* input renderer action */
  protected icon: string;
  protected action: string;
  protected text: string;
  protected iconPosition: string;

  /* input renderer service */
  protected entity: string;
  protected service: string;
  protected columns: string;
  protected valueColumn: string;
  protected parentKeys: string;
  protected queryMethod: string = Codes.QUERY_METHOD;
  protected serviceType: string;
  @InputConverter()
  protected translate: boolean = false;
  /* input renderer translate */
  protected translateArgsFn: (rowData: any) => any[];
  /* input time */
  oDateFormat = 'L';
  oHourFormat = 24;

  /* input renderer percentage */
  valueBase: OPercentageValueBaseType = 1;

  /* input editor */
  @InputConverter()
  protected orequired: boolean = false;
  @InputConverter()
  showPlaceHolder: boolean = false;
  olabel: string;
  @InputConverter()
  updateRecordOnEdit: boolean = true;
  @InputConverter()
  showNotificationOnEdit: boolean = false;

  /* input editor date */
  protected locale: string;
  protected oStartView: 'month' | 'year' = 'month';
  protected oMinDate: string;
  protected oMaxDate: string;
  @InputConverter()
  protected oTouchUi: boolean = false;
  protected oStartAt: string;
  protected filterDate: DateFilterFunction;
  protected dateValueType: ODateValueType = 'timestamp';

  /* input editor integer */
  @InputConverter()
  min: number;
  @InputConverter()
  max: number;
  @InputConverter()
  step: number;
  @InputConverter()
  minDecimalDigits: number = 2;
  @InputConverter()
  maxDecimalDigits: number = 2;

  /* input editor boolean */
  @InputConverter()
  indeterminateOnNull: boolean = false;
  @InputConverter()
  autoCommit: boolean;

  /* output cell renderer action */
  onClick: EventEmitter<object> = new EventEmitter<object>();

  /* output cell editor */
  editionStarted: EventEmitter<object> = new EventEmitter<object>();
  editionCancelled: EventEmitter<object> = new EventEmitter<object>();
  editionCommitted: EventEmitter<object> = new EventEmitter<object>();
  onPostUpdateRecord: EventEmitter<object> = new EventEmitter<object>();

  @InputConverter()
  asyncLoad: boolean = false;

  @ViewChild('container', { read: ViewContainerRef, static: true })
  container: ViewContainerRef;

  private subscriptions = new Subscription();

  constructor(
    @Inject(forwardRef(() => OTableComponent)) public table: OTableComponent,
    protected resolver: ComponentFactoryResolver,
    protected injector: Injector
  ) {
  }

  static addEditor(type: string, editorClassReference: any) {
    if (!editorsMapping.hasOwnProperty(type) && Util.isDefined(editorClassReference)) {
      editorsMapping[type] = editorClassReference;
    }
  }

  ngOnInit() {
    this.grouping = Util.parseBoolean(this.grouping, true);
    this.titleAlign = this.parseTitleAlign();
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

  parseTitleAlign(): string {
    const align = (this.titleAlign || '').toLowerCase();
    return Codes.AVAILABLE_COLUMN_TITLE_ALIGNS.indexOf(align) !== -1 ? align : undefined;
  }

  get originalWidth() {
    let originalWidth = this.width;
    const pxVal = Util.extractPixelsValue(originalWidth);
    if (Util.isDefined(pxVal)) {
      originalWidth = pxVal + '';

    }
    return originalWidth;
  }

  protected createRenderer(): void {
    if (!Util.isDefined(this.renderer) && Util.isDefined(this.type)) {
      const componentRef = renderersMapping[this.type];
      if (componentRef !== undefined) {
        const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(componentRef);
        if (factory) {
          const ref = this.container.createComponent(factory);
          const newRenderer = ref.instance;
          newRenderer.filterSource = this.filterSource;
          newRenderer.filterFunction = this.filterFunction;
          switch (this.type) {
            case 'currency':
              newRenderer.currencySymbol = this.currencySymbol;
              newRenderer.currencySymbolPosition = this.currencySymbolPosition;
              newRenderer.decimalSeparator = this.decimalSeparator;
              newRenderer.minDecimalDigits = this.minDecimalDigits;
              newRenderer.maxDecimalDigits = this.maxDecimalDigits;
              newRenderer.grouping = this.grouping;
              newRenderer.thousandSeparator = this.thousandSeparator;
              break;
            case 'date':
              newRenderer.format = this.format;
              break;
            case 'time':
              newRenderer.format = this.format;
              break;
            case 'integer':
              newRenderer.grouping = this.grouping;
              newRenderer.thousandSeparator = this.thousandSeparator;
              break;
            case 'boolean':
              newRenderer.trueValue = this.trueValue;
              newRenderer.falseValue = this.falseValue;
              newRenderer.renderTrueValue = this.renderTrueValue;
              newRenderer.renderFalseValue = this.renderFalseValue;
              newRenderer.renderType = this.renderType;
              newRenderer.booleanType = this.booleanType;
              break;
            case 'percentage':
              newRenderer.valueBase = this.valueBase;
            // eslint-disable-next-line no-fallthrough
            case 'real':
              newRenderer.decimalSeparator = this.decimalSeparator;
              newRenderer.minDecimalDigits = this.minDecimalDigits;
              newRenderer.maxDecimalDigits = this.maxDecimalDigits;
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
              newRenderer.text = this.text;
              newRenderer.iconPosition = this.iconPosition;
              newRenderer.onClick = this.onClick;
              break;
            case 'service':
              newRenderer.entity = this.entity;
              newRenderer.service = this.service;
              newRenderer.columns = this.columns;
              newRenderer.valueColumn = this.valueColumn;
              newRenderer.parentKeys = this.parentKeys;
              newRenderer.queryMethod = this.queryMethod;
              newRenderer.serviceType = this.serviceType;
              newRenderer.translate = this.translate;
              break;
            case 'translate':
              newRenderer.translateArgsFn = this.translateArgsFn;
              break;
          }
          this.registerRenderer(newRenderer);
        }
      }
    }
  }

  buildCellEditor(type: string, resolver: ComponentFactoryResolver, container: ViewContainerRef, propsOrigin: any, registerInColumn: boolean = true) {
    let editor;
    const componentRef = editorsMapping[type] || editorsMapping.text;
    if (componentRef === undefined) {
      return editor;
    }
    const factory: ComponentFactory<any> = resolver.resolveComponentFactory(componentRef);
    if (factory) {
      const ref = container.createComponent(factory);
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
            editor.dateValueType = propsOrigin.dateValueType;
            break;
          case 'time':
            editor.oDateFormat = propsOrigin.oDateFormat;
            editor.oHourFormat = propsOrigin.oHourFormat;
            editor.oDateLocale = propsOrigin.oDateLocale;
            editor.oMinDate = propsOrigin.oMinDate;
            editor.oMaxDate = propsOrigin.oMaxDate;

            editor.oTouchUi = propsOrigin.oTouchUi;
            editor.oDateStartAt = propsOrigin.oDateStartAt;
            editor.oDateTextInputEnabled = propsOrigin.oDateTextInputEnabled;

            editor.oHourMin = propsOrigin.oHourMin;
            editor.oHourMax = propsOrigin.oHourMax;
            editor.oHourTextInputEnabled = propsOrigin.oHourTextInputEnabled;
            editor.oHourPlaceholder = propsOrigin.oHourPlaceholder;
            editor.oDatePlaceholder = propsOrigin.oDatePlaceholder;
            break;
          case 'boolean':
            editor.booleanType = propsOrigin.booleanType;
            editor.indeterminateOnNull = propsOrigin.indeterminateOnNull;
            editor.autoCommit = propsOrigin.autoCommit;
            editor.trueValue = propsOrigin.trueValue;
            editor.falseValue = propsOrigin.falseValue;
            break;
          case 'integer':
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
      editor.registerInColumn = registerInColumn;
    }
    return editor;
  }

  protected createEditor() {
    if (!Util.isDefined(this.editor) && this.editable) {
      const newEditor = this.buildCellEditor(this.type, this.resolver, this.container, this);
      if (newEditor) {
        newEditor.orequired = this.orequired;
        newEditor.showPlaceHolder = this.showPlaceHolder;
        newEditor.updateRecordOnEdit = this.updateRecordOnEdit;
        newEditor.showNotificationOnEdit = this.showNotificationOnEdit;
        newEditor.editionStarted = this.editionStarted;
        newEditor.editionCancelled = this.editionCancelled;
        newEditor.editionCommitted = this.editionCommitted;
        newEditor.onPostUpdateRecord = this.onPostUpdateRecord;
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
    this.renderer.initialize();
  }

  public registerEditor(editor: any) {
    this.editor = editor;
    const oCol = this.table.getOColumn(this.attr);
    if (oCol !== undefined) {
      oCol.editor = this.editor;
    }
    this.editor.initialize();
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

  set resizable(val: any) {
    this._resizable = typeof val === 'boolean' ? val : Util.parseBoolean(val, true);
    const oCol = this.table.getOColumn(this.attr);
    if (oCol) {
      oCol.resizable = this._resizable;
    }
  }

  get resizable(): any {
    return this._resizable;
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

  set groupable(val: any) {
    this._groupable = typeof val === 'boolean' ? val : Util.parseBoolean(val, true);
    const oCol = this.table.getOColumn(this.attr);
    if (oCol) {
      oCol.groupable = this._groupable;
    }
  }

  get groupable(): any {
    return this._groupable;
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
    const sqlt = this.sqlType && this.sqlType.length > 0 ? this.sqlType : this._defaultSQLTypeKey;
    this._SQLType = SQLTypes.getSQLTypeValue(sqlt);
    return this._SQLType;
  }

  set filterSource(val: string) {
    const lowerVal = (val || '').toLowerCase();
    this._filterSource = (lowerVal === 'render' || lowerVal === 'data' || lowerVal === 'both') ? lowerVal : 'render';
  }

  get filterSource(): string {
    return this._filterSource;
  }
}
