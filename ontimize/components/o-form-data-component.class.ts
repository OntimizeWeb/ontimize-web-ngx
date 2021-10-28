import {
  AfterViewInit,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostBinding,
  Injector,
  OnChanges,
  OnDestroy,
  OnInit,
  QueryList,
  SimpleChange,
  ViewChildren,
} from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { FloatLabelType, MatFormFieldAppearance, MatSuffix } from '@angular/material';
import { Subscription } from 'rxjs';

import { O_INPUTS_OPTIONS, OInputsOptions } from '../config/app-config';
import { BooleanConverter, InputConverter } from '../decorators';
import { OPermissions, PermissionsService } from '../services';
import { O_MAT_ERROR_OPTIONS, OMatErrorComponent, OMatErrorOptions } from '../shared/material/o-mat-error/o-mat-error';
import { PermissionsUtils } from '../util/permissions';
import { Codes, SQLTypes, Util } from '../utils';
import { OFormComponent } from './form/o-form.component';
import { IFormValueOptions, OFormValue } from './form/OFormValue';
import { OFormControl } from './input/o-form-control.class';
import { OValidatorComponent } from './input/validation/o-validator.component';
import { IComponent, OBaseComponent } from './o-component.class';


export interface IMultipleSelection extends IComponent {
  getSelectedItems(): any[];
  setSelectedItems(values: any[]): void;
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
  onChange: EventEmitter<Object>;
  onValueChange: EventEmitter<OValueChangeEvent>;

  data(value: any): void;
  isAutomaticBinding(): boolean;
  isAutomaticRegistering(): boolean;
  setValue(val: any, options?: IFormValueOptions): void;
  clearValue(options?: IFormValueOptions): void;
  getValue(): any;
}

export interface IErrorData {
  name: string;
  text: string;
}

export class OValueChangeEvent {
  public static USER_CHANGE = 0;
  public static PROGRAMMATIC_CHANGE = 1;

  constructor(
    public type: number,
    public newValue: any,
    public oldValue: any,
    public target: any) { }

  public isUserChange(): boolean {
    return this.type === OValueChangeEvent.USER_CHANGE;
  }

  public isProgrammaticChange(): boolean {
    return this.type === OValueChangeEvent.PROGRAMMATIC_CHANGE;
  }
}

export const DEFAULT_INPUTS_O_FORM_DATA_COMPONENT = [
  'oattr: attr',
  'olabel: label',
  'floatLabel: float-label',
  'oplaceholder: placeholder',
  'tooltip',
  'tooltipPosition: tooltip-position',
  'tooltipShowDelay: tooltip-show-delay',
  'tooltipHideDelay: tooltip-hide-delay',
  'data',
  'autoBinding: automatic-binding',
  'autoRegistering: automatic-registering',
  'enabled',
  'orequired: required',
  // sqltype[string]: Data type according to Java standard. See SQLType ngClass. Default: 'OTHER'
  'sqlType: sql-type',
  'width',
  'readOnly: read-only',
  'clearButton: clear-button',
  'angularValidatorsFn: validators',
  'appearance',
  'hideRequiredMarker:hide-required-marker',
  'labelVisible:label-visible'
];

export const DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT = [
  'onChange',
  'onValueChange',
  'onFocus',
  'onBlur'
];

