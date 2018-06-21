import { Injector } from '@angular/core';

import { Util } from '../util/util';
import { AppConfig, Config } from '../config/app-config';

export class NumberService {

  public static DEFAULT_DECIMAL_DIGITS = 2;

  protected _grouping: boolean;
  protected _minDecimalDigits: number;
  protected _maxDecimalDigits: number;
  protected _locale: string;
  private _config: Config;

  constructor(protected injector: Injector) {
    this._config = this.injector.get(AppConfig).getConfiguration();
    //TODO: initialize from config
    this._minDecimalDigits = NumberService.DEFAULT_DECIMAL_DIGITS;
    this._maxDecimalDigits = NumberService.DEFAULT_DECIMAL_DIGITS;

    this._grouping = true;
    this._locale = this._config.locale;
  }

  public get grouping(): boolean {
    return this._grouping;
  }

  public set grouping(value: boolean) {
    this._grouping = value;
  }

  public get minDecimalDigits(): number {
    return this._minDecimalDigits;
  }

  public set minDecimalDigits(value: number) {
    this._minDecimalDigits = value;
  }

  public get maxDecimalDigits(): number {
    return this._maxDecimalDigits;
  }

  public set maxDecimalDigits(value: number) {
    this._maxDecimalDigits = value;
  }

  public get locale(): string {
    return this._locale;
  }

  public set locale(value: string) {
    this._locale = value;
  }

  public getIntegerValue(value: any, grouping?: boolean, thousandSeparator?: string, locale?: string) {
    if (!Util.isDefined(value) && !Util.isDefined(grouping) || !grouping) {
      return value;
    }
    // Ensure value is an integer
    let intValue: any = parseInt(value, 10);
    if (isNaN(intValue)) {
      return void 0;
    }
    // Format value
    let formattedIntValue = intValue;
    if (Util.isDefined(locale)) {
      formattedIntValue = new Intl.NumberFormat(locale).format(intValue);
    } else if (!Util.isDefined(thousandSeparator)) {
      formattedIntValue = new Intl.NumberFormat(this._locale).format(intValue);
    } else {
      formattedIntValue = String(intValue).toString().replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
    }
    return formattedIntValue;
  }

  public getRealValue(value: any, grouping?: boolean, thousandSeparator?: string, decimalSeparator?: string, minDecimalDigits?: number, maxDecimalDigits?: number, locale?: string) {
    if (!Util.isDefined(value) && !Util.isDefined(grouping) || !grouping) {
      return value;
    }
    if (!Util.isDefined(minDecimalDigits)) {
      minDecimalDigits = this._minDecimalDigits;
    }
    if (!Util.isDefined(maxDecimalDigits)) {
      maxDecimalDigits = this._maxDecimalDigits;
    }

    let formattedRealValue = value;
    let formatterArgs = {
      minimumFractionDigits: minDecimalDigits,
      maximumFractionDigits: maxDecimalDigits
    };

    if (Util.isDefined(locale)) {
      formattedRealValue = new Intl.NumberFormat(locale, formatterArgs).format(value);
    } else if (!Util.isDefined(thousandSeparator) || !Util.isDefined(decimalSeparator)) {
      formattedRealValue = new Intl.NumberFormat(this._locale, formatterArgs).format(value);
    } else {
      let realValue = parseFloat(value);
      if (isNaN(realValue)) {
        realValue = void 0;
      }
      formattedRealValue = String(realValue);
      let tmpStr = realValue.toFixed(maxDecimalDigits);
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

  public getPercentValue(value: any, grouping?: boolean, thousandSeparator?: string, decimalSeparator?: string, minDecimalDigits?: number, maxDecimalDigits?: number, locale?: string) {
    let formattedPercentValue = value;
    value = value * 100;

    formattedPercentValue = this.getRealValue(value, grouping, thousandSeparator, decimalSeparator, minDecimalDigits, maxDecimalDigits) + ' %';
    return formattedPercentValue;
  }

}
