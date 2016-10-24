import {Component, Inject, Injector, OnInit,
  forwardRef, ElementRef, EventEmitter,
  NgZone, ChangeDetectorRef,
  NgModule,
  ModuleWithProviders,
  ViewEncapsulation} from '@angular/core';

import {CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import {ValidatorFn } from '@angular/forms/src/directives/validators';

import { MdInputModule } from '@angular2-material/input';
import {MdCheckboxModule} from '@angular2-material/checkbox';

import {
  IFormComponent, IFormControlComponent, IFormDataTypeComponent,
  IFormDataComponent
} from '../../interfaces';
import {InputConverter} from '../../decorators';
import {OFormComponent, Mode} from '../form/o-form.component';
import {OFormValue} from '../form/OFormValue';
import {OTranslateService} from '../../services';
import { OTranslateModule } from '../../pipes/o-translate.pipe';
import {SQLTypes} from '../../utils';


export const DEFAULT_INPUTS_O_CHECKBOX = [
  'oattr: attr',
  'olabel: label',
  'data',
  'autoBinding: automatic-binding',
  'oenabled: enabled',
  'orequired: required',
  // sqltype[string]: Data type according to Java standard. See SQLType class. Default: 'OTHER'
  'sqlType: sql-type'
];

export const DEFAULT_OUTPUTS_O_CHECKBOX = [
  'onChange'
];

@Component({
  selector: 'o-checkbox',
  inputs: [
    ...DEFAULT_INPUTS_O_CHECKBOX
  ],
  outputs: [
    ...DEFAULT_OUTPUTS_O_CHECKBOX
  ],
  templateUrl: '/checkbox/o-checkbox.component.html',
  styleUrls: ['/checkbox/o-checkbox.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class OCheckboxComponent implements IFormComponent, IFormControlComponent, IFormDataTypeComponent, IFormDataComponent, OnInit {

  public static DEFAULT_INPUTS_O_CHECKBOX = DEFAULT_INPUTS_O_CHECKBOX;
  public static DEFAULT_OUTPUTS_O_CHECKBOX = DEFAULT_OUTPUTS_O_CHECKBOX;

  oattr: string;
  olabel: string;
  @InputConverter()
  oenabled: boolean = true;
  @InputConverter()
  orequired: boolean = true;
  @InputConverter()
  autoBinding: boolean = true;
  sqlType: string;

  onChange: EventEmitter<Object> = new EventEmitter<Object>();

  protected value: OFormValue;
  protected translateService: OTranslateService;
  protected _SQLType: number = SQLTypes.OTHER;
  protected _disabled: boolean;
  protected _isReadOnly: boolean;
  protected _placeholder: string;
  protected _fControl: FormControl;

  constructor( @Inject(forwardRef(() => OFormComponent)) protected form: OFormComponent,
    protected elRef: ElementRef,
    protected ngZone: NgZone,
    protected cd: ChangeDetectorRef,
    protected injector: Injector) {

    this.translateService = this.injector.get(OTranslateService);
  }

  ngOnInit(): void {
    this._disabled = !this.oenabled;

    this._placeholder = this.olabel ? this.olabel : this.oattr;

    this.ensureOFormValue(this.data);

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
      if (value.value === undefined) {
        value.value = false;
      }
      this.value = new OFormValue(value.value);
    } else if ( typeof value === 'boolean') {
      this.value = new OFormValue(value);
    } else {
      this.value = new OFormValue(false);
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

      this._fControl = new FormControl(false, validators);
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
    let sqlt = this.sqlType && this.sqlType.length > 0 ? this.sqlType : 'BOOLEAN';
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
      if (typeof this.value.value === 'boolean') {
        return this.value.value;
      }
    }
    return false;
  }

  isChecked(): boolean {
    if (this.value instanceof OFormValue
      && typeof this.value.value === 'boolean') {
      return this.value.value;
    }
    return false;
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
    var self = this;
     window.setTimeout(() => {
      self._placeholder = value;
    }, 0);
  }

  get isReadOnly(): boolean {
    return this._isReadOnly;
  }

  set isReadOnly(value: boolean) {
    if (this._disabled) {
      return;
    }
    var self = this;
     window.setTimeout(() => {
      self._isReadOnly = value;
    }, 0);
  }

  get isDisabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    var self = this;
     window.setTimeout(() => {
      self._disabled = value;
    }, 0);
  }

  innerOnChange(event: any) {
    if (!this.value) {
      this.value = new OFormValue(false);
    }
    this.ensureOFormValue(event);
    this.onChange.emit(event);
  }

  get isValid() {
    if (this._fControl) {
      return this._fControl.valid;
    }
    return false;
  }

  onClickBlocker(evt: Event) {
    evt.stopPropagation();
  }

}


@NgModule({
  declarations: [OCheckboxComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MdInputModule, MdCheckboxModule, OTranslateModule],
  exports: [OCheckboxComponent],
})
export class OCheckboxModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OCheckboxModule,
      providers: []
    };
  }
}
