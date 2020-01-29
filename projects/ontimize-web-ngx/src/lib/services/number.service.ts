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
    // TODO: initialize from config
    this._minDecimalDigits = NumberService.DEFAULT_DECIMAL_DIGITS;
    this._maxDecimalDigits = NumberService.DEFAULT_DECIMAL_DIGITS;

    this._grouping = true;
    this._locale = this._config.locale;
  }

  get grouping(): boolean {
    return this._grouping;
  }

  set grouping(value: boolean) {
    this._grouping = value;
  }

  get minDecimalDigits(): number {
    return this._minDecimalDigits;
  }

  set minDecimalDigits(value: number) {
    this._minDecimalDigits = value;
  }

  get maxDecimalDigits(): number {
    return this._maxDecimalDigits;
  }

  set maxDecimalDigits(value: number) {
    this._maxDecimalDigits = value;
  }

  get locale(): string {
    return this._locale;
  }

  set locale(value: string) {
    this._locale = value;
  }

  getIntegerValue(value: any, args: any) {
    const grouping = args ? args.grouping : undefined;
    if (!Util.isDefined(value) && !Util.isDefined(grouping) || !grouping) {
      return value;
    }
    const thousandSeparator = args ? args.thousandSeparator : undefined;
    const locale = args ? args.locale : undefined;
    // Ensure value is an integer
    const intValue: any = parseInt(value, 10);
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

  getRealValue(value: any, args: any) {
    const grouping = args ? args.grouping : undefined;
    if (!Util.isDefined(value) && !Util.isDefined(grouping) || !grouping) {
      return value;
    }
    const locale = args ? args.locale : undefined;
    const thousandSeparator = args ? args.thousandSeparator : undefined;
    const decimalSeparator = args ? args.decimalSeparator : undefined;

    let minDecimalDigits = args ? args.minDecimalDigits : undefined;
    let maxDecimalDigits = args ? args.maxDecimalDigits : undefined;

    if (!Util.isDefined(minDecimalDigits)) {
      minDecimalDigits = this._minDecimalDigits;
    }
    if (!Util.isDefined(maxDecimalDigits)) {
      maxDecimalDigits = this._maxDecimalDigits;
    }

    let formattedRealValue = value;
    const formatterArgs = {
      minimumFractionDigits: minDecimalDigits,
      maximumFractionDigits: maxDecimalDigits
    };

    if (Util.isDefined(locale)) {
      formattedRealValue = new Intl.NumberFormat(locale, formatterArgs).format(value);
    } else if (!Util.isDefined(thousandSeparator) || !Util.isDefined(decimalSeparator)) {
      formattedRealValue = new Intl.NumberFormat(this._locale, formatterArgs).format(value);
    } else {
      const realValue = parseFloat(value);
      if (!isNaN(realValue)) {
        formattedRealValue = String(realValue);
        let tmpStr = realValue.toFixed(maxDecimalDigits);
        tmpStr = tmpStr.replace('.', decimalSeparator);
        if (grouping) {
          const parts = tmpStr.split(decimalSeparator);
          if (parts.length > 0) {
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
            formattedRealValue = parts.join(decimalSeparator);
          }
        } else {
          formattedRealValue = tmpStr;
        }
      }
    }
    return formattedRealValue;
  }

  getPercentValue(value: any, args: any) {
    const valueBase = args ? args.valueBase : undefined;
    let parsedValue = value;
    switch (valueBase) {
      case 100:
        break;
      case 1:
      default:
        parsedValue = parsedValue * 100;
        break;
    }
    const formattedPercentValue = this.getRealValue(parsedValue, args) + ' %';
    return formattedPercentValue;
  }

}
