import {
  Component,
  Inject,
  Injector,
  forwardRef,
  ElementRef,
  OnInit,
  EventEmitter,
  Optional,
  ViewChild,
  NgModule,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validators } from '@angular/forms';
import { ValidatorFn } from '@angular/forms/src/directives/validators';
import { MdInput } from '@angular/material';

import { OSharedModule } from '../../../shared';
import { InputConverter } from '../../../decorators';
import { OFormComponent } from '../../form/o-form.component';
import { OFormValue } from '../../form/OFormValue';
import { OFormDataComponent } from '../../o-form-data-component.class';

export const DEFAULT_INPUTS_O_TEXT_INPUT = [
  'oattr: attr',
  'olabel: label',
  'tooltip',
  'tooltipPosition: tooltip-position',
  'tooltipShowDelay: tooltip-show-delay',
  'data',
  'autoBinding: automatic-binding',
  'oenabled: enabled',
  'orequired: required',
  'minLength: min-length',
  'maxLength: max-length',

  // sqltype[string]: Data type according to Java standard. See SQLType ngClass. Default: 'OTHER'
  'sqlType: sql-type'
];

export const DEFAULT_OUTPUTS_O_TEXT_INPUT = [
  'onChange',
  'onFocus',
  'onBlur'
];

@Component({
  selector: 'o-text-input',
  templateUrl: './o-text-input.component.html',
  styleUrls: ['./o-text-input.component.scss'],
  inputs: [
    ...DEFAULT_INPUTS_O_TEXT_INPUT
  ],
  outputs: [
    ...DEFAULT_OUTPUTS_O_TEXT_INPUT
  ],
  encapsulation: ViewEncapsulation.None
})
export class OTextInputComponent extends OFormDataComponent implements OnInit {

  public static DEFAULT_INPUTS_O_TEXT_INPUT = DEFAULT_INPUTS_O_TEXT_INPUT;
  public static DEFAULT_OUTPUTS_O_TEXT_INPUT = DEFAULT_OUTPUTS_O_TEXT_INPUT;

  @InputConverter()
  minLength: number = -1;
  @InputConverter()
  maxLength: number = -1;

  onChange: EventEmitter<Object> = new EventEmitter<Object>();
  onFocus: EventEmitter<Object> = new EventEmitter<Object>();
  onBlur: EventEmitter<Object> = new EventEmitter<Object>();

  @ViewChild('mdInputRef')
  protected mdInputRef: MdInput;

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector) {
    super(form, elRef, injector);
  }

  ngOnInit() {
    this.initialize();
  }

  ngOnDestroy() {
    this.destroy();
  }

  resolveValidators(): ValidatorFn[] {
    let validators: ValidatorFn[] = super.resolveValidators();

    if (this.minLength >= 0) {
      validators.push(Validators.minLength(this.minLength));
    }
    if (this.maxLength >= 0) {
      validators.push(Validators.maxLength(this.maxLength));
    }

    return validators;
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

}

@NgModule({
  declarations: [OTextInputComponent],
  imports: [OSharedModule, CommonModule],
  exports: [OTextInputComponent]
})
export class OTextInputModule {
}
