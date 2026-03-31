import { ChangeDetectionStrategy, Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { OTranslateService } from '../../../../../services/translate/o-translate.service';
import { Util } from '../../../../../util/util';
import { OComboCustomRenderer } from '../o-combo-renderer.class';

export const DEFAULT_INPUTS_O_COMBO_RENDERER_BOOLEAN = [
  // true-value [string]: true value. Default: no value.
  'trueValue: true-value',
  // false-value [string]: false value. Default: no value.
  'falseValue: false-value',
  // false-value [number|string]: combo value type. Default: string
  'booleanType: boolean-type',

  'renderTrueValue: render-true-value',
  'renderFalseValue: render-false-value',
  // [string|number]
  'renderType: render-type'
];

@Component({
  selector: 'o-combo-renderer-boolean',
  templateUrl: './o-combo-renderer-boolean.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: DEFAULT_INPUTS_O_COMBO_RENDERER_BOOLEAN
})
export class OComboRendererBooleanComponent extends OComboCustomRenderer implements OnInit {

  trueValue: any;
  falseValue: any;
  protected _renderTrueValue: any;
  protected _renderFalseValue: any;

  protected _renderType: string = 'string';
  protected _booleanType: string = 'boolean';
  protected translateService: OTranslateService;

  @ViewChild('templateref', { read: TemplateRef, static: true })
  templateref: TemplateRef<any>;

  constructor(protected injector: Injector) {
    super(injector);
    this.translateService = this.injector.get(OTranslateService);
  }

  initialize() {
    super.initialize();
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
    this.trueValue = parseInt(this.trueValue, 10);
    if (isNaN(this.trueValue)) {
      this.trueValue = 1;
    }
    this.falseValue = parseInt(this.falseValue, 10);
    if (isNaN(this.falseValue)) {
      this.falseValue = 0;
    }
  }

  hasComboTrueValue(record: any): boolean {
    let result: boolean;
    if (Util.isDefined(record) && Util.isDefined(record[this.comboComponent.valueColumn])) {
      const value = record[this.comboComponent.valueColumn];
      result = (value === this.trueValue);
      if (this.booleanType === 'string' && !Util.isDefined(this.trueValue)) {
        result = Util.parseBoolean(value, false);
      }
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
    if (['string', 'number'].indexOf(arg) === -1) {
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
