import { Component, ElementRef, forwardRef, Inject, Injector, Optional, ViewEncapsulation } from '@angular/core';
import { ThemePalette } from '@angular/material';

import { Util } from '../../../util/util';
import { OFormComponent } from '../../form/o-form.component';
import { OFormValue } from '../../form/oFormValue';
import {
  DEFAULT_INPUTS_O_FORM_DATA_COMPONENT,
  DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT,
  OFormDataComponent
} from '../../o-form-data-component.class';

export const DEFAULT_INPUTS_O_SLIDETOGGLE = [
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

export const DEFAULT_OUTPUTS_O_SLIDETOGGLE = [
  ...DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT
];

@Component({
  selector: 'o-slide-toggle',
  inputs: DEFAULT_INPUTS_O_SLIDETOGGLE,
  outputs: DEFAULT_OUTPUTS_O_SLIDETOGGLE,
  templateUrl: './o-slide-toggle.component.html',
  styleUrls: ['./o-slide-toggle.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-slide-toggle]': 'true'
  }
})
export class OSlideToggleComponent extends OFormDataComponent {

  public trueValue: number | boolean | string = true;
  public falseValue: number | boolean | string = false;
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

  ensureOFormValue(value: any) {
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

  getValue(): any {
    if (Util.isDefined(this.value) && this.value.value !== undefined) {
      return this.value.value ? this.trueValue : this.falseValue;
    } else {
      return this.defaultValue;
    }
  }

  onClickBlocker(e: MouseEvent) {
    e.stopPropagation();
  }

}
