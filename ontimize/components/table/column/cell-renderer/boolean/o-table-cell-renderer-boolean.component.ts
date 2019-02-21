import { Component, Injector, ViewChild, TemplateRef, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { OTranslateService } from '../../../../../services';
import { Util } from '../../../../../utils';
import { OBaseTableCellRenderer } from '../o-base-table-cell-renderer.class';

export const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_BOOLEAN = [
  // true-value [string]: true value. Default: no value.
  'trueValue: true-value',
  // false-value [string]: false value. Default: no value.
  'falseValue: false-value',
  // false-value [number|boolean|string]: cellData value type. Default: boolean
  'booleanType: boolean-type',

  'renderTrueValue: render-true-value',
  'renderFalseValue: render-false-value',
  // [string|number|icon|image]
  'renderType: render-type'
];

@Component({
  moduleId: module.id,
  selector: 'o-table-cell-renderer-boolean',
  templateUrl: './o-table-cell-renderer-boolean.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_BOOLEAN
})
export class OTableCellRendererBooleanComponent extends OBaseTableCellRenderer implements OnInit {

  public static DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_BOOLEAN = DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_BOOLEAN;

  trueValue: any;
  falseValue: any;
  protected _renderTrueValue: any;
  protected _renderFalseValue: any;

  protected _renderType: string = 'string';
  protected _booleanType: string = 'boolean';
  protected translateService: OTranslateService;

  @ViewChild('templateref', { read: TemplateRef })
  templateref: TemplateRef<any>;

  constructor(protected injector: Injector) {
    super(injector);
    this.tableColumn.type = 'boolean';
    this.translateService = this.injector.get(OTranslateService);
  }

  ngOnInit() {
    this.parseInputs();
  }

  protected parseInputs() {
    switch (this.booleanType) {
      case 'string':
        this.parseStringInputs();
        break;
      case 'number':
        this.parseNumberInputs();
        break;
      default:
        this.trueValue = true;
        this.falseValue = false;
        break;
    }
  }

  protected parseStringInputs() {
    if ((this.trueValue || '').length === 0) {
      this.trueValue = undefined;
    }
    if ((this.falseValue || '').length === 0) {
      this.falseValue = undefined;
    }
  }

  protected parseNumberInputs() {
    this.trueValue = parseInt(this.trueValue);
    if (isNaN(this.trueValue)) {
      this.trueValue = 1;
    }
    this.falseValue = parseInt(this.falseValue);
    if (isNaN(this.falseValue)) {
      this.falseValue = 0;
    }
  }

  hasCellDataTrueValue(cellData: any): boolean {
    let result: boolean = undefined;
    if (Util.isDefined(cellData)) {
      result = (cellData === this.trueValue);
      if (this.booleanType === 'string' && !Util.isDefined(this.trueValue)) {
        result = Util.parseBoolean(cellData, false);
      }
    }
    return result;
  }

  getCellData(cellvalue: any, rowvalue?: any) {
    let result = cellvalue;
    const cellIsTrue = this.hasCellDataTrueValue(cellvalue);
    let value = cellIsTrue ? this.trueValue : this.falseValue;
    switch (this.renderType) {
      case 'string':
        result = this.translateService.get(value);
        break;
      case 'number':
        result = value;
        break;
      default:
        break;
    }
    return result;
  }

  get booleanType(): string {
    return this._booleanType;
  }

  set booleanType(arg: string) {
    arg = (arg || '').toLowerCase();
    if (['number', 'boolean', 'string'].indexOf(arg) === -1) {
      arg = 'boolean';
    }
    this._booleanType = arg;
  }

  get renderType(): string {
    return this._renderType;
  }

  set renderType(arg: string) {
    arg = (arg || '').toLowerCase();
    if (['string', 'number', 'icon', 'image'].indexOf(arg) === -1) {
      arg = 'string';
    }
    this._renderType = arg;
  }

  get renderTrueValue(): string {
    return this._renderTrueValue || this.trueValue;
  }

  set renderTrueValue(arg: string) {
    this._renderTrueValue = arg;
  }

  get renderFalseValue(): string {
    return this._renderFalseValue || this.falseValue;
  }

  set renderFalseValue(arg: string) {
    this._renderFalseValue = arg;
  }
}