export class OFormDataComponent extends OBaseComponent implements IFormDataComponent, IFormDataTypeComponent,
  OnInit, AfterViewInit, OnDestroy, OnChanges {

  /* Inputs */
  public sqlType: string;
  @InputConverter()
  public autoBinding: boolean = true;
  @InputConverter()
  public autoRegistering: boolean = true;
  public width: string;
  @InputConverter()
  public clearButton: boolean = false;
  public angularValidatorsFn: ValidatorFn[] = [];
  @InputConverter()
  public hideRequiredMarker: boolean = false;
  @InputConverter()
  public labelVisible: boolean = true;

  /* Outputs */
  public onChange: EventEmitter<Object> = new EventEmitter<Object>();
  public onValueChange: EventEmitter<OValueChangeEvent> = new EventEmitter<OValueChangeEvent>();
  public onFocus: EventEmitter<Object> = new EventEmitter<Object>();
  public onBlur: EventEmitter<Object> = new EventEmitter<Object>();

  @HostBinding('style.width')
  get hostWidth(): string {
    return this.width;
  }

  /* Internal variables */
  protected value: OFormValue;
  protected defaultValue: any = void 0;
  protected _SQLType: number = SQLTypes.OTHER;
  protected _defaultSQLTypeKey: string = 'OTHER';
  protected _fControl: OFormControl;
  protected _fControlSubscription: Subscription;
  protected _fGroup: FormGroup;
  protected elRef: ElementRef;
  protected form: OFormComponent;
  protected oldValue: any;

  protected _floatLabel: FloatLabelType;
  protected _appearance: MatFormFieldAppearance;

  protected matSuffixSubscription: Subscription;
  @ViewChildren(MatSuffix)
  protected _matSuffixList: QueryList<MatSuffix>;

  protected errorsData: IErrorData[] = [];
  protected validatorsSubscription: Subscription;
  @ContentChildren(OValidatorComponent)
  protected validatorChildren: QueryList<OValidatorComponent>;

  protected permissionsService: PermissionsService;
  protected mutationObserver: MutationObserver;

  protected errorOptions: OMatErrorOptions;
  @ViewChildren(OMatErrorComponent)
  protected oMatErrorChildren: QueryList<OMatErrorComponent>;

  protected oInputsOptions: OInputsOptions;

  constructor(
    form: OFormComponent,
    elRef: ElementRef,
    injector: Injector
  ) {
    super(injector);
    this.form = form;
    this.elRef = elRef;
    this.permissionsService = this.injector.get(PermissionsService);
    try {
      this.errorOptions = this.injector.get(O_MAT_ERROR_OPTIONS) || {};
    } catch (e) {
      this.errorOptions = {};
    }
  }

  public ngOnInit(): void {
    this.initialize();
  }

  public ngAfterViewInit(): void {
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
    if (!this.enabled) {
      this.mutationObserver = PermissionsUtils.registerDisabledChangesInDom(this.getMutationObserverTarget(), {
        callback: this.disableFormControl.bind(this)
      });
    }
    this.addOntimizeCustomAppearanceClass();
    try {
      this.oInputsOptions = this.injector.get(O_INPUTS_OPTIONS);
    } catch (e) {
      this.oInputsOptions = {};
    }

    Util.parseOInputsOptions(this.elRef, this.oInputsOptions);
  }

  public ngOnDestroy(): void {
    this.destroy();
  }

  public ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    if (Util.isDefined(changes['angularValidatorsFn'])) {
      this.updateValidators();
    }
  }

  public hasEnabledPermission(): boolean {
    return this.permissions ? this.permissions.enabled : true;
  }

  public hasVisiblePermission(): boolean {
    return this.permissions ? this.permissions.visible : true;
  }

  public getFormGroup(): FormGroup {
    if (this._fGroup) {
      return this._fGroup;
    }
    let formGroup = this.form ? this.form.formGroup : undefined;
    if ((!this.hasEnabledPermission() || !this.hasVisiblePermission()) && !this._fGroup) {
      const group = {};
      group[this.oattr] = this._fControl;
      this._fGroup = new FormGroup(group);
      formGroup = this._fGroup;
    }
    return formGroup;
  }

  public getFormControl(): FormControl {
    return this._fControl;
  }

  public hasError(error: string): boolean {
    return !this.isReadOnly && this._fControl && this._fControl.touched && this._fControl.hasError(error);
  }

  public getErrorValue(error: string, prop: string): string {
    return this._fControl && this._fControl.hasError(error) ? this._fControl.getError(error)[prop] || '' : '';
  }

  public getActiveOErrors(): IErrorData[] {
    return this.errorsData.filter((item: IErrorData) => this.hasError(item.name));
  }

  public initialize(): void {
    super.initialize();

    // ensuring formControl creation
    this.getControl();

    this.parsePermissions();

    if (!Util.isDefined(this.permissions)) {
      if (this.form) {
        this.registerFormListeners();
        this.isReadOnly = !(this.form.isInUpdateMode() || this.form.isInInsertMode() || this.form.isEditableDetail());
      } else {
        this.isReadOnly = !this.enabled;
      }
    }
  }

  public destroy(): void {
    this.unregisterFormListeners();
    if (this.matSuffixSubscription) {
      this.matSuffixSubscription.unsubscribe();
    }
    if (this.validatorsSubscription) {
      this.validatorsSubscription.unsubscribe();
    }
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
    if (this._fControlSubscription) {
      this._fControlSubscription.unsubscribe();
    }
  }

  public registerFormListeners(): void {
    if (this.form) {
      this.form.registerFormComponent(this);
      this.form.registerFormControlComponent(this);
      this.form.registerSQLTypeFormComponent(this);
    }
  }

  public unregisterFormListeners(): void {
    if (this.form) {
      this.form.unregisterFormComponent(this);
      this.form.unregisterFormControlComponent(this);
      this.form.unregisterSQLTypeFormComponent(this);
    }
  }

  set data(value: any) {
    this.setData(value);
  }

  public setData(newValue: any): void {
    // emit OValueChangeEvent.PROGRAMMATIC_CHANGE when assign value to data
    // this method skips the following permissions checking because the form is
    // setting its query result using it
    const previousValue = this.oldValue;
    this.setFormValue(newValue);
    this.emitOnValueChange(OValueChangeEvent.PROGRAMMATIC_CHANGE, newValue, previousValue);
  }

  public isAutomaticBinding(): boolean {
    return this.autoBinding;
  }

  public isAutomaticRegistering(): boolean {
    return this.autoRegistering;
  }

  public getValue(): any {
    if (this.value instanceof OFormValue) {
      if (this.value.value !== undefined) {
        return this.value.value;
      }
    }
    return this.defaultValue;
  }

  public setValue(val: any, options: IFormValueOptions = {}, setDirty: boolean = false): void {
    if (!PermissionsUtils.checkEnabledPermission(this.permissions)) {
      return;
    }
    if (this.oldValue !== val) {
      const newValue = val;
      const previousValue = this.oldValue;
      this.setFormValue(val, options, setDirty);
      if (options && options.emitModelToViewValueChange !== false) {
        const changeType: number = (options && options.hasOwnProperty('changeType')) ? options.changeType : OValueChangeEvent.PROGRAMMATIC_CHANGE;
        this.emitOnValueChange(changeType, newValue, previousValue);
      }
    }
  }

  /**
   * Clears the component value.
   */
  public clearValue(options?: IFormValueOptions, setDirty: boolean = false): void {
    if (!PermissionsUtils.checkEnabledPermission(this.permissions)) {
      return;
    }
    this.setValue(void 0, options, setDirty);
  }

  public onClickClearValue(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.clearValue({ changeType: OValueChangeEvent.USER_CHANGE }, true);
  }

  /* This method is called in output change event, not emit event onValueChange when oldvalue is same than newvalue*/
  public onChangeEvent(arg: any): void {
    const value = this.getValue();
    if (this.oldValue !== value) {
      const previousValue = this.oldValue;
      this.oldValue = value;
      this.emitOnValueChange(OValueChangeEvent.USER_CHANGE, value, previousValue);
    }
  }

  get showClearButton(): boolean {
    return this.clearButton && !this.isReadOnly && this.enabled && Util.isDefined(this.getValue());
  }

  public onFormControlChange(value: any): void {
    // equivalente al innerOnChange
    if (!this.value) {
      this.value = new OFormValue();
    }
    this.ensureOFormValue(value);
    this.onChange.emit(value);
  }

  public ensureOFormValue(arg: any): void {
    if (arg instanceof OFormValue) {
      this.value = arg;
    } else if (Util.isDefined(arg) && !(arg instanceof OFormValue)) {
      const val: OFormValue = this.value || new OFormValue();
      val.value = arg;
      this.value = val;
    } else {
      this.value = new OFormValue(this.defaultValue);
    }
  }

  /**
   * This method should overwritten in the child component when it have addicional form control or other oFormDataComponent
   */
  public createFormControl(cfg?, validators?): OFormControl {
    return new OFormControl(cfg, {
      validators: validators
    }, null);
  }

  public getControl(): FormControl {
    if (!this._fControl) {
      const validators: ValidatorFn[] = this.resolveValidators();
      const cfg = {
        value: this.value ? this.value.value : undefined,
        disabled: !this.enabled
      };
      this._fControl = this.createFormControl(cfg, validators);
      this.registerOnFormControlChange();
    }
    return this._fControl;
  }

  public resolveValidators(): ValidatorFn[] {
    const validators: ValidatorFn[] = [];
    this.angularValidatorsFn.forEach((fn: ValidatorFn) => {
      validators.push(fn);
    });
    if (this.orequired) {
      validators.push(Validators.required);
    }
    return validators;
  }

  public getSQLType(): number {
    const sqlt = this.sqlType && this.sqlType.length > 0 ? this.sqlType : this._defaultSQLTypeKey;
    this._SQLType = SQLTypes.getSQLTypeValue(sqlt);
    return this._SQLType;
  }

  get isValid(): boolean {
    if (this._fControl) {
      return this._fControl.valid;
    }
    return false;
  }

  public isEmpty(): boolean {
    if (this.value instanceof OFormValue) {
      if (this.value.value !== undefined) {
        return false;
      }
    }
    return true;
  }

  public setEnabled(value: boolean): void {
    super.setEnabled(value);
    if (this.hasVisiblePermission()) {
      if (this._fControl && value) {
        this._fControl.enable();
      } else if (this._fControl) {
        this._fControl.disable();
      }
    }
  }

  get elementRef(): ElementRef {
    return this.elRef;
  }

  get hasCustomWidth(): boolean {
    return this.width !== undefined;
  }

  get orequired(): boolean {
    return this._orequired;
  }

  set orequired(val: boolean) {
    const old = this._orequired;
    this._orequired = BooleanConverter(val);
    if (val !== old) {
      this.updateValidators();
    }
  }

  public innerOnFocus(event: any): void {
    if (!this.isReadOnly && this.enabled) {
      this.onFocus.emit(event);
    }
  }

  public innerOnBlur(event: any): void {
    if (!this.isReadOnly && this.enabled) {
      this.onBlur.emit(event);
    }
  }

  get appearance(): MatFormFieldAppearance {
    return this._appearance;
  }

  set appearance(value: MatFormFieldAppearance) {
    const values = ['legacy', 'standard', 'fill', 'outline'];
    if (values.indexOf(value) === -1) {
      value = undefined;
    }
    this._appearance = value;
  }

  get floatLabel(): FloatLabelType {
    if (!this.labelVisible) {
      this.floatLabel = 'never';
    }
    return this._floatLabel;
  }

  set floatLabel(value: FloatLabelType) {
    const values = ['always', 'never', 'auto'];
    if (values.indexOf(value) === -1) {
      value = 'auto';
    }
    this._floatLabel = value;
  }

  protected registerOnFormControlChange(): void {
    const self = this;
    if (this._fControl) {
      this._fControlSubscription = this._fControl.valueChanges.subscribe(value => {
        self.onFormControlChange(value);
      });
    }
  }

  protected emitOnValueChange(type, newValue, oldValue): void {
    const event = new OValueChangeEvent(type, newValue, oldValue, this);
    this.onValueChange.emit(event);
  }

  protected setFormValue(val: any, options?: IFormValueOptions, setDirty: boolean = false): void {
    this.ensureOFormValue(val);
    if (this._fControl) {
      this._fControl.setValue(this.value.value, options);
      if (setDirty) {
        this._fControl.markAsDirty();
      }
      if (this._fControl.invalid && !this.form.isInInsertMode()) {
        this._fControl.markAsTouched();
      }
    }
    this.oldValue = this.value.value;
  }

  protected updateValidators(): void {
    if (!this._fControl) {
      return;
    }
    const self = this;
    this._fControl.clearValidators();
    this.errorsData = [];
    const validators = this.resolveValidators();
    if (this.validatorChildren) {
      this.validatorChildren.forEach((oValidator: OValidatorComponent) => {
        const validatorFunction: ValidatorFn = oValidator.getValidatorFn();
        if (validatorFunction) {
          validators.push(validatorFunction);
        }
        const errorsData: IErrorData[] = oValidator.getErrorsData();
        self.errorsData.push(...errorsData);
      });
    }
    this._fControl.setValidators(validators);
  }

  protected addOntimizeCustomAppearanceClass(): void {
    try {
      if (this.elRef) {
        const matFormFieldEl = this.elRef.nativeElement.getElementsByTagName('mat-form-field');
        if (matFormFieldEl && matFormFieldEl.length === 1) {
          matFormFieldEl.item(0).classList.add('mat-form-field-appearance-ontimize');
        }
      }
    } catch (e) {
      //
    }
  }

  protected getTooltipClass(): string {
    const liteError = this.errorOptions.type === Codes.O_MAT_ERROR_LITE;
    if (!liteError) {
      return super.getTooltipClass();
    }
    const errorClass = Util.isDefined(this._fControl.errors) ? 'o-mat-error' : '';
    return `${super.getTooltipClass()} ${errorClass}`;
  }

  protected getTooltipText(): string {
    const liteError = this.errorOptions.type === Codes.O_MAT_ERROR_LITE;
    if (liteError && Util.isDefined(this._fControl.errors) && this.oMatErrorChildren && this.oMatErrorChildren.length > 0) {
      let result: string = '';
      this.oMatErrorChildren.forEach((oMatError: OMatErrorComponent) => {
        result += `${oMatError.text}\n`;
      });
      return result;
    }
    return super.getTooltipText();
  }

  protected parsePermissions(): void {
    // if oattr in form, it can have permissions
    if (!this.form || !Util.isDefined(this.form.oattr)) {
      return;
    }
    const permissions: OPermissions = this.form.getFormComponentPermissions(this.oattr);
    if (!Util.isDefined(permissions)) {
      return;
    }
    if (permissions.visible === false) {
      /* hide input per permissions */
      this.elRef.nativeElement.remove();
      this.destroy();
    } else if (permissions.enabled === false) {
      /* disable input per permissions */
      this.enabled = false;
      if (this.form) {
        this.form.registerFormComponent(this);
      }
    }
    this.permissions = permissions;
  }

  protected getMutationObserverTarget(): any {
    let result;
    try {
      result = this.elementRef.nativeElement.getElementsByTagName('input').item(0);
    } catch (error) {
      //
    }
    return result;
  }

  protected setSuffixClass(count: number): void {
    const iconFieldEl = this.elRef.nativeElement.getElementsByClassName('icon-field');
    if (iconFieldEl.length === 1) {
      const classList = [].slice.call(iconFieldEl[0].classList);
      classList.forEach(className => {
        if (className.startsWith('icon-field-')) {
          iconFieldEl[0].classList.remove(className);
        }
      });
      if (count > 0) {
        const matSuffixClass = `icon-field-${count}-suffix`;
        iconFieldEl[0].classList.add(matSuffixClass);
      }
    }
  }

  /**
   * Do not allow the disabled attribute to change by code or by inspector
   */
  private disableFormControl(): void {
    const control = this.getFormControl();
    control.disable({
      onlySelf: true,
      emitEvent: false
    });
  }

}
