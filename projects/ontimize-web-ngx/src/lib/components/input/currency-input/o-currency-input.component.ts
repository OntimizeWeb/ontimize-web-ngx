import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';


import { OMatErrorDirective } from '../../../directives/o-mat-error.directive';
import { OIntegerPipe } from '../../../pipes/o-integer.pipe';
import { ORealPipe } from '../../../pipes/o-real.pipe';
import { OTranslatePipe } from '../../../pipes/o-translate.pipe';
import { CurrencyUtil } from '../../../util/currencyUtil';
import { ORealInputComponent } from '../real-input/o-real-input.component';

export const DEFAULT_INPUTS_O_CURRENCY_INPUT = [
  'currencySymbol: currency-symbol',
  'currencySymbolPosition: currency-symbol-position'
];

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatTooltipModule, OMatErrorDirective, OTranslatePipe],
  selector: 'o-currency-input',
  templateUrl: './o-currency-input.component.html',
  styleUrls: ['./o-currency-input.component.scss'],
  inputs: DEFAULT_INPUTS_O_CURRENCY_INPUT,
  encapsulation: ViewEncapsulation.None,
  providers: [ORealPipe, { provide: OIntegerPipe, useExisting: ORealPipe }]
})
export class OCurrencyInputComponent extends ORealInputComponent implements OnInit {


  protected currency_icons = new Map<string, string>([
    ['EUR', 'euro_symbol'],
    ['USD', 'attach_money'],
    ['GBP', 'currency_pound'],
    ['ILS', 'currency_ils'],
    ['INR', 'currency_rupee'],
    ['JPY', 'currency_yen'],
    ['KRW', 'currency_krw'],
    ['BTC', 'currency_bitcoin']
  ]);

  currency_symbols = CurrencyUtil.currencyCodeToSymbol;

  currencySymbol: string = 'EUR';
  currencySymbolPosition: string = 'right';

  protected existsOntimizeIcon() {
    return this.currency_icons.has(this.currencySymbol);
  }

  useIcon(position: string): boolean {
    return this.existsOntimizeIcon() && this.currencySymbolPosition === position;
  }

  useSymbol(position: string): boolean {
    return !this.existsOntimizeIcon() && this.currency_symbols.hasOwnProperty(this.currencySymbol) && this.currencySymbolPosition === position;
  }
}
