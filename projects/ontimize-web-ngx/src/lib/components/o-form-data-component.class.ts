import {
  AfterViewInit,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  HostListener,
  inject,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  QueryList,
  SimpleChange,
  ViewChildren
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AsyncValidatorFn, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { FloatLabelType, MatError, MatFormFieldAppearance, MatSuffix, SubscriptSizing } from '@angular/material/form-field';
import { Subscription } from 'rxjs';

import { O_INPUTS_OPTIONS } from '../config/app-config';
import { BooleanConverter, BooleanInputConverter } from '../decorators/input-converter';
import { OMatErrorDirective } from '../directives/o-mat-error.directive';
import { IFormDataComponent } from '../interfaces/form-data-component.interface';
import { IFormDataTypeComponent } from '../interfaces/form-data-type-component.interface';
import { PermissionsService } from '../services/permissions/permissions.service';
import { OValidatorComponent } from '../shared/components/validation/o-validator.component';
import { ErrorData } from '../types/error-data.type';
import { FormValueOptions } from '../types/form-value-options.type';
import { OInputsOptions } from '../types/o-inputs-options.type';
import { OMatErrorOptions } from '../types/o-mat-error.type';
import { OPermissions } from '../types/o-permissions.type';
import { Codes } from '../util/codes';
import { ErrorsUtils } from '../util/errors';
import { PermissionsUtils } from '../util/permissions';
import { SQLTypes } from '../util/sqltypes';
import { Util } from '../util/util';
import { OFormValue } from './form/o-form-value';
import { IOFormParent, O_FORM_CONTEXT } from '../interfaces/o-form-parent.interface';
import { OFormControl } from './input/o-form-control.class';
import { OBaseComponent } from './o-component.class';
import { OValueChangeEvent } from './o-value-change-event.class';

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
  'angularValidatorsFnErrors: validators-errors',
  'appearance',
  'hideRequiredMarker:hide-required-marker',
  'labelVisible:label-visible',
  'selectAllOnClick:select-all-on-click',
  'angularAsyncValidatorsFn: async-validators',

  // data-testid [string]: forwarded to the native control's `data-testid` attribute, for E2E testing (Playwright/Cypress).
  'dataTestId: data-testid'
];

export const DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT = [
  'onChange',
  'onValueChange',
  'onFocus',
  'onBlur'
];

