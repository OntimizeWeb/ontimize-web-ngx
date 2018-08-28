import { Injector, ElementRef, OnInit, OnDestroy, QueryList, ViewChildren, AfterViewInit, HostBinding, ContentChildren, OnChanges, SimpleChange, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { MatSuffix } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { InputConverter } from '../decorators';
import { SQLTypes, Util } from '../utils';
import { OBaseComponent, IComponent } from './o-component.class';
import { OFormComponent } from './form/o-form.component';
import { OFormValue, IFormValueOptions } from './form/OFormValue';
import { OValidatorComponent } from './input/validation/o-validator.component';

export interface IMultipleSelection extends IComponent {
  getSelectedItems(): Array<any>;
  setSelectedItems(values: Array<any>);
}

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

export interface IErrorData {
  name: string;
  text: string;
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
  'readOnly: read-only',
  'clearButton: clear-button',
  'angularValidatorsFn: validators'
];

export const DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT = [
  'onChange'
];

export class OFormDataComponent extends OBaseComponent implements IFormDataComponent, IFormDataTypeComponent,
  OnInit, AfterViewInit, OnDestroy, OnChanges {

  /* Inputs */
  sqlType: string;
  @InputConverter()
  autoBinding: boolean = true;
  @InputConverter()
  autoRegistering: boolean = true;
  width: string;
  @InputConverter()
  clearButton: boolean = false;
  angularValidatorsFn: ValidatorFn[] = [];

  /* Outputs */
  onChange: EventEmitter<Object> = new EventEmitter<Object>();

  @HostBinding('style.width')
  get hostWidth() {
    return this.width;
  }

  /* Internal variables */
  protected value: OFormValue;
  protected defaultValue: any = void 0;
  protected _SQLType: number = SQLTypes.OTHER;
  protected _defaultSQLTypeKey: string = 'OTHER';
  protected _fControl: FormControl;
  protected elRef: ElementRef;
  protected form: OFormComponent;

  protected matSuffixSubscription: Subscription;
  @ViewChildren(MatSuffix)
  protected _matSuffixList: QueryList<MatSuffix>;
  matSuffixClass;

  protected errorsData: IErrorData[] = [];
  protected validatorsSubscription: Subscription;
  @ContentChildren(OValidatorComponent)
  protected validatorChildren: QueryList<OValidatorComponent>;

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

  ngAfterViewInit(): void {
    const self = this;
    if (this._matSuffixList) {
      this.setSuffixClass(this._matSuffixList.length);
      this.matSuffixSubscription = this._matSuffixList.changes.subscribe(() => {
        self.setSuffixClass(self._matSuffixList.length);
      });
    }

    if (this.validatorChildren) {
      this.validatorsSubscription = this.validatorChildren.changes.subscribe(() => {
        self.updateValidators();
      });
      if (this.validatorChildren.length > 0) {
        this.updateValidators();
      }
    }
  }

  ngOnDestroy() {
    this.destroy();
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    if (Util.isDefined(changes['angularValidatorsFn'])) {
      this.updateValidators();
    }
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

  getActiveOErrors(): IErrorData[] {
    return this.errorsData.filter((item: IErrorData) => this.hasError(item.name));
  }

  initialize() {
    super.initialize();
    if (this.form) {
      this.registerFormListeners();
      this.isReadOnly = !(this.form.isInUpdateMode() || this.form.isInInsertMode() || this.form.isEditableDetail());
    } else {
      this.isReadOnly = this._disabled;
    }
  }

  protected setSuffixClass(count: number) {
    const iconFieldEl = this.elRef.nativeElement.getElementsByClassName('icon-field');
    if (iconFieldEl.length === 1) {
      let classList = iconFieldEl[0].classList;
      classList.forEach(className => {
        if (className.startsWith('icon-field-')) {
          classList.remove(className);
        }
      });
      if (count > 0) {
        let matSuffixClass = `icon-field-${count}-suffix`;
        iconFieldEl[0].classList.add(matSuffixClass);
      }
    }
  }

  destroy() {
    this.unregisterFormListeners();
    if (this.matSuffixSubscription) {
      this.matSuffixSubscription.unsubscribe();
    }
    if (this.validatorsSubscription) {
      this.validatorsSubscription.unsubscribe();
    }
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
      this._fControl.setValue(this.value.value, {
        emitModelToViewChange: false,
        emitEvent: false
      });
      if (this._fControl.invalid) {
        this._fControl.markAsTouched();
      }
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
      if (this._fControl.invalid) {
        this._fControl.markAsTouched();
      }
    }
  }

  /**
   * Clears the component value.
   */
  clearValue(): void {
    this.setValue(void 0);
  }

  get showClearButton(): boolean {
    return this.clearButton && !this.isReadOnly && !this.isDisabled && this.getValue();
  }

  ensureOFormValue(value: any) {
    if (value instanceof OFormValue) {
      this.value = new OFormValue(value.value);
    } else if (value !== undefined && !(value instanceof OFormValue)) {
      this.value = new OFormValue(value);
    } else {
      this.value = new OFormValue(this.defaultValue);
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
    let validators: ValidatorFn[] = this.angularValidatorsFn;
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

  protected updateValidators() {
    if (!this._fControl) {
      return;
    }
    const self = this;
    this._fControl.clearValidators();
    this.errorsData = [];
    let validators = this.resolveValidators();
    this.validatorChildren.forEach((oValidator: OValidatorComponent) => {
      let validatorFunction: ValidatorFn = oValidator.getValidatorFn();
      if (validatorFunction) {
        validators.push(validatorFunction);
      }
      let errorsData: IErrorData[] = oValidator.getErrorsData();
      self.errorsData.push(...errorsData);
    });
    this._fControl.setValidators(validators);
  }
}
