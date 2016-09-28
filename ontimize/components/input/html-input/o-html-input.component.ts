import {Component, Inject, Injector, forwardRef,
  ElementRef, OnInit, EventEmitter, ViewChild,
  ChangeDetectorRef, NgZone,
  NgModule,
  ModuleWithProviders,
  ViewEncapsulation} from '@angular/core';

import {CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import {ValidatorFn } from '@angular/forms/src/directives/validators';

import {MdCKEditorModule, CKEditor} from '../../material/ckeditor/ckeditor.component';
import {MdInputModule} from '@angular2-material/input';

import {IFormComponent, IFormControlComponent, IFormDataTypeComponent} from '../../../interfaces';
import {InputConverter} from '../../../decorators';
import {OFormComponent, Mode} from '../../form/o-form.component';
import {OFormValue} from '../../form/OFormValue';
import {OTranslateService} from '../../../services';
import {SQLTypes} from '../../../utils';
import {OTranslateModule} from '../../../pipes/o-translate.pipe';

export const DEFAULT_INPUTS_O_HTML_INPUT = [
  'oattr: attr',
  'olabel: label',
  'data',
  'oenabled: enabled',
  'orequired: required',
  'minLength: min-length',
  'maxLength: max-length',

  // sqltype[string]: Data type according to Java standard. See SQLType class. Default: 'OTHER'
  'sqlType: sql-type'
];

export const DEFAULT_OUTPUTS_O_HTML_INPUT = [
  'onChange'
];

@Component({
  selector: 'o-html-input',
  templateUrl: '/input/html-input/o-html-input.component.html',
  styleUrls: ['/input/html-input/o-html-input.component.css'],
  inputs: [
    ...DEFAULT_INPUTS_O_HTML_INPUT
  ],
  outputs: [
    ...DEFAULT_OUTPUTS_O_HTML_INPUT
  ],
  encapsulation: ViewEncapsulation.None
})
export class OHTMLInputComponent implements IFormComponent, IFormControlComponent, IFormDataTypeComponent, OnInit {

  public static DEFAULT_INPUTS_O_HTML_INPUT = DEFAULT_INPUTS_O_HTML_INPUT;
  public static DEFAULT_OUTPUTS_O_HTML_INPUT = DEFAULT_OUTPUTS_O_HTML_INPUT;

  oattr: string;
  olabel: string;
  @InputConverter()
  oenabled: boolean = true;
  @InputConverter()
  orequired: boolean = true;
  @InputConverter()
  minLength: number = -1;
  @InputConverter()
  maxLength: number = -1;
  sqlType: string;

  onChange: EventEmitter<Object> = new EventEmitter<Object>();

  @ViewChild('ckEditor') ckEditor:CKEditor;

  protected value: OFormValue;
  protected translateService: OTranslateService;
  protected _SQLType: number = SQLTypes.OTHER;

  private _disabled: boolean;
  private _isReadOnly: boolean;
  private _placeholder: string;
  private _fControl: FormControl;

  constructor( @Inject(forwardRef(() => OFormComponent)) protected form: OFormComponent,
    protected elRef: ElementRef,
    protected ngZone: NgZone,
    protected cd: ChangeDetectorRef,
    protected injector: Injector) {

    this.translateService = this.injector.get(OTranslateService);
  }

  ngOnInit() {
    this._disabled = !this.oenabled;
    this._placeholder = this.olabel ? this.olabel : this.oattr;

    if (this.form) {
      this.form.registerFormComponent(this);
      this.form.registerFormControlComponent(this);
      this.isReadOnly = (this.form.mode === Mode.INITIAL ? true : false) ;
    } else {
      this.isReadOnly = this._disabled;
    }
  }

  ensureOFormValue(value: any) {
    if (value instanceof OFormValue) {
      this.value = new OFormValue(value.value);
    } else if ( value && !(value instanceof OFormValue)) {
      this.value = new OFormValue(value);
    } else {
      this.value = new OFormValue('');
    }
  }

  ngOnDestroy() {
     if (this.form) {
      this.form.unregisterFormComponent(this);
      this.form.unregisterFormControlComponent(this);
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

      this._fControl = new FormControl('', validators);
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

  getValue() : any {
    if (this.value instanceof OFormValue) {
      if (this.value.value) {
        return this.value.value;
      }
    }
    return '';
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
      if (self.ckEditor && self.ckEditor.instance
        && self.ckEditor.instance.setReadOnly) {
        self.ckEditor.instance.setReadOnly(value);
      }
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
      this.value = new OFormValue();
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

}

@NgModule({
  declarations: [OHTMLInputComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MdInputModule, MdCKEditorModule, OTranslateModule],
  exports: [OHTMLInputComponent],
})
export class OHTMLInputModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OHTMLInputModule,
      providers: []
    };
  }
}
