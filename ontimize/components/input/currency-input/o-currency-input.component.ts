import { Component, NgModule, OnInit, ViewEncapsulation, Optional, Inject, forwardRef, ElementRef, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconRegistryService } from '../../../services';
import { OSharedModule } from '../../../shared';
import { OFormComponent } from '../../form/o-form.component';
import { DEFAULT_INPUTS_O_REAL_INPUT, DEFAULT_OUTPUTS_O_REAL_INPUT, ORealInputModule, ORealInputComponent } from '../real-input/o-real-input.component';

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
  templateUrl: './o-currency-input.component.html',
  styleUrls: ['./o-currency-input.component.scss'],
  inputs: DEFAULT_INPUTS_O_CURRENCY_INPUT,
  outputs: DEFAULT_OUTPUTS_O_CURRENCY_INPUT,
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

  static currency_icons = ['USD', 'EUR', 'GBP', 'ILS', 'INR', 'JPY', 'KRW', 'BTC'];

  currencySymbol: string = 'EUR';
  currencySymbolPosition: string = 'right';

  protected iconRegistryService: IconRegistryService;
  protected existsIcon: boolean = false;

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector
  ) {
    super(form, elRef, injector);
    this.iconRegistryService = injector.get(IconRegistryService);
  }

  ngOnInit() {
    super.ngOnInit();
    if (OCurrencyInputComponent.currency_icons.indexOf(this.currencySymbol) !== -1) {
      this.iconRegistryService.existsIcon(this.currencySymbol).subscribe(res => {
        this.existsIcon = res;
      });
    }
  }

  protected existsOntimizeIcon() {
    return OCurrencyInputComponent.currency_icons.indexOf(this.currencySymbol) !== -1 && this.existsIcon;
  }

  useIcon(position: string): boolean {
    return this.existsOntimizeIcon() && this.currencySymbolPosition === position;
  }

  useSymbol(position: string): boolean {
    return !this.existsOntimizeIcon() && this.currency_symbols.hasOwnProperty(this.currencySymbol) && this.currencySymbolPosition === position;
  }
}

@NgModule({
  declarations: [OCurrencyInputComponent],
  imports: [CommonModule, OSharedModule, ORealInputModule],
  exports: [OCurrencyInputComponent, ORealInputModule]
})
export class OCurrencyInputModule { }
