import {
  Component, Inject, Injector, forwardRef, ElementRef, OnInit, EventEmitter,
  NgZone, ChangeDetectorRef,
  NgModule,
  ModuleWithProviders,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { ValidatorFn } from '@angular/forms/src/directives/validators';

import { MdInputModule } from '@angular/material';

import {
  IFormComponent, IFormControlComponent, IFormDataTypeComponent,
  IFormDataComponent
} from '../../../interfaces';
import { OSharedModule } from '../../../shared.module';
import { InputConverter } from '../../../decorators';
import { OFormComponent, Mode } from '../../form/o-form.component';
import { OFormValue } from '../../form/OFormValue';
import { OTranslateService } from '../../../services';
import { SQLTypes } from '../../../utils';
import { OTranslateModule } from '../../../pipes/o-translate.pipe';

export const DEFAULT_INPUTS_O_TEXT_INPUT = [
  'oattr: attr',
  'olabel: label',
  'data',
  'autoBinding: automatic-binding',
  'oenabled: enabled',
  'orequired: required',
  'minLength: min-length',
  'maxLength: max-length',

  // sqltype[string]: Data type according to Java standard. See SQLType class. Default: 'OTHER'
  'sqlType: sql-type'
];

export const DEFAULT_OUTPUTS_O_TEXT_INPUT = [
  'onChange',
  'onFocus',
  'onBlur'
];

@Component({
  selector: 'o-text-input',
  templateUrl: '/input/text-input/o-text-input.component.html',
  styleUrls: ['/input/text-input/o-text-input.component.css'],
  inputs: [
    ...DEFAULT_INPUTS_O_TEXT_INPUT
  ],
  outputs: [
    ...DEFAULT_OUTPUTS_O_TEXT_INPUT
  ],
  encapsulation: ViewEncapsulation.None
})
export class OTextInputComponent implements IFormComponent, IFormControlComponent, IFormDataTypeComponent, IFormDataComponent, OnInit {

  public static DEFAULT_INPUTS_O_TEXT_INPUT = DEFAULT_INPUTS_O_TEXT_INPUT;
  public static DEFAULT_OUTPUTS_O_TEXT_INPUT = DEFAULT_OUTPUTS_O_TEXT_INPUT;

  oattr: string;
  olabel: string;
  @InputConverter()
  oenabled: boolean = true;
  @InputConverter()
  orequired: boolean = false;
  @InputConverter()
  autoBinding: boolean = true;
  @InputConverter()
  minLength: number = -1;
  @InputConverter()
  maxLength: number = -1;
  sqlType: string;

  onChange: EventEmitter<Object> = new EventEmitter<Object>();
  onFocus: EventEmitter<Object> = new EventEmitter<Object>();
  onBlur: EventEmitter<Object> = new EventEmitter<Object>();

  protected value: OFormValue;
  protected translateService: OTranslateService;
  protected _SQLType: number = SQLTypes.OTHER;
  protected _fControl: FormControl;
  protected _disabled: boolean;
  protected _isReadOnly: boolean;
  protected _placeholder: string;

  constructor( @Inject(forwardRef(() => OFormComponent)) protected form: OFormComponent,
    protected elRef: ElementRef,
    protected ngZone: NgZone,
    protected cd: ChangeDetectorRef,
    protected injector: Injector) {

    this.translateService = this.injector.get(OTranslateService);
  }

  ngOnInit() {
    this.disabled = !this.oenabled;

    this._placeholder = this.olabel ? this.olabel : this.oattr;

    if (this.form) {
      this.form.registerFormComponent(this);
      this.form.registerFormControlComponent(this);
      this.form.registerSQLTypeFormComponent(this);

      this._isReadOnly = this.form.mode === Mode.INITIAL ? true : false;
    } else {
      this._isReadOnly = this._disabled;
    }
  }

  ensureOFormValue(value: any) {
    if (value instanceof OFormValue) {
      this.value = new OFormValue(value.value);
    } else if (value && !(value instanceof OFormValue)) {
      this.value = new OFormValue(value);
    } else {
      this.value = new OFormValue(undefined);
    }
  }

  ngOnDestroy() {
    if (this.form) {
      this.form.unregisterFormComponent(this);
      this.form.unregisterFormControlComponent(this);
      this.form.unregisterSQLTypeFormComponent(this);
    }
  }

  getAttribute() {
    if (this.oattr) {
      return this.oattr;
    } else if (this.elRef && this.elRef.nativeElement.attributes['attr']) {
      return this.elRef.nativeElement.attributes['attr'].value;
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
    if (this.minLength >= 0) {
      validators.push(Validators.minLength(this.minLength));
    }
    if (this.maxLength >= 0) {
      validators.push(Validators.maxLength(this.maxLength));
    }

    return validators;
  }

  getSQLType(): number {
    let sqlt = this.sqlType && this.sqlType.length > 0 ? this.sqlType : 'OTHER';
    this._SQLType = SQLTypes.getSQLTypeValue(sqlt);
    return this._SQLType;
  }

  set data(value: any) {
    this.ensureOFormValue(value);
  }

  isAutomaticBinding(): Boolean {
    return this.autoBinding;
  }

  getValue(): any {
    if (this.value instanceof OFormValue) {
      if (this.value.value) {
        return this.value.value;
      }
    }
    return undefined;
  }

  setValue(val: any) {
    this.ensureOFormValue(val);
  }

  get placeHolder(): string {
    if (this.translateService) {
      return this.translateService.get(this._placeholder);
    }
    return this._placeholder;
  }

  set placeHolder(value: string) {
    this._placeholder = value;
  }

  get isReadOnly(): boolean {
    return this._isReadOnly;
  }

  set isReadOnly(value: boolean) {
    if (this._disabled) {
      this._isReadOnly = false;
      return;
    }
    this._isReadOnly = value;
  }

  get isDisabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = value;
  }

  get isRequired(): boolean {
    return this.orequired;
  }

  set required(value: boolean) {
    this.orequired = value;
  }

  innerOnChange(event: any) {
    if (!this.value) {
      this.value = new OFormValue();
    }
    this.ensureOFormValue(event);
    this.onChange.emit(event);
  }

  innerOnFocus(event: any) {
    if (!this.isReadOnly && !this.isDisabled) {
      this.onFocus.emit(event);
    }
  }

  innerOnBlur(event: any) {
    if (!this.isReadOnly && !this.isDisabled) {
      this.onBlur.emit(event);
    }
  }

  get isValid() {
    if (this._fControl) {
      return this._fControl.valid;
    }
    return false;
  }

}

@NgModule({
  declarations: [OTextInputComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, OSharedModule, MdInputModule, OTranslateModule],
  exports: [OTextInputComponent, CommonModule, FormsModule, ReactiveFormsModule, MdInputModule, OTranslateModule],
})
export class OTextInputModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OTextInputModule,
      providers: []
    };
  }
}
