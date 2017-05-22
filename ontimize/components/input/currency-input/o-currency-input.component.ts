import {
  Component, Inject, Injector, forwardRef, ElementRef, OnInit,
  Optional,
  NgModule,
  ViewEncapsulation
} from '@angular/core';

import { ValidatorFn } from '@angular/forms/src/directives/validators';
import { OSharedModule } from '../../../shared';
import { OFormComponent } from '../../form/o-form.component';
import {
  ORealInputModule, ORealInputComponent,
  DEFAULT_INPUTS_O_REAL_INPUT, DEFAULT_OUTPUTS_O_REAL_INPUT
} from '../real-input/o-real-input.component';

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
  template: require('./o-currency-input.component.html'),
  styles: [require('./o-currency-input.component.scss')],
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

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector) {
    super(form, elRef, injector);
  }

  resolveValidators(): ValidatorFn[] {
    let validators: ValidatorFn[] = super.resolveValidators();
    return validators;
  }

}

@NgModule({
  declarations: [OCurrencyInputComponent],
  imports: [OSharedModule, ORealInputModule],
  exports: [OCurrencyInputComponent, ORealInputModule],
})
export class OCurrencyInputModule {
}
