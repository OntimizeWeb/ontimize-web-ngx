import { Component, ElementRef, forwardRef, Inject, Injector, OnInit, Optional, ViewEncapsulation } from '@angular/core';
import { FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { InputConverter } from '../../../decorators/input-converter';
import { IRealPipeArgument, ORealPipe } from '../../../pipes/o-real.pipe';
import { NumberService } from '../../../services/number.service';
import { Util } from '../../../util/util';
import { OFormComponent } from '../../form/o-form.component';
import {
  DEFAULT_INPUTS_O_INTEGER_INPUT,
  DEFAULT_OUTPUTS_O_INTEGER_INPUT,
  OIntegerInputComponent
} from '../integer-input/o-integer-input.component';

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
  inputs: DEFAULT_INPUTS_O_REAL_INPUT,
  outputs: DEFAULT_OUTPUTS_O_REAL_INPUT,
  encapsulation: ViewEncapsulation.None
})
export class ORealInputComponent extends OIntegerInputComponent implements OnInit {

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
  protected numberService: NumberService;

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector
  ) {
    super(form, elRef, injector);
    this._defaultSQLTypeKey = 'FLOAT';
    this.numberService = this.injector.get(NumberService);
  }

  setComponentPipe(): void {
    this.componentPipe = new ORealPipe(this.injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.pipeArguments.decimalSeparator = this.decimalSeparator;
    this.pipeArguments.minDecimalDigits = this.minDecimalDigits;
    this.pipeArguments.maxDecimalDigits = this.maxDecimalDigits;
    this.pipeArguments.truncate = false;
    if (!this.isEmpty()) {
      this.ensureOFormValue(this.value);
    }
  }

  resolveValidators(): ValidatorFn[] {
    const validators: ValidatorFn[] = super.resolveValidators();
    if (Util.isDefined(this.maxDecimalDigits)) {
      validators.push(this.maxDecimalDigitsValidator.bind(this));
    }
    return validators;
  }

  ensureOFormValue(arg: any): void {
    super.ensureOFormValue(arg);
    if (!this.isEmpty() && Util.isDefined(this.pipeArguments)) {
      const formattedValue = this.numberService.getRealValue(this.value.value, this.pipeArguments);
      if(!isNaN(Number(formattedValue))) {
        this.value.value = formattedValue;
      }
    }
  }

  protected maxDecimalDigitsValidator(control: FormControl): ValidationErrors {
    let ctrlValue: string = control.value;
    if (typeof control.value === 'number') {
      ctrlValue = ctrlValue.toString();
    }
    if (ctrlValue && ctrlValue.length) {
      const valArray = ctrlValue.split(this.decimalSeparator ? this.decimalSeparator : '.');
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
