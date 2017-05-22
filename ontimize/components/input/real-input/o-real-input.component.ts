import {
  Component, Inject, Injector, forwardRef, ElementRef, OnInit,
  Optional, NgModule, ViewEncapsulation
} from '@angular/core';

import { Validators } from '@angular/forms';
import { ValidatorFn } from '@angular/forms/src/directives/validators';
import { OSharedModule } from '../../../shared';
import { OFormComponent } from '../../form/o-form.component';
import { InputConverter } from '../../../decorators';
import {
  OIntegerInputModule, OIntegerInputComponent,
  DEFAULT_INPUTS_O_INTEGER_INPUT, DEFAULT_OUTPUTS_O_INTEGER_INPUT
} from '../integer-input/o-integer-input.component';

import { ORealPipe } from '../../../pipes';
import { IRealPipeArgument } from '../../../interfaces/pipes.interfaces';


export const DEFAULT_INPUTS_O_REAL_INPUT = [
  ...DEFAULT_INPUTS_O_INTEGER_INPUT,
  'minDecimalDigits: min-decimal-digits',
  'maxDecimalDigits: max-decimal-digits',
  'decimalSeparator : decimal-separator',
  'decimalDigits : decimal-digits'
];

export const DEFAULT_OUTPUTS_O_REAL_INPUT = [
  ...DEFAULT_OUTPUTS_O_INTEGER_INPUT
];

@Component({
  selector: 'o-real-input',
  template: require('./o-real-input.component.html'),
  styles: [require('./o-real-input.component.scss')],
  inputs: [
    ...DEFAULT_INPUTS_O_REAL_INPUT
  ],
  outputs: [
    ...DEFAULT_OUTPUTS_O_REAL_INPUT
  ],
  encapsulation: ViewEncapsulation.None
})
export class ORealInputComponent extends OIntegerInputComponent implements OnInit {

  public static DEFAULT_INPUTS_O_REAL_INPUT = DEFAULT_INPUTS_O_REAL_INPUT;
  public static DEFAULT_OUTPUTS_O_REAL_INPUT = DEFAULT_OUTPUTS_O_REAL_INPUT;

  @InputConverter()
  minDecimalDigits: number = 2;//TODO pending

  @InputConverter()
  maxDecimalDigits: number = 2;//TODO pending

  @InputConverter()
  step: number;

  @InputConverter()
  decimalDigits: number;

  @InputConverter()
  grouping: boolean = true;

  protected decimalSeparator: string;
  protected pipeArguments: IRealPipeArgument;

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector) {
    super(form, elRef, injector);
  }

  setComponentPipe() {
    this.componentPipe = new ORealPipe(this.injector);
  }

  ngOnInit() {
    if (this.step === undefined) {
      this.step = 1 / Math.pow(10, this.decimalDigits);
    }

    super.ngOnInit();
    this.pipeArguments.decimalSeparator = this.decimalSeparator;
    this.pipeArguments.decimalDigits = this.decimalDigits;

    if (this.decimalDigits === undefined) {
      this.decimalDigits = 2;
    }
  }

  resolveValidators(): ValidatorFn[] {
    let validators: ValidatorFn[] = super.resolveValidators();
    // Inject pattern validator for formatting value
    let pattern = '[-+]?[0-9]+(\.[0-9]{' + this.minDecimalDigits + ',' + this.maxDecimalDigits + '})?';
    validators.push(Validators.pattern(pattern));
    return validators;
  }

}

@NgModule({
  declarations: [ORealInputComponent],
  imports: [OSharedModule, OIntegerInputModule],
  exports: [ORealInputComponent, OIntegerInputModule],
})
export class ORealInputModule {
}
