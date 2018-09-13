import { Component, NgModule, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ValidatorFn, ValidationErrors } from '@angular/forms';

import { Util } from '../../../util/util';
import { OSharedModule } from '../../../shared';
import { OFormValue } from '../../form/OFormValue';
import { InputConverter } from '../../../decorators';
import { ORealPipe, IRealPipeArgument } from '../../../pipes';
import { DEFAULT_INPUTS_O_INTEGER_INPUT, DEFAULT_OUTPUTS_O_INTEGER_INPUT, OIntegerInputComponent, OIntegerInputModule } from '../integer-input/o-integer-input.component';

export const DEFAULT_INPUTS_O_REAL_INPUT = [
  ...DEFAULT_INPUTS_O_INTEGER_INPUT,
  'minDecimalDigits: min-decimal-digits',
  'maxDecimalDigits: max-decimal-digits',
  'decimalSeparator : decimal-separator'
];

export const DEFAULT_OUTPUTS_O_REAL_INPUT = [
  ...DEFAULT_OUTPUTS_O_INTEGER_INPUT
];

@Component({
  selector: 'o-real-input',
  templateUrl: './o-real-input.component.html',
  styleUrls: ['./o-real-input.component.scss'],
  inputs: DEFAULT_INPUTS_O_REAL_INPUT,
  outputs: DEFAULT_OUTPUTS_O_REAL_INPUT,
  encapsulation: ViewEncapsulation.None
})
export class ORealInputComponent extends OIntegerInputComponent implements OnInit {

  public static DEFAULT_INPUTS_O_REAL_INPUT = DEFAULT_INPUTS_O_REAL_INPUT;
  public static DEFAULT_OUTPUTS_O_REAL_INPUT = DEFAULT_OUTPUTS_O_REAL_INPUT;

  @InputConverter()
  minDecimalDigits: number = 2;

  @InputConverter()
  maxDecimalDigits: number = 2;

  @InputConverter()
  step: number = 0.01;

  @InputConverter()
  grouping: boolean = true;

  protected decimalSeparator: string;
  protected pipeArguments: IRealPipeArgument;

  setComponentPipe() {
    this.componentPipe = new ORealPipe(this.injector);
  }

  ngOnInit() {
    super.ngOnInit();
    this.pipeArguments.decimalSeparator = this.decimalSeparator;
    this.pipeArguments.minDecimalDigits = this.minDecimalDigits;
    this.pipeArguments.maxDecimalDigits = this.maxDecimalDigits;
  }

  innerOnChange(event: any) {
    if (!this.value) {
      this.value = new OFormValue();
    }
    this.ensureOFormValue(event);
    this.onChange.emit(event);
  }

  resolveValidators(): ValidatorFn[] {
    let validators: ValidatorFn[] = super.resolveValidators();

    if (typeof (this.minDecimalDigits) !== 'undefined') {
      validators.push(this.minDecimalDigitsValidator.bind(this));
    }

    if (typeof (this.maxDecimalDigits) !== 'undefined') {
      validators.push(this.maxDecimalDigitsValidator.bind(this));
    }

    return validators;
  }

  protected minDecimalDigitsValidator(control: FormControl): ValidationErrors {
    let ctrlValue: string = control.value;
    if (typeof control.value === 'number') {
      ctrlValue = ctrlValue.toString();
    }
    if (ctrlValue && ctrlValue.length) {
      let valArray = ctrlValue.split(this.decimalSeparator ? this.decimalSeparator : '.');
      if (Util.isDefined(this.minDecimalDigits) && (this.minDecimalDigits > 0) && Util.isDefined(valArray[1]) && (valArray[1].length < this.minDecimalDigits)) {
        return {
          minDecimaldigits: {
            requiredMinDecimaldigits: this.minDecimalDigits
          }
        };
      }
    }
    return {};
  }

  protected maxDecimalDigitsValidator(control: FormControl): ValidationErrors {
    let ctrlValue: string = control.value;
    if (typeof control.value === 'number') {
      ctrlValue = ctrlValue.toString();
    }
    if (ctrlValue && ctrlValue.length) {
      let valArray = ctrlValue.split(this.decimalSeparator ? this.decimalSeparator : '.');
      if (Util.isDefined(this.maxDecimalDigits) && (this.maxDecimalDigits > 0) && Util.isDefined(valArray[1]) && (valArray[1].length > this.maxDecimalDigits)) {
        return {
          maxDecimaldigits: {
            requiredMaxDecimaldigits: this.maxDecimalDigits
          }
        };
      }
    }
    return {};
  }

  protected initializeStep(): void {
    if (this.step <= 0) {
      this.step = 1 / Math.pow(10, this.maxDecimalDigits);
      console.warn('`step` attribute must be greater than zero');
    }
  }

}

@NgModule({
  declarations: [ORealInputComponent],
  imports: [CommonModule, OSharedModule, OIntegerInputModule],
  exports: [OIntegerInputModule, ORealInputComponent]
})
export class ORealInputModule { }
