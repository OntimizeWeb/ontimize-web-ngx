import { Component, ElementRef, forwardRef, Inject, Injector, Optional, ViewEncapsulation } from '@angular/core';
import { ThemePalette } from '@angular/material';

import { Util } from '../../../util/util';
import { OFormComponent } from '../../form/o-form.component';
import { OFormValue } from '../../form/OFormValue';
import { DEFAULT_INPUTS_O_FORM_DATA_COMPONENT, DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT, OFormDataComponent } from '../../o-form-data-component.class';
import { OFormControl } from '../o-form-control.class';

export const DEFAULT_INPUTS_O_CHECKBOX = [
  // true-value: true value. Default: true.
  'trueValue: true-value',
  // false-value: false value. Default: false.
  'falseValue: false-value',
  // boolean-type [number|boolean|string]: cellData value type. Default: boolean
  'booleanType: boolean-type',
  // color: Theme color palette for the component.
  'color',
  // label-position: Whether the label should appear after or before the slide-toggle. Defaults to 'after'
  'labelPosition: label-position',
  ...DEFAULT_INPUTS_O_FORM_DATA_COMPONENT
];

export const DEFAULT_OUTPUTS_O_CHECKBOX = [
  ...DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT
];

@Component({
  selector: 'o-checkbox',
  inputs: DEFAULT_INPUTS_O_CHECKBOX,
  outputs: DEFAULT_OUTPUTS_O_CHECKBOX,
  templateUrl: './o-checkbox.component.html',
  styleUrls: ['./o-checkbox.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-checkbox]': 'true'
  }
})
export class OCheckboxComponent extends OFormDataComponent {

  public trueValue: any = true;
  public falseValue: any = false;
  public booleanType: 'number' | 'boolean' | 'string' = 'boolean';
  public color: ThemePalette;
  public labelPosition: 'before' | 'after' = 'after';

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector
  ) {
    super(form, elRef, injector);
    this._defaultSQLTypeKey = 'BOOLEAN';
  }

  initialize() {
    //First, the sqlType must be initialized  before calling super.initialize because it overwritte the value
    if (!Util.isDefined(this.sqlType)) {
      switch (this.booleanType) {
        case 'number':
          this.sqlType = 'INTEGER';
          break;
        case 'string':
          this.sqlType = 'VARCHAR';
          break;
        case 'boolean':
        default:
          this.sqlType = 'BOOLEAN';
      }
    }

    super.initialize();

    // Override FormControl getValue in order to return the appropriate value instead of the checkbox internal boolean value
    const checkboxCtx = this;
    (this.getFormControl() as OFormControl).getValue = function() {
      return this.value ? checkboxCtx.trueValue : checkboxCtx.falseValue;
    };
  }

  ensureOFormValue(value: any) {
    this.parseInputs();
    if (value instanceof OFormValue) {
      if (value.value === undefined) {
        value.value = false;
      }
      this.value = new OFormValue(this.parseValueByType(value.value) === this.trueValue);
    } else if (typeof value === 'boolean') {
      this.value = new OFormValue(value);
    } else {
      this.value = new OFormValue(this.parseValueByType(value) === this.trueValue);
    }
  }

  getValue(): any {
    if (Util.isDefined(this.value) && this.value.value !== undefined) {
      return this.value.value ? this.trueValue : this.falseValue;
    } else {
      return this.defaultValue;
    }
  }

  onClickBlocker(evt: Event) {
    evt.stopPropagation();
  }

  parseValueByType(value: any) {
    let result: any;
    switch (this.booleanType) {
      case 'string':
        result = value + '';
        break;
      case 'number':
        result = parseInt(value, 10);
        break;
      default:
        result = value;
        break;
    }
    return result;
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

}
