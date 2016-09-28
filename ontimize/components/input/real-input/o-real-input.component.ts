import {Component, Inject, Injector, forwardRef, ElementRef, OnInit,
  NgZone, ChangeDetectorRef,
  NgModule,
  ModuleWithProviders,
  ViewEncapsulation} from '@angular/core';

import {Validators } from '@angular/forms';
import {ValidatorFn } from '@angular/forms/src/directives/validators';

import {OFormComponent} from '../../form/o-form.component';
import {InputConverter} from '../../../decorators';
import {OIntegerInputModule, OIntegerInputComponent,
  DEFAULT_INPUTS_O_INTEGER_INPUT, DEFAULT_OUTPUTS_O_INTEGER_INPUT} from '../integer-input/o-integer-input.component';

export const DEFAULT_INPUTS_O_REAL_INPUT = [
  ...DEFAULT_INPUTS_O_INTEGER_INPUT,
  'minDecimalDigits: min-decimal-digits',
  'maxDecimalDigits: max-decimal-digits'
];

export const DEFAULT_OUTPUTS_O_REAL_INPUT = [
  ...DEFAULT_OUTPUTS_O_INTEGER_INPUT
];

@Component({
  selector: 'o-real-input',
  templateUrl: '/input/real-input/o-real-input.component.html',
  styleUrls: ['/input/real-input/o-real-input.component.css'],
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
  minDecimalDigits : number = 2;//TODO pending

  @InputConverter()
  maxDecimalDigits: number = 2;//TODO pending

  constructor( @Inject(forwardRef(() => OFormComponent)) protected form: OFormComponent,
    protected elRef: ElementRef,
    protected ngZone: NgZone,
    protected cd: ChangeDetectorRef,
    protected injector: Injector) {
    super(form, elRef, ngZone, cd, injector);
  }

  resolveValidators(): ValidatorFn[] {
    let validators: ValidatorFn[] = super.resolveValidators();
    //Inject pattern validator for formatting value
    let pattern = '-?^[0-9]+(\.[0-9]{' + this.minDecimalDigits + ',' + this.maxDecimalDigits + '})?$';
    validators.push(Validators.pattern(pattern));
    return validators;
  }

}

@NgModule({
  declarations: [ORealInputComponent],
  imports: [OIntegerInputModule],
  exports: [ORealInputComponent, OIntegerInputModule],
})
export class ORealInputModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ORealInputModule,
      providers: []
    };
  }
}
