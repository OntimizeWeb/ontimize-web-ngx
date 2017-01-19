import { Injector, ElementRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ValidatorFn } from '@angular/forms/src/directives/validators';

import {
  IFormControlComponent, IFormDataTypeComponent,
  IFormDataComponent
} from '../interfaces';
import { OComponent } from './o-component.class';
import { InputConverter } from '../decorators';
import { OFormComponent, Mode } from './form/o-form.component';
import { OFormValue } from './form/OFormValue';
import { SQLTypes } from '../utils';

export class OFormDataComponent extends OComponent implements IFormControlComponent, IFormDataTypeComponent, IFormDataComponent {
  /* Inputs */
  protected sqlType: string;
  @InputConverter()
  autoBinding: boolean = true;

  /* Internal variables */
  protected value: OFormValue;
  protected defaultValue: any = undefined;
  protected _SQLType: number = SQLTypes.OTHER;
  protected _defaultSQLTypeKey: string = 'OTHER';
  protected _fControl: FormControl;
  protected elRef: ElementRef;
  protected form: OFormComponent;

  constructor(form: OFormComponent, elRef: ElementRef, injector: Injector) {
    super(injector);
    this.form = form;
    this.elRef = elRef;
  }

  initialize() {
    super.initialize();
    if (this.form) {
      this.registerFormListeners();
      this._isReadOnly = this.form.mode === Mode.INITIAL ? true : false;
    } else {
      this._isReadOnly = this._disabled;
    }
  }

  registerFormListeners() {
    if (this.form) {
      this.form.registerFormComponent(this);
      this.form.registerFormControlComponent(this);
      this.form.registerSQLTypeFormComponent(this);
    }
  }

  destroy() {
    this.unregisterFormListeners();
  }

  unregisterFormListeners() {
    if (this.form) {
      this.form.unregisterFormComponent(this);
      this.form.unregisterFormControlComponent(this);
      this.form.unregisterSQLTypeFormComponent(this);
    }
  }

  set data(value: any) {
    this.ensureOFormValue(value);
  }

  isAutomaticBinding(): Boolean {
    return this.autoBinding;
  }

   getValue() : any {
    if (this.value instanceof OFormValue) {
      if (this.value.value) {
        return this.value.value;
      }
    }
    return this.defaultValue;
  }

  setValue(val: any) {
    this.ensureOFormValue(val);
  }

  ensureOFormValue(value: any) {
    if (value instanceof OFormValue) {
      this.value = new OFormValue(value.value);
    } else if (value && !(value instanceof OFormValue)) {
      this.value = new OFormValue(value);
    } else {
      this.value = new OFormValue(this.defaultValue);
    }

    /*
    * Temporary code
    * I do not understand the reason why MdInput is not removing 'md-empty' clase despite of the fact that
    * the input element of the description is binding value attribute
    */
    let placeHolderLbl = this.elRef.nativeElement.querySelectorAll('label.md-input-placeholder');
    if (placeHolderLbl.length) {
      // Take only first, nested element does not matter.
      let element = placeHolderLbl[0];
      if (!this.isEmpty()) {
        element.classList.remove('md-empty');
      }
    }
  }

  getControl(): FormControl {
    if (!this._fControl) {
      let validators: ValidatorFn[] = this.resolveValidators();
      let cfg = {
        value: this.value ? this.value.value : undefined,
        disabled: this.isDisabled
      };
      this._fControl = new FormControl(cfg, validators);
    }
    return this._fControl;
  }

  resolveValidators(): ValidatorFn[] {
    let validators: ValidatorFn[] = [];

    if (this.orequired) {
      validators.push(Validators.required);
    }
    return validators;
  }

  getSQLType(): number {
    let sqlt = this.sqlType && this.sqlType.length > 0 ? this.sqlType : this._defaultSQLTypeKey;
    this._SQLType = SQLTypes.getSQLTypeValue(sqlt);
    return this._SQLType;
  }

  get isValid() {
    if (this._fControl) {
      return this._fControl.valid;
    }
    return false;
  }

  isEmpty(): boolean {
    if (this.value instanceof OFormValue) {
      if (this.value.value !== undefined) {
        return false;
      }
    }
    return true;
  }

}
