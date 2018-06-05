import { Injector, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn } from '@angular/forms';

import { InputConverter } from '../decorators';
import { SQLTypes } from '../utils';
import {
  ONIFInputComponent,
  OCurrencyInputComponent,
  ODateInputComponent,
  OEmailInputComponent,
  OListPickerComponent,
  OPasswordInputComponent,
  OPercentInputComponent
} from '../components';

import { OBaseComponent, IComponent } from './o-component.class';
import { OFormComponent } from './form/o-form.component';
import { OFormValue, IFormValueOptions } from './form/OFormValue';

export interface IFormDataTypeComponent extends IComponent {
  getSQLType(): number;
}

export interface IFormControlComponent extends IComponent {
  getControl(): FormControl;
  getFormControl(): FormControl;
  hasError(error: string): boolean;
}

export interface IFormDataComponent extends IFormControlComponent {
  data(value: any);
  isAutomaticBinding(): boolean;
  isAutomaticRegistering(): boolean;
}

export const DEFAULT_INPUTS_O_FORM_DATA_COMPONENT = [
  'oattr: attr',
  'olabel: label',
  'tooltip',
  'tooltipPosition: tooltip-position',
  'tooltipShowDelay: tooltip-show-delay',
  'data',
  'autoBinding: automatic-binding',
  'autoRegistering: automatic-registering',
  'oenabled: enabled',
  'orequired: required',
  // sqltype[string]: Data type according to Java standard. See SQLType ngClass. Default: 'OTHER'
  'sqlType: sql-type',
  'width',
  'readOnly: read-only'
];

export class OFormDataComponent extends OBaseComponent implements IFormDataComponent, IFormDataTypeComponent,
  OnInit, OnDestroy {

  static STANDARD_FORM_FIELD_WIDTH = '180px';
  /* Inputs */
  sqlType: string;
  @InputConverter()
  autoBinding: boolean = true;
  @InputConverter()
  autoRegistering: boolean = true;
  width: string;

  /* Internal variables */
  protected value: OFormValue;
  protected defaultValue: any = undefined;
  protected _SQLType: number = SQLTypes.OTHER;
  protected _defaultSQLTypeKey: string = 'OTHER';
  protected _fControl: FormControl;
  protected elRef: ElementRef;
  protected form: OFormComponent;

  constructor(
    form: OFormComponent,
    elRef: ElementRef,
    injector: Injector
  ) {
    super(injector);
    this.form = form;
    this.elRef = elRef;
  }

  ngOnInit() {
    this.initialize();
  }

  ngOnDestroy() {
    this.destroy();
  }

  getFormGroup(): FormGroup {
    return this.form ? this.form.formGroup : undefined;
  }

  getFormControl(): FormControl {
    return this._fControl;
  }

  hasError(error: string): boolean {
    return !this.isReadOnly && this._fControl && this._fControl.touched && this._fControl.hasError(error);
  }

  getErrorValue(error: string, prop: string): string {
    return this._fControl && this._fControl.hasError(error) ? this._fControl.getError(error)[prop] || '' : '';
  }

  initialize() {
    super.initialize();
    this.initializeWidth();
    if (this.form) {
      this.registerFormListeners();
      this.isReadOnly = this.form.isInInitialMode() ? true : false;
    } else {
      this.isReadOnly = this._disabled;
    }
  }

  initializeWidth() {
    if (this.elRef.nativeElement.getAttributeNames().indexOf('fxflex') !== -1) {
      return;
    }

    if (!this.width || !(this.width.length > 0)) {
      switch (true) {
        case this instanceof OCurrencyInputComponent:
        case this instanceof ODateInputComponent:
        case this instanceof OEmailInputComponent:
        case this instanceof OListPickerComponent:
        case this instanceof ONIFInputComponent:
        case this instanceof OPasswordInputComponent:
        case this instanceof OPercentInputComponent:
          this.width = OFormDataComponent.STANDARD_FORM_FIELD_WIDTH;
          break;
      }
    }
  }

  destroy() {
    this.unregisterFormListeners();
  }

  registerFormListeners() {
    if (this.form) {
      this.form.registerFormComponent(this);
      this.form.registerFormControlComponent(this);
      this.form.registerSQLTypeFormComponent(this);
    }
  }

  unregisterFormListeners() {
    if (this.form) {
      this.form.unregisterFormComponent(this);
      this.form.unregisterFormControlComponent(this);
      this.form.unregisterSQLTypeFormComponent(this);
    }
  }

  set data(value: any) {
    this.setData(value);
  }

  setData(value: any) {
    this.ensureOFormValue(value);
    if (this._fControl) {
      this._fControl.setValue(value.value, {
        emitModelToViewChange: false,
        emitEvent: false
      });
    }
  }

  isAutomaticBinding(): boolean {
    return this.autoBinding;
  }

  isAutomaticRegistering(): boolean {
    return this.autoRegistering;
  }

  getValue(): any {
    if (this.value instanceof OFormValue) {
      if (this.value.value !== undefined) {
        return this.value.value;
      }
    }
    return this.defaultValue;
  }

  setValue(val: any, options?: IFormValueOptions) {
    this.ensureOFormValue(val);
    if (this._fControl) {
      this._fControl.setValue(val, options);
      this._fControl.markAsDirty();
    }
  }

  ensureOFormValue(value: any) {
    if (value instanceof OFormValue) {
      this.value = new OFormValue(value.value);
    } else if (value !== undefined && !(value instanceof OFormValue)) {
      this.value = new OFormValue(value);
    } else {
      this.value = new OFormValue(this.defaultValue);
    }

    /*
    * Temporary code
    * I do not understand the reason why MatInput is not removing 'mat-empty' clase despite of the fact that
    * the input element of the description is binding value attribute
    */
    let placeHolderLbl = this.elRef.nativeElement.querySelectorAll('label.mat-input-placeholder');
    if (placeHolderLbl.length) {
      // Take only first, nested element does not matter.
      let element = placeHolderLbl[0];
      if (!this.isEmpty()) {
        element.classList.remove('mat-empty');
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

  set disabled(value: boolean) {
    this._disabled = value;
    if (this._fControl && value) {
      this._fControl.disable();
    } else if (this._fControl) {
      this._fControl.enable();
    }
  }

  get elementRef(): ElementRef {
    return this.elRef;
  }

  get hasCustomWidth(): boolean {
    return this.width !== undefined;
  }
}
