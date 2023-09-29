import { Injectable, Injector } from '@angular/core';

import { Util } from '../util/util';
import { NumberService } from './number.service';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  public static DEFAULT_CURRENCY_SYMBOL = '$';
  public static DEFAULT_CURRENCY_SYMBOL_POSITION = 'left';

  protected _numberService: NumberService;

  protected _symbol: string;
  protected _symbolPosition: string;

  constructor(protected injector: Injector) {
    this._numberService = this.injector.get(NumberService);
    // TODO: initialize from config
    this._symbol = CurrencyService.DEFAULT_CURRENCY_SYMBOL;
    this._symbolPosition = CurrencyService.DEFAULT_CURRENCY_SYMBOL_POSITION;
  }

  get symbol(): string {
    return this._symbol;
  }

  set symbol(value: string) {
    this._symbol = value;
  }

  get symbolPosition(): string {
    return this._symbolPosition;
  }

  set symbolPosition(value: string) {
    this._symbolPosition = value;
  }

  getCurrencyValue(value: any, args: any) {
    let symbol = args ? args.currencySimbol : undefined;
    let symbolPosition = args ? args.currencySymbolPosition : undefined;

    if (!Util.isDefined(symbol)) {
      symbol = this._symbol;
    }
    if (!Util.isDefined(symbolPosition)) {
      symbolPosition = this._symbolPosition;
    }
    let currencyValue = this._numberService.getRealValue(value, args);
    switch (symbolPosition) {
      case 'left':
        currencyValue = symbol + ' ' + currencyValue;
        break;
      case 'right':
        currencyValue = currencyValue + ' ' + symbol;
        break;
    }
    return currencyValue;
  }

}
