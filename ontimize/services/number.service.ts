import { Inject, Injector } from '@angular/core';
import { APP_CONFIG, Config } from '../config/app-config';
// import { MomentService } from './moment.service.ts';

export class NumberService {

  public static DEFAULT_THOUSAND_SEPARATOR = ',';
  public static DEFAULT_DECIMAL_SEPARATOR = '.';
  public static DEFAULT_DECIMAL_DIGITS = 2;

  protected _grouping: boolean;
  protected _thousandSeparator: string;
  protected _decimalSeparator: string;
  protected _decimalDigits: number;
  protected _locale: string;

  // private momentSrv: MomentService;

  constructor( @Inject(APP_CONFIG) private _config: Config, protected injector: Injector) {
    //TODO: initialize from config
    // this.momentSrv = this.injector.get(MomentService);

    this._thousandSeparator = NumberService.DEFAULT_THOUSAND_SEPARATOR;
    this._decimalSeparator = NumberService.DEFAULT_DECIMAL_SEPARATOR;
    this._decimalDigits = NumberService.DEFAULT_DECIMAL_DIGITS;

    this._grouping = true;
    // this._locale = this.momentSrv.getLocale();
    this._locale = 'es';
  }

  public get grouping(): boolean {
    return this._grouping;
  }

  public set grouping(value: boolean) {
    this._grouping = value;
  }

  public get thousandSeparator(): string {
    return this._thousandSeparator;
  }

  public set thousandSeparator(value: string) {
    this._thousandSeparator = value;
  }

  public get decimalSeparator(): string {
    return this._decimalSeparator;
  }

  public set decimalSeparator(value: string) {
    this._decimalSeparator = value;
  }

  public get decimalDigits(): number {
    return this._decimalDigits;
  }

  public set decimalDigits(value: number) {
    this._decimalDigits = value;
  }

  public get locale(): string {
    return this._locale;
  }

  public set locale(value: string) {
    this._locale = value;
  }

  public getIntegerValue(value: any, grouping?: boolean, thousandSeparator?: string, locale?: string) {
    if (typeof grouping === 'undefined' || !grouping || typeof value === 'undefined') {
      return value;
    }
    let formattedIntValue = value;
    if (typeof (locale) !== 'undefined') {
      formattedIntValue = new Intl.NumberFormat(locale).format(value);
    } else if (typeof (thousandSeparator) === 'undefined') {
      formattedIntValue = new Intl.NumberFormat(this._locale).format(value);
    } else {
      let intValue = parseInt(value, 10);
      if (isNaN(intValue)) {
        intValue = 0;
      }
      formattedIntValue = String(intValue).toString().replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
    }
    return formattedIntValue;
  }

  public getRealValue(value: any, grouping?: boolean, thousandSeparator?: string,
    decimalSeparator?: string, decimalDigits?: number, locale?: string) {
    if (typeof grouping === 'undefined' || !grouping || typeof value === 'undefined') {
      return value;
    }
    if (typeof (decimalDigits) === 'undefined') {
      decimalDigits = this._decimalDigits;
    }

    let formattedRealValue = value;
    let formatterArgs = {
      minimumFractionDigits: decimalDigits,
      maximumFractionDigits: decimalDigits
    };

    if (typeof (locale) !== 'undefined') {
      formattedRealValue = new Intl.NumberFormat(locale, formatterArgs).format(value);
    } else if (typeof (thousandSeparator) === 'undefined' || typeof (decimalSeparator) === 'undefined') {
      formattedRealValue = new Intl.NumberFormat(this._locale, formatterArgs).format(value);
    } else {
      let realValue = parseFloat(value);
      if (isNaN(realValue)) {
        realValue = 0;
      }
      formattedRealValue = String(realValue);
      let tmpStr = realValue.toFixed(decimalDigits);
      tmpStr = tmpStr.replace('.', decimalSeparator);
      if (grouping) {
        let parts = tmpStr.split(decimalSeparator);
        if (parts.length > 0) {
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
          formattedRealValue = parts.join(decimalSeparator);
        }
      } else {
        formattedRealValue = tmpStr;
      }
    }
    return formattedRealValue;
  }

}