@Directive({
  inputs: DEFAULT_INPUTS_O_FORM_DATA_COMPONENT,
  outputs: DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => OFormDataComponent), multi: true }
  ]
})
export class OFormDataComponent extends OBaseComponent implements IFormDataComponent, IFormDataTypeComponent,
  ControlValueAccessor, OnInit, AfterViewInit, OnDestroy, OnChanges {
  /* Inputs */
  /** Forwarded to the native control's `data-testid` attribute, for E2E testing (Playwright/Cypress). */
  public dataTestId: string;
  public sqlType: string;
  @BooleanInputConverter()
  public autoBinding: boolean = true;
  @BooleanInputConverter()
  public autoRegistering: boolean = true;
  public width: string;
  @BooleanInputConverter()
  public clearButton: boolean = false;
  public angularValidatorsFn: ValidatorFn[] = [];
  public angularValidatorsFnErrors: ErrorData[] = [];
  @BooleanInputConverter()
  public hideRequiredMarker: boolean = false;
  @BooleanInputConverter()
  public labelVisible: boolean = true;
  @BooleanInputConverter()
  public selectAllOnClick: boolean = false;
  public angularAsyncValidatorsFn: AsyncValidatorFn[] = [];

  @Input()
  get subscriptSizing(): SubscriptSizing {
    return this._subscriptSizing
      ?? this.oInputsOptions?.subscriptSizing
      ?? (this.errorOptions?.type === 'lite' ? 'dynamic' : 'fixed');
  }
  set subscriptSizing(value: SubscriptSizing) {
    this._subscriptSizing = value ?? null;
  }
  private _subscriptSizing: SubscriptSizing | null = null;

  /* Outputs */
  public onChange: EventEmitter<object> = new EventEmitter<object>();
  public onValueChange: EventEmitter<OValueChangeEvent> = new EventEmitter<OValueChangeEvent>();
  public onFocus: EventEmitter<object> = new EventEmitter<object>();
  public onBlur: EventEmitter<object> = new EventEmitter<object>();

  @HostBinding('style.width')
  get hostWidth(): string {
    return this.width;
  }

  @HostListener('click', [])
  handleClick(): void {
    if (this.selectAllOnClick) {
      this.selectValue();
    }
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
  protected form: IOFormParent;
  protected oldValue: any;

  private _cvaOnChange: (value: any) => void = () => {};
  private _cvaOnTouched: () => void = () => {};
  private _writingValue = false;

  protected _floatLabel: FloatLabelType;
  protected _appearance: MatFormFieldAppearance;

  protected matSuffixSubscription: Subscription;
  @ViewChildren(MatSuffix)
  protected _matSuffixList: QueryList<MatSuffix>;

  errorsData: ErrorData[] = [];
  protected validatorsSubscription: Subscription;
  @ContentChildren(OValidatorComponent)
  validatorChildren: QueryList<OValidatorComponent>;

  protected permissionsService: PermissionsService;
  protected mutationObserver: MutationObserver;

  errorOptions: OMatErrorOptions;
  @ViewChildren(OMatErrorDirective)
  oMatErrorChildren: QueryList<OMatErrorDirective>;
  @ContentChildren(MatError) protected _errorChildren: QueryList<MatError>;

  protected oInputsOptions: OInputsOptions;

  constructor(
    elRef: ElementRef,
    injector: Injector
  ) {
    super(injector);
    this.form = inject(O_FORM_CONTEXT, { optional: true });
    this.elRef = elRef;
    this.permissionsService = this.injector.get<PermissionsService>(PermissionsService);
    this.errorOptions = ErrorsUtils.getErrorOptions(this.injector);
    try {
      this.oInputsOptions = this.injector.get(O_INPUTS_OPTIONS);
      this.selectAllOnClick = this.oInputsOptions.selectAllOnClick;
    } catch (e) {
      this.oInputsOptions = {};
      this.selectAllOnClick = false;
    }
  }

  public ngOnInit(): void {
    this.initialize();
  }

  public ngAfterViewInit(): void {
    if (this._matSuffixList) {
      this.setSuffixClass(this._matSuffixList.length);
      this.matSuffixSubscription = this._matSuffixList.changes.subscribe(() => {
        this.setSuffixClass(this._matSuffixList.length);
      });
    }

    if (this.validatorChildren) {
      this.validatorsSubscription = this.validatorChildren.changes.subscribe(() => {
        this.updateValidators();
      });
      if (this.validatorChildren.length > 0) {
        this.updateValidators();
      }
    }

    if (!this.hasEnabledPermission) {
      this.mutationObserver = PermissionsUtils.registerDisabledChangesInDom(this.getMutationObserverTarget(), {
        callback: this.disableFormControl.bind(this)
      });
    }
    this.addOntimizeCustomAppearanceClass();
    Util.parseOInputsOptions(this.elRef, this.oInputsOptions);
  }

  public ngOnDestroy(): void {
    this.destroy();
  }

  public ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    if (Util.isDefined(changes.angularValidatorsFn) || Util.isDefined(changes.angularAsyncValidatorsFn)) {
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
    if (!this.form) {
      const control = this.getControl();
      const key = this.oattr || '_standalone';
      const group: Record<string, OFormControl> = {};
      group[key] = control;
      this._fGroup = new FormGroup(group);
      return this._fGroup;
    }
    let formGroup = this.form.formGroup;
    if (!this.hasEnabledPermission() || !this.hasVisiblePermission()) {
      const control = this.getControl();
      const group: Record<string, OFormControl> = {};
      group[this.oattr] = control;
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

  public hasSomeError(): boolean {
    return !this.isReadOnly && this._fControl && this._fControl.touched && Util.isDefined(this._fControl.errors);
  }

  public getErrorValue(error: string, prop: string): string {
    return this._fControl?.hasError(error) ? this._fControl.getError(error)[prop] ?? '' : '';
  }

  public getActiveOErrors(): ErrorData[] {
    return ErrorsUtils.getActiveOErrors(this);
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

  public setValue(val: any, options: FormValueOptions = {}, setDirty: boolean = false): void {
    if (!PermissionsUtils.checkEnabledPermission(this.permissions)) {
      return;
    }
    if (this.oldValue !== val) {
      const previousValue = this.oldValue;
      // emitEvent:false means _fControl.valueChanges won't fire → onFormControlChange won't call _cvaOnChange
      const suppressedEvent = options.emitEvent === false;
      this.setFormValue(val, options, setDirty);
      if (!this._writingValue && suppressedEvent) {
        this._cvaOnChange(this.getValue());
      }
      if (options && options.emitModelToViewValueChange !== false) {
        const changeType: number = (options.hasOwnProperty('changeType')) ? options.changeType : OValueChangeEvent.PROGRAMMATIC_CHANGE;
        this.emitOnValueChange(changeType, val, previousValue);
      }
    }
  }

  /**
   * Clears the component value.
   */
  public clearValue(options?: FormValueOptions, setDirty: boolean = false): void {
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
    if (!this._writingValue) {
      this._cvaOnChange(this.getValue());
    }
  }

  writeValue(value: any): void {
    this._writingValue = true;
    if (this._fControl) {
      this.setFormValue(value);
    } else {
      this.ensureOFormValue(value);
    }
    this._writingValue = false;
  }

  registerOnChange(fn: (value: any) => void): void {
    this._cvaOnChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._cvaOnTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.enabled = !isDisabled;
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
  public createFormControl(cfg?, validators?: ValidatorFn | ValidatorFn[], asyncValidators?: AsyncValidatorFn | AsyncValidatorFn[]): OFormControl {
    return new OFormControl(cfg, validators, asyncValidators);
  }

  public getControl(): OFormControl {
    if (!this._fControl) {
      const validators: ValidatorFn[] = this.resolveValidators();
      const asyncValidators: AsyncValidatorFn[] = this.resolveAsyncValidators();
      const cfg = {
        value: this.value ? this.value.value : undefined,
        disabled: !this.enabled
      };
      this._fControl = this.createFormControl(cfg, validators, asyncValidators);
      this.registerOnFormControlChange();
    }
    return this._fControl;
  }

  public resolveValidators(): ValidatorFn[] {
    const validators: ValidatorFn[] = [];
    if (this.angularValidatorsFn && this.angularValidatorsFn.length > 0) {
      validators.push(...this.angularValidatorsFn);
      ErrorsUtils.pushToErrorsData(this, this.angularValidatorsFnErrors);
    }

    if (this.orequired) {
      validators.push(Validators.required);
    }
    return validators;
  }

  public resolveAsyncValidators(): AsyncValidatorFn[] {
    if (this.angularAsyncValidatorsFn && this.angularAsyncValidatorsFn.length > 0) {
      ErrorsUtils.pushToErrorsData(this, this.angularValidatorsFnErrors);
    }
    return this.angularAsyncValidatorsFn || [];
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
    if (this._fControl && this.hasEnabledPermission() && this.hasVisiblePermission()) {
      value ? this._fControl.enable() : this._fControl.disable();
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

  set orequired(val: boolean | string) {
    const old = this._orequired;
    this._orequired = BooleanConverter(val);
    if (val !== old) {
      this.updateValidators();
    }
  }

  public innerOnFocus(event: FocusEvent): void {

    if (!this.isReadOnly && this.enabled) {
      this.onFocus.emit(event);
    }
  }

  public innerOnBlur(event: any): void {
    if (!this.isReadOnly && this.enabled) {
      this.onBlur.emit(event);
    }
    this._cvaOnTouched();
  }

  get appearance(): MatFormFieldAppearance {
    return this._appearance;
  }

  set appearance(value: MatFormFieldAppearance) {
    const values = ['fill', 'outline'];
    if (values.indexOf(value) === -1) {
      value = undefined;
    }
    this._appearance = value;
  }

  get floatLabel(): FloatLabelType {
    if (!this.labelVisible) {
      this._floatLabel = 'always';
    }
    return this._floatLabel;
  }

  set floatLabel(value: FloatLabelType) {
    const values = ['always', 'auto'];
    if (values.indexOf(value) === -1) {
      value = 'auto';
    }
    this._floatLabel = value;
  }

  public selectValue() {
    if (!this.enabled || this.isReadOnly) {
      return;
    }
    const inputEl = document.getElementById(this.oattr);
    if (inputEl) {
      (inputEl as HTMLInputElement).select();
    }
  }

  protected registerOnFormControlChange(): void {
    if (this._fControl) {
      this._fControlSubscription = this._fControl.valueChanges.subscribe(value => {
        this.onFormControlChange(value);
      });
    }
  }

  protected emitOnValueChange(type, newValue, oldValue): void {
    const event = new OValueChangeEvent(type, newValue, oldValue, this);
    this.onValueChange.emit(event);
  }

  protected setFormValue(val: any, options?: FormValueOptions, setDirty: boolean = false): void {
    this.ensureOFormValue(val);
    if (this._fControl) {
      this.updateOFormControlValue(this.value.value, options, setDirty);
    }
    this.oldValue = this.value.value;
  }

  protected updateOFormControlValue(value: any, options?: FormValueOptions, setDirty: boolean = false): void {
    this._fControl.setValue(value, options);
    if (setDirty) {
      this._fControl.markAsDirty();
    }
    const isInsertMode = this.form?.isInInsertMode() ?? true;
    if (this._fControl.invalid && !isInsertMode) {
      this._fControl.markAsTouched();
    }
  }

  protected updateValidators(): void {
    ErrorsUtils.updateFormControlValidators(this);
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
    return ErrorsUtils.getTooltipClasses(this);
  }

  protected getTooltipText(): string {
    const liteError = this.errorOptions.type === Codes.O_MAT_ERROR_LITE;
    return liteError && this.hasSomeError() ? ErrorsUtils.getErrorsTooltipText(this) : super.getTooltipText();
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
      const classList: Array<string> = Array.from(iconFieldEl[0].classList || []);
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
