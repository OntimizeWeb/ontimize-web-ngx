import { Component, ElementRef, forwardRef, inject, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';


import { BooleanInputConverter, NumberInputConverter } from '../../../decorators/input-converter';
import { OMatErrorDirective } from '../../../directives/o-mat-error.directive';
import { OTranslatePipe } from '../../../pipes/o-translate.pipe';
import { OIntegerPipe } from '../../../pipes/o-integer.pipe';
import { IRealPipeArgument, ORealPipe } from '../../../pipes/o-real.pipe';
import { NumberService } from '../../../services/number.service';
import { Util } from '../../../util/util';
import { OIntegerInputComponent } from '../integer-input/o-integer-input.component';
import { OFormControl } from '../o-form-control.class';

export const DEFAULT_INPUTS_O_REAL_INPUT = [
  'minDecimalDigits: min-decimal-digits',
  'maxDecimalDigits: max-decimal-digits',
  'decimalSeparator : decimal-separator',
  'strict'
];


@Component({
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatTooltipModule, OMatErrorDirective, OTranslatePipe],
  selector: 'o-real-input',
  templateUrl: './o-real-input.component.html',
  inputs: DEFAULT_INPUTS_O_REAL_INPUT,
  encapsulation: ViewEncapsulation.None,
  providers: [ORealPipe, { provide: OIntegerPipe, useExisting: ORealPipe }, { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ORealInputComponent), multi: true }]
})
export class ORealInputComponent extends OIntegerInputComponent implements OnInit {

  @NumberInputConverter()
  minDecimalDigits: number = 2;

  @NumberInputConverter()
  maxDecimalDigits: number = 2;

  @NumberInputConverter()
  step: number = 0.01;

  @BooleanInputConverter()
  grouping: boolean = true;

  @BooleanInputConverter()
  strict: boolean = false;

  protected decimalSeparator: string;
  protected componentPipe = inject(ORealPipe);
  protected pipeArguments: IRealPipeArgument;
  protected numberService: NumberService;

  constructor(
    elRef: ElementRef,
    injector: Injector
  ) {
    super(elRef, injector);
    this._defaultSQLTypeKey = 'FLOAT';
    this.numberService = this.injector.get(NumberService);
  }

  setComponentPipe(): void {
  }

  initialize() {
    super.initialize();
    // Override FormControl getValue in order to return the appropriate formatted value
    (this.getFormControl() as OFormControl).getValue = function () {
      if (!isNaN(Number(this.value))) {
        return Number(this.value);
      } else {
        return this.value;
      }
    };
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
      if (!isNaN(Number(formattedValue))) {
        this.value.value = formattedValue;
      }
    }
  }

  protected maxDecimalDigitsValidator(control: AbstractControl): ValidationErrors {
    let ctrlValue: string = control.value;
    if (typeof control.value === 'number') {
      ctrlValue = ctrlValue.toString();
    }
    if (this.strict && ctrlValue && ctrlValue.length) {
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
