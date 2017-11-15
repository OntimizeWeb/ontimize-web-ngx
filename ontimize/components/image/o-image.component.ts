import {
  Component,
  Inject,
  Injector,
  forwardRef,
  ElementRef,
  EventEmitter,
  Optional,
  ViewChild,
  NgModule,
  ViewEncapsulation
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { MdInput } from '@angular/material';

import { OSharedModule } from '../../shared';
import { CommonModule } from '@angular/common';
import { InputConverter } from '../../decorators';
import { OFormComponent } from '../form/o-form.component';
import { OFormValue } from '../form/OFormValue';

import { OFormDataComponent } from '../o-form-data-component.class';

export const DEFAULT_INPUTS_O_IMAGE = [
  'oattr: attr',
  'olabel: label',
  'tooltip',
  'tooltipPosition: tooltip-position',
  'tooltipShowDelay: tooltip-show-delay',
  'data',
  'autoBinding: automatic-binding',
  'oenabled: enabled',
  'orequired: required',
  'emptyimage: empty-image',
  // empty-icon [string]: material icon. Default: photo.
  'emptyicon: empty-icon',
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
  templateUrl: './o-image.component.html',
  styleUrls: ['./o-image.component.scss'],
  inputs: [
    ...DEFAULT_INPUTS_O_IMAGE
  ],
  outputs: [
    ...DEFAULT_OUTPUTS_O_IMAGE
  ],
  encapsulation: ViewEncapsulation.None
})
export class OImageComponent extends OFormDataComponent {

  public static DEFAULT_INPUTS_O_IMAGE = DEFAULT_INPUTS_O_IMAGE;
  public static DEFAULT_OUTPUTS_O_IMAGE = DEFAULT_OUTPUTS_O_IMAGE;

  emptyimage: string;
  emptyicon: string;
  @InputConverter()
  protected showControls: boolean = true;

  onChange: EventEmitter<Object> = new EventEmitter<Object>();

  @ViewChild('inputControl')
  protected inputControl: MdInput;
  @ViewChild('titleLabel')
  protected titleLabel: ElementRef;

  protected _useEmptyIcon: boolean = true;
  protected _useEmptyImage: boolean = false;

  protected _domSanitizer: DomSanitizer;

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector) {
    super(form, elRef, injector);
    this._domSanitizer = this.injector.get(DomSanitizer);
    this.defaultValue = '';
    this._defaultSQLTypeKey = 'BLOB';
  }

  ngOnInit() {
    this.initialize();

    if (this.emptyimage && this.emptyimage.length > 0) {
      this._useEmptyIcon = false;
      this._useEmptyImage = true;
    }

    if (this.emptyicon === undefined && !this._useEmptyImage) {
      this.emptyicon = 'photo';
      this._useEmptyIcon = true;
      this._useEmptyImage = false;
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
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

  innerOnChange(event: any) {
    if (this._fControl && this._fControl.touched) {
      this._fControl.markAsDirty();
    }
    this.onChange.emit(event);
  }

  isEmpty(): boolean {
    return !this.getValue() || this.getValue().length === 0;
  }

  fileChange(input): void {
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
        if (self._fControl) {
          self._fControl.markAsTouched();
        }
        event.stopPropagation();
      }, false);
      if (input.files[0]) {
        reader.readAsDataURL(input.files[0]);
      }
      if (this.titleLabel) {
        this.titleLabel.nativeElement.textContent = input.files[0]['name'];
      }
    }
  }

  getSrcValue() {
    if (this.value && this.value.value) {
      if (this.value.value instanceof Object && this.value.value.bytes) {
        let src: string = '';
        if (this.value.value.bytes.substring(0, 4) === 'data') {
          src = 'data:image/png;base64,' + this.value.value.bytes.substring(this.value.value.bytes.indexOf('base64') + 7);
        } else {
          src = 'data:image/png;base64,' + this.value.value.bytes;
        }

        return this._domSanitizer.bypassSecurityTrustUrl(src);
      } else if (typeof this.value.value === 'string' &&
        this.value.value.length > 300) {
        let src: string = '';
        if (this.value.value.substring(0, 4) === 'data') {
          src = 'data:image/png;base64,' + this.value.value.substring(this.value.value.indexOf('base64') + 7);
        } else {
          src = 'data:image/png;base64,' + this.value.value;
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

  onClickClear(e: Event): void {
    e.stopPropagation();
    if (!this._isReadOnly && !this.isDisabled) {
      this.setValue(undefined);
      if (this.titleLabel) {
        this.titleLabel.nativeElement.textContent = '';
      }
    }
    if (this._fControl) {
      this._fControl.markAsTouched();
    }
  }

  hasControls(): boolean {
    return this.showControls;
  }

  useEmptyIcon(): boolean {
    return this._useEmptyIcon && this.isEmpty();
  }

  useEmptyImage(): boolean {
    return this._useEmptyImage && this.isEmpty();
  }
}

@NgModule({
  declarations: [OImageComponent],
  imports: [OSharedModule, CommonModule],
  exports: [OImageComponent]
})
export class OImageModule {
}
