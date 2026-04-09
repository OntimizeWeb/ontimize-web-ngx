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


  static currency_icons = ['USD', 'EUR', 'GBP', 'ILS', 'INR', 'JPY', 'KRW', 'BTC'];

  currency_symbols = CurrencyUtil.currencyCodeToSymbol;

  currencySymbol: string = 'EUR';
  currencySymbolPosition: string = 'right';

  protected existsOntimizeIcon() {
    return OCurrencyInputComponent.currency_icons.indexOf(this.currencySymbol) !== -1;
  }

  useIcon(position: string): boolean {
    return this.existsOntimizeIcon() && this.currencySymbolPosition === position;
  }

  useSymbol(position: string): boolean {
    return !this.existsOntimizeIcon() && this.currency_symbols.hasOwnProperty(this.currencySymbol) && this.currencySymbolPosition === position;
  }
}
