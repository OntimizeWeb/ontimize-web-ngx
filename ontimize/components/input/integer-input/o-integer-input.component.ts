import { Component, ElementRef, forwardRef, Inject, Injector, NgModule, OnInit, Optional, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';
import { ValidatorFn } from '@angular/forms/src/directives/validators';

import { Util } from '../../../util/util';
import { OSharedModule } from '../../../shared';
import { OFormValue } from '../../form/OFormValue';
import { InputConverter } from '../../../decorators';
import { OFormComponent } from '../../form/o-form.component';
import { IIntegerPipeArgument, OIntegerPipe } from '../../../pipes';
import { DEFAULT_INPUTS_O_TEXT_INPUT, DEFAULT_OUTPUTS_O_TEXT_INPUT, OTextInputComponent, OTextInputModule, } from '../text-input/o-text-input.component';

export const DEFAULT_INPUTS_O_INTEGER_INPUT = [
  ...DEFAULT_INPUTS_O_TEXT_INPUT,
  'min',
  'max',
  'step',
  'grouping',
  'thousandSeparator : thousand-separator',
  'olocale : locale'
];

export const DEFAULT_OUTPUTS_O_INTEGER_INPUT = [
  ...DEFAULT_OUTPUTS_O_TEXT_INPUT
];

@Component({
  selector: 'o-integer-input',
  templateUrl: './o-integer-input.component.html',
  styleUrls: ['./o-integer-input.component.scss'],
  inputs: DEFAULT_INPUTS_O_INTEGER_INPUT,
  outputs: DEFAULT_OUTPUTS_O_INTEGER_INPUT,
  encapsulation: ViewEncapsulation.None
})
export class OIntegerInputComponent extends OTextInputComponent implements OnInit {

  public static DEFAULT_INPUTS_O_INTEGER_INPUT = DEFAULT_INPUTS_O_INTEGER_INPUT;
  public static DEFAULT_OUTPUTS_O_INTEGER_INPUT = DEFAULT_OUTPUTS_O_INTEGER_INPUT;

  @InputConverter()
  min: number;
  @InputConverter()
  max: number;
  @InputConverter()
  step: number;

  @InputConverter()
  protected grouping: boolean = false;
  protected thousandSeparator: string;
  protected olocale: string;

  protected componentPipe: OIntegerPipe;
  protected pipeArguments: IIntegerPipeArgument;

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector
  ) {
    super(form, elRef, injector);
    this.setComponentPipe();
  }

  setComponentPipe() {
    this.componentPipe = new OIntegerPipe(this.injector);
  }

  ngOnInit() {
    super.ngOnInit();

    this.pipeArguments = {
      grouping: this.grouping,
      thousandSeparator: this.thousandSeparator,
      locale: this.olocale
    };

    if (this.step === undefined) {
      this.step = 1;
    }
  }

  innerOnChange(event: any) {
    // Ensure integer value
    if (Util.isDefined(event)) {
      event = parseInt(event, 10);
    }
    super.innerOnChange(event);
  }

  innerOnFocus(event: any) {
    event.preventDefault();
    event.stopPropagation();
    if (this.isReadOnly) {
      return;
    }
    this.setNumberDOMValue(this.getValue());
    super.innerOnFocus(event);
  }

  innerOnBlur(event?: any) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (this.isReadOnly) {
      return;
    }
    this.setPipeValue();
    let formControl: FormControl = this.getControl();
    if (formControl) {
      formControl.updateValueAndValidity();
    }
    super.innerOnBlur(event);
  }

  setPipeValue() {
    if (typeof this.pipeArguments !== 'undefined' && !this.isEmpty()) {
      let parsedValue = this.componentPipe.transform(this.getValue(), this.pipeArguments);
      this.setTextDOMValue(parsedValue);
    }
  }

  isEmpty(): boolean {
    if (this.value instanceof OFormValue) {
      if (this.value.value !== undefined) {
        return false;
      }
    }
    return true;
  }

  getInputEl() {
    var inputElement = undefined;
    if (this.elRef.nativeElement.tagName === 'INPUT') {
      inputElement = this.elRef.nativeElement;
    } else {
      inputElement = this.elRef.nativeElement.getElementsByTagName('INPUT')[0];
    }
    return inputElement;
  }

  setNumberDOMValue(val: any) {
    const inputElement = this.getInputEl();
    if (Util.isDefined(inputElement)) {
      inputElement.type = 'number';
      inputElement.value = (val !== undefined) ? val : '';
    }
  }

  setTextDOMValue(val: any) {
    let inputElement = this.getInputEl();
    if (Util.isDefined(inputElement)) {
      inputElement.type = 'text';
      inputElement.value = (val !== undefined) ? val : '';
    }
  }

  resolveValidators(): ValidatorFn[] {
    let validators: ValidatorFn[] = super.resolveValidators();
    if (typeof (this.min) !== 'undefined') {
      validators.push(this.minValidator.bind(this));
    }
    if (typeof (this.max) !== 'undefined') {
      validators.push(this.maxValidator.bind(this));
    }
    return validators;
  }

  protected minValidator(control: FormControl) {
    if ((typeof (control.value) === 'number') && (control.value < this.min)) {
      return {
        'min': {
          'requiredMin': this.min
        }
      };
    }
    return {};
  }

  protected maxValidator(control: FormControl) {
    if ((typeof (control.value) === 'number') && (this.max < control.value)) {
      return {
        'max': {
          'requiredMax': this.max
        }
      };
    }
    return {};
  }

}

@NgModule({
  declarations: [OIntegerInputComponent],
  imports: [CommonModule, OSharedModule, OTextInputModule],
  exports: [OIntegerInputComponent, OTextInputModule]
})
export class OIntegerInputModule { }
