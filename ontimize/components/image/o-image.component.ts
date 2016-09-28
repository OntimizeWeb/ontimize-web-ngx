import {Component, Inject, Injector, forwardRef, ElementRef, OnInit,
  EventEmitter, NgZone, ChangeDetectorRef, ViewChild,
  NgModule,
  ModuleWithProviders,
  ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import {ValidatorFn } from '@angular/forms/src/directives/validators';
import {DomSanitizer } from '@angular/platform-browser';

import {MdIconModule} from '@angular2-material/icon';
import {MdInputModule, MdInput} from '@angular2-material/input';

import {IFormComponent, IFormControlComponent, IFormDataTypeComponent} from '../../interfaces';
import {InputConverter} from '../../decorators';
import {OFormComponent, Mode} from '../form/o-form.component';
import {OFormValue} from '../form/OFormValue';
import {OTranslateService} from '../../services';
import {SQLTypes} from '../../utils';
import {OTranslateModule} from '../../pipes/o-translate.pipe';

export const DEFAULT_INPUTS_O_IMAGE = [
  'oattr: attr',
  'olabel: label',
  'data',
  'oenabled: enabled',
  'orequired: required',
  'emptyimage: empty-image',
  // show-controls [yes|no true|false]: Shows or hides selection controls. Default: true.
  'showControls: show-controls',

  // sqltype[string]: Data type according to Java standard. See SQLType class. Default: 'OTHER'
  'sqlType: sql-type'
];

export const DEFAULT_OUTPUTS_O_IMAGE = [
  'onChange'
];

@Component({
  selector: 'o-image',
  templateUrl: '/image/o-image.component.html',
  styleUrls: ['/image/o-image.component.css'],
  inputs: [
    ...DEFAULT_INPUTS_O_IMAGE
  ],
  outputs: [
    ...DEFAULT_OUTPUTS_O_IMAGE
  ],
  encapsulation: ViewEncapsulation.None
})
export class OImageComponent implements IFormComponent, IFormControlComponent, IFormDataTypeComponent, OnInit {

  public static DEFAULT_INPUTS_O_IMAGE = DEFAULT_INPUTS_O_IMAGE;
  public static DEFAULT_OUTPUTS_O_IMAGE = DEFAULT_OUTPUTS_O_IMAGE;

  oattr: string;
  olabel: string;
  @InputConverter()
  oenabled: boolean = true;
  @InputConverter()
  orequired: boolean = false;
  emptyimage: string;
  @InputConverter()
  showControls: boolean = true;
  sqlType: string;

  onChange: EventEmitter<Object> = new EventEmitter<Object>();

  @ViewChild('inputControl')
  protected inputControl: MdInput;

  protected value: OFormValue;
  protected translateService: OTranslateService;
  protected _SQLType: number = SQLTypes.BLOB;

  protected _fControl: FormControl;
  private _domSanitizer: DomSanitizer;

  private _disabled: boolean;
  private _isReadOnly: boolean;

  constructor( @Inject(forwardRef(() => OFormComponent)) protected form: OFormComponent,
    protected elRef: ElementRef,
    protected ngZone: NgZone,
    protected cd: ChangeDetectorRef,
    protected injector: Injector) {
    // domSanitizer: DomSanitizer) {

    this._domSanitizer = this.injector.get(DomSanitizer);
    this.translateService = this.injector.get(OTranslateService);
  }

  ngOnInit() {
    this._disabled = !this.oenabled;

    this._SQLType = SQLTypes.getSQLTypeValue(this.sqlType ? this.sqlType : 'BLOB');

    if (this.form) {
      this.form.registerFormComponent(this);
      this.form.registerFormControlComponent(this);
      this.form.registerSQLTypeFormComponent(this);
      this._isReadOnly = this.form.mode === Mode.INITIAL ? true : false;
    } else {
      this._isReadOnly = this._disabled;
    }
  }

  ensureOFormValue(val: any) {
    if (val instanceof OFormValue) {
      if (val.value && val.value['bytes'] !== undefined) {
        this.value = new OFormValue(val.value.bytes);
        return;
      } else if (val.value === undefined) {
        val.value = '';
       }
      this.value = new OFormValue(val.value);
    } else if (val && !(val instanceof OFormValue)) {
      if (val['bytes'] !== undefined) {
        val = val['bytes'];
      } else if (val.length > 300 && val.substring(0, 4) === 'data') {
        // Removing "data:image/*;base64,"
          val = val.substring(val.indexOf('base64') + 7);
        }
      this.value = new OFormValue(val);
    } else {
      this.value = new OFormValue('');
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
      this._fControl = new FormControl('', validators);
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

   setValue(val: string): void {

    var self = this;
    window.setTimeout(() => {
      self.inputControl.value = val;
      self.ensureOFormValue(val);
      if (val && val.length > 0) {
        self.cd.detectChanges();
      }
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

  get isRequired(): boolean {
    return this.orequired;
  }

  set required(value: boolean) {
    var self = this;
    window.setTimeout(() => {
      self.orequired = value;
    }, 0);
  }

  innerOnChange(event: any) {
    this.onChange.emit(event);
  }

  isEmpty(): boolean {
    return !this.getValue() || this.getValue().length === 0;
  }

  fileChange(input, label): void {
    if (input.files[0]) {
      var reader = new FileReader();
      var self = this;
      reader.addEventListener('load', (event) => {
        let result = event.target['result'];
        if (result && result.length > 300 && result.substring(0, 4) === 'data') {
          // Removing "data:image/*;base64,"
          result = result.substring(result.indexOf('base64') + 7);
        }
        self.setValue(result);
        event.stopPropagation();
      }, false);
      if (input.files[0]) {
        reader.readAsDataURL(input.files[0]);
      }
      if (label) {
        label.textContent = input.files[0]['name'];
      }
    }
  }

  getSrcValue() {
    if (this.value && this.value.value) {
      if (this.value.value instanceof Object && this.value.value.bytes) {
        let src: string = '';
        if (this.value.value.bytes.substring(0, 4) === 'data') {
          src = 'data:image/*;base64,' + this.value.value.bytes.substring(this.value.value.bytes.indexOf('base64') + 7);
        } else {
          src = 'data:image/*;base64,' + this.value.value.bytes;
        }

        return this._domSanitizer.bypassSecurityTrustUrl(src);
      } else if (typeof this.value.value === 'string' &&
        this.value.value.length > 300) {
        let src: string = '';
        if (this.value.value.substring(0, 4) === 'data') {
          src = 'data:image/*;base64,' + this.value.value.substring(this.value.value.indexOf('base64') + 7);
        } else {
          src = 'data:image/*;base64,' + this.value.value;
        }

        return this._domSanitizer.bypassSecurityTrustUrl(src);
      }
      return this.value.value ? this.value.value : this.emptyimage;
    } else if (this.emptyimage) {
      return this.emptyimage;
    }
  }

  onClickBlocker(evt: Event) {
    evt.stopPropagation();
  }

  onClickClear(e: Event, label:any): void {
    e.stopPropagation();
    if (!this._isReadOnly) {
      this.setValue('');
      if (label) {
        label.textContent = '';
      }
    }
  }

}

@NgModule({
  declarations: [OImageComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MdInputModule, MdIconModule, OTranslateModule],
  exports: [OImageComponent],
})
export class OImageModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OImageModule,
      providers: []
    };
  }
}

