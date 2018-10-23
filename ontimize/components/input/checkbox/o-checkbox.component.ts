import { Component, ElementRef, forwardRef, Inject, Injector, NgModule, Optional, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Util } from '../../../util/util';
import { OSharedModule } from '../../../shared';
import { OFormValue } from '../../form/OFormValue';
import { OFormComponent } from '../../form/o-form.component';
import { OFormDataComponent, DEFAULT_INPUTS_O_FORM_DATA_COMPONENT, DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT } from '../../o-form-data-component.class';

export const DEFAULT_INPUTS_O_CHECKBOX = [
  // true-value: true value. Default: true.
  'trueValue: true-value',
  // false-value: false value. Default: false.
  'falseValue: false-value',
  // false-value [number|boolean|string]: cellData value type. Default: boolean
  'booleanType: boolean-type',
  ...DEFAULT_INPUTS_O_FORM_DATA_COMPONENT
];

export const DEFAULT_OUTPUTS_O_CHECKBOX = [
  ...DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT
];

@Component({
  moduleId: module.id,
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

  public static DEFAULT_INPUTS_O_CHECKBOX = DEFAULT_INPUTS_O_CHECKBOX;
  public static DEFAULT_OUTPUTS_O_CHECKBOX = DEFAULT_OUTPUTS_O_CHECKBOX;

  trueValue: number | boolean | string = true;
  falseValue: number | boolean | string = false;
  booleanType: 'number' | 'boolean' | 'string' = 'boolean';

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
    super.initialize();
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
  }

  ensureOFormValue(value: any) {

    if (this.booleanType !== 'boolean') {
      if (typeof value === 'boolean') {
        value = value ? this.trueValue : this.falseValue;
      } else {
        value = value === this.trueValue ? this.trueValue : this.falseValue;
      }
    }

    if (value instanceof OFormValue) {
      if (!Util.isDefined(value.value)) {
        value.value = this.falseValue;
      }
      this.value = new OFormValue(value.value);
    } else {
      this.value = new OFormValue(value === this.trueValue ? this.trueValue : this.falseValue);
    }
  }

  isChecked(): boolean {
    if (this.value instanceof OFormValue) {
      return this.value.value === this.trueValue;
    }
    return false;
  }

  onClickBlocker(evt: Event) {
    evt.stopPropagation();
  }

}

@NgModule({
  declarations: [OCheckboxComponent],
  imports: [CommonModule, OSharedModule],
  exports: [OCheckboxComponent]
})
export class OCheckboxModule { }
