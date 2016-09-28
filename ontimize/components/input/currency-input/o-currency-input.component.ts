import {Component, Inject, Injector, forwardRef, ElementRef, OnInit,
  NgZone, ChangeDetectorRef,
  NgModule,
  ModuleWithProviders,
  ViewEncapsulation} from '@angular/core';

import {Validators } from '@angular/forms';
import {ValidatorFn } from '@angular/forms/src/directives/validators';

import {OFormComponent} from '../../form/o-form.component';
import {ORealInputModule, ORealInputComponent,
  DEFAULT_INPUTS_O_REAL_INPUT, DEFAULT_OUTPUTS_O_REAL_INPUT} from '../real-input/o-real-input.component';

export const DEFAULT_INPUTS_O_CURRENCY_INPUT = [
  ...DEFAULT_INPUTS_O_REAL_INPUT,
  'currencySymbol: currency-symbol',
  'currencySymbolPosition: currency-symbol-position'
];

export const DEFAULT_OUTPUTS_O_CURRENCY_INPUT = [
  ...DEFAULT_OUTPUTS_O_REAL_INPUT
];

@Component({
  selector: 'o-currency-input',
  templateUrl: '/input/currency-input/o-currency-input.component.html',
  styleUrls: ['/input/currency-input/o-currency-input.component.css'],
  inputs: [
    ...DEFAULT_INPUTS_O_CURRENCY_INPUT
  ],
  outputs: [
     ...DEFAULT_OUTPUTS_O_CURRENCY_INPUT
  ],
  encapsulation: ViewEncapsulation.None
})
export class OCurrencyInputComponent extends ORealInputComponent implements OnInit {

  public static DEFAULT_INPUTS_O_CURRENCY_INPUT = DEFAULT_INPUTS_O_CURRENCY_INPUT;
  public static DEFAULT_OUTPUTS_O_CURRENCY_INPUT = DEFAULT_OUTPUTS_O_CURRENCY_INPUT;

   currency_symbols = {
    'USD': '$', // US Dollar
    'EUR': '€', // Euro
    'CRC': '₡', // Costa Rican Colón
    'GBP': '£', // British Pound Sterling
    'ILS': '₪', // Israeli New Sheqel
    'INR': '₹', // Indian Rupee
    'JPY': '¥', // Japanese Yen
    'KRW': '₩', // South Korean Won
    'NGN': '₦', // Nigerian Naira
    'PHP': '₱', // Philippine Peso
    'PLN': 'zł', // Polish Zloty
    'PYG': '₲', // Paraguayan Guarani
    'THB': '฿', // Thai Baht
    'UAH': '₴', // Ukrainian Hryvnia
    'VND': '₫', // Vietnamese Dong
  };

  currencySymbol: string = 'EUR';
  currencySymbolPosition: string = 'right';

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
    let pattern = '^[0-9]+(\.[0-9]{' + this.minDecimalDigits + ',' + this.maxDecimalDigits + '})?$';
    validators.push(Validators.pattern(pattern));
    return validators;
  }

}

@NgModule({
  declarations: [OCurrencyInputComponent],
  imports: [ORealInputModule],
  exports: [OCurrencyInputComponent, ORealInputModule],
})
export class OCurrencyInputModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OCurrencyInputModule,
      providers: []
    };
  }
}
