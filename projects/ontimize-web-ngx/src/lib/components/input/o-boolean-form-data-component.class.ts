import { ElementRef, forwardRef, Inject, Injector, Optional, Directive } from '@angular/core';

import { Util } from '../../util';
import { OFormValue } from '../form/o-form-value';
import { OFormComponent } from '../form/o-form.component';
import { OFormDataComponent } from '../o-form-data-component.class';


export const DEFAULT_INPUTS_O_BOOLEAN_FORM_DATA = [
  // true-value: true value. Default: true.
  'trueValue: true-value',
  // false-value: false value. Default: false.
  'falseValue: false-value',
  // boolean-type [number|boolean|string]: cellData value type. Default: boolean
  'booleanType: boolean-type'
];

@Directive()
export class OBooleanFormDataComponent extends OFormDataComponent {

  public trueValue: any = true;
  public falseValue: any = false;
  public booleanType: 'number' | 'boolean' | 'string' = 'boolean';

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector
  ) {
    super(form, elRef, injector);
    this._defaultSQLTypeKey = 'BOOLEAN';
    this.defaultValue = false;
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
    this.defaultValue = this.falseValue;
    super.initialize();
  }

  ensureOFormValue(data: any) {
    this.parseInputs();
    if (data instanceof OFormValue) {
      if (!Util.isDefined(data.value)) {
        data.value = false;
      }
      this.value = new OFormValue(this.parseValueByType(data.value) === this.trueValue);
    } else if (typeof data === 'boolean') {
      this.value = new OFormValue(data);
    } else {
      this.value = new OFormValue(this.parseValueByType(data) === this.trueValue);
    }
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

  onClickBlocker(evt: Event) {
    evt.stopPropagation();
  }
}
