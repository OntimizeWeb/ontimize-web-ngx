import { CommonModule } from '@angular/common';
import { Component, ElementRef, forwardRef, Inject, Injector, NgModule, OnInit, Optional, ViewEncapsulation } from '@angular/core';
import { FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { InputConverter } from '../../../decorators';
import { IRealPipeArgument, ORealPipe } from '../../../pipes';
import { OSharedModule } from '../../../shared';
import { Util } from '../../../util/util';
import { OFormComponent } from '../../form/form-components';
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
  moduleId: module.id,
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

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector
  ) {
    super(form, elRef, injector);
    this._defaultSQLTypeKey = 'FLOAT';
  }

  setComponentPipe(): void {
    this.componentPipe = new ORealPipe(this.injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.pipeArguments.decimalSeparator = this.decimalSeparator;
    this.pipeArguments.minDecimalDigits = this.minDecimalDigits;
    this.pipeArguments.maxDecimalDigits = this.maxDecimalDigits;
  }

  resolveValidators(): ValidatorFn[] {
    const validators: ValidatorFn[] = super.resolveValidators();
    if (Util.isDefined(this.minDecimalDigits)) {
      validators.push(this.minDecimalDigitsValidator.bind(this));
    }
    if (Util.isDefined(this.maxDecimalDigits)) {
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
      const valArray = ctrlValue.split(this.decimalSeparator ? this.decimalSeparator : '.');
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

@NgModule({
  declarations: [ORealInputComponent],
  imports: [CommonModule, OSharedModule, OIntegerInputModule],
  exports: [OIntegerInputModule, ORealInputComponent]
})
export class ORealInputModule { }
