import { CommonModule } from '@angular/common';
import { Component, ElementRef, forwardRef, Inject, Injector, NgModule, Optional, ViewEncapsulation } from '@angular/core';
import { ThemePalette } from '@angular/material';
import { OSharedModule } from '../../../shared';
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

    const context = this;
    (this.getFormControl() as OFormControl).getValue.bind(context);
    (this.getFormControl() as OFormControl).getValue = function () {
      return this.value ? context.trueValue : context.falseValue;
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
        result = parseInt(value);
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
    this.trueValue = parseInt(this.trueValue);
    if (isNaN(this.trueValue)) {
      this.trueValue = 1;
    }
    this.falseValue = parseInt(this.falseValue);
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

@NgModule({
  declarations: [OCheckboxComponent],
  imports: [CommonModule, OSharedModule],
  exports: [OCheckboxComponent]
})
export class OCheckboxModule { }
