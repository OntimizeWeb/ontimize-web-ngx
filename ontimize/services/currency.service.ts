import {Inject, Injector} from '@angular/core';
import {APP_CONFIG, Config} from '../config/app-config';
import {NumberService} from './number.service';

export class CurrencyService {

  public static DEFAULT_CURRENCY_SYMBOL = '$';
  public static DEFAULT_CURRENCY_SYMBOL_POSITION = 'left';

  protected _numberService: NumberService;

  protected _symbol : string;
  protected _symbolPosition : string;

  constructor( @Inject(APP_CONFIG) private _config: Config,
    protected injector: Injector) {
    this._numberService = this.injector.get(NumberService);
    //TODO: initialize from config
    this._symbol = CurrencyService.DEFAULT_CURRENCY_SYMBOL;
    this._symbolPosition = CurrencyService.DEFAULT_CURRENCY_SYMBOL_POSITION;
  }

  public get symbol () : string {
    return this._symbol;
  }

  public set symbol (value : string) {
    this._symbol = value;
  }

  public get symbolPosition () : string {
    return this._symbolPosition;
  }

  public set symbolPosition (value : string) {
    this._symbolPosition = value;
  }

  public getCurrencyValue (value: any, symbol?: string, symbolPosition?: string, grouping?: boolean,
      thousandSeparator?: string, decimalSeparator?: string, decimalDigits?: number) {
    if (typeof(symbol) === 'undefined') {
      symbol = this._symbol;
    }
    if (typeof(symbolPosition) === 'undefined') {
      symbolPosition = this._symbolPosition;
    }
    let currencyValue = this._numberService.getRealValue(value, grouping, thousandSeparator,
        decimalSeparator, decimalDigits);
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
