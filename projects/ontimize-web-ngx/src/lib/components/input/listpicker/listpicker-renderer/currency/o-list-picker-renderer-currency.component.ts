import { ChangeDetectionStrategy, Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { NumberInputConverter } from '../../../../../decorators/input-converter';
import { ICurrencyPipeArgument, OCurrencyPipe } from '../../../../../pipes/o-currency.pipe';
import { CurrencyService } from '../../../../../services/currency.service';
import { OListPickerRendererRealComponent } from '../real/o-list-picker-renderer-real.component';

export const DEFAULT_INPUTS_O_LISTPICKER_RENDERER_CURRENCY = [
  // currency-symbol [string]: currency symbol. Default: dollar ($).
  'currencySymbol: currency-symbol',

  // currency-symbol-position [left|right]: position of the currency symbol. Default: left.
  'currencySymbolPosition: currency-symbol-position'
];

@Component({
  selector: 'o-list-picker-renderer-currency',
  templateUrl: './o-list-picker-renderer-currency.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: DEFAULT_INPUTS_O_LISTPICKER_RENDERER_CURRENCY
})
export class OListPickerRendererCurrencyComponent extends OListPickerRendererRealComponent implements OnInit {

  @NumberInputConverter()
  minDecimalDigits: number = 2;
  @NumberInputConverter()
  maxDecimalDigits: number = 2;

  protected currencySymbol: string;
  protected currencySymbolPosition: string;
  protected decimalSeparator: string = '.';

  protected grouping: boolean = true;
  protected thousandSeparator: string = ',';

  protected currencyService: CurrencyService;

  protected componentPipe: OCurrencyPipe;
  protected pipeArguments: ICurrencyPipeArgument;
  @ViewChild('templateref', { read: TemplateRef, static: true }) public templateref: TemplateRef<any>;

  constructor(protected injector: Injector) {
    super(injector);
    this.currencyService = this.injector.get(CurrencyService);
    this.setComponentPipe();
  }

  setComponentPipe() {
    this.componentPipe = new OCurrencyPipe(this.injector);
  }

  initialize() {
    super.initialize();
    if (typeof this.currencySymbol === 'undefined') {
      this.currencySymbol = this.currencyService.symbol;
    }
    if (typeof this.currencySymbolPosition === 'undefined') {
      this.currencySymbolPosition = this.currencyService.symbolPosition;
    }

    this.pipeArguments = {
      currencySimbol: this.currencySymbol,
      currencySymbolPosition: this.currencySymbolPosition,
      minDecimalDigits: this.minDecimalDigits,
      maxDecimalDigits: this.maxDecimalDigits,
      decimalSeparator: this.decimalSeparator,
      grouping: this.grouping,
      thousandSeparator: this.thousandSeparator
    };

  }

}
