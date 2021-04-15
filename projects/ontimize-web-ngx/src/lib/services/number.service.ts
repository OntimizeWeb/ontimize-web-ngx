import { Injectable, Injector } from '@angular/core';

import { IRealPipeArgument } from '../pipes';
import { Util } from '../util/util';
import { OTranslateService } from './translate/o-translate.service';

@Injectable({
  providedIn: 'root'
})
export class NumberService {

  public static DEFAULT_DECIMAL_DIGITS = 2;

  protected _grouping: boolean;
  protected _minDecimalDigits: number;
  protected _maxDecimalDigits: number;
  protected _locale: string;

  protected translateService: OTranslateService;

  constructor(protected injector: Injector) {

    this.translateService = this.injector.get(OTranslateService);
    // TODO: initialize from config
    this._minDecimalDigits = NumberService.DEFAULT_DECIMAL_DIGITS;
    this._maxDecimalDigits = NumberService.DEFAULT_DECIMAL_DIGITS;

    this._grouping = true;

    const self = this;
    this._locale = this.translateService.getCurrentLang()
    this.translateService.onLanguageChanged.subscribe(() =>
      self._locale = self.translateService.getCurrentLang()
    );
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
    if (!Util.isDefined(value)) {
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
    let formattedIntValue;
    if (Util.isDefined(locale)) {
      formattedIntValue = new Intl.NumberFormat(locale).format(intValue);
    } else if (!Util.isDefined(thousandSeparator)) {
      formattedIntValue = new Intl.NumberFormat(this._locale).format(intValue);
    } else {
      formattedIntValue = String(intValue).toString().replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
    }
    return formattedIntValue;
  }

  getRealValue(value: any, args: IRealPipeArgument) {
    const grouping = args ? args.grouping : false;
    if (!Util.isDefined(value)) {
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
    const significantDigits = this.calculateSignificantDigits(value, minDecimalDigits, maxDecimalDigits, args.truncate, decimalSeparator);
    const formatterArgs = {
      minimumFractionDigits: minDecimalDigits,
      maximumFractionDigits: maxDecimalDigits,
      minimumSignificantDigits: significantDigits,
      maximumSignificantDigits: significantDigits,
      useGrouping: grouping
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

  private calculateSignificantDigits(value: number, minDecimals: number, maxDecimals: number, truncate = true, decimalSeparator?: string): number {
    const valueStr = String(value);
    const splittedValue = Util.isDefined(decimalSeparator) ? valueStr.split(decimalSeparator) : valueStr.split('.');
    const sigIntDigits = splittedValue[0].length;
    let sigDecDigits = 0;
    if (truncate) {
      sigDecDigits = Util.isDefined(splittedValue[1]) && splittedValue[1].length > maxDecimals ? maxDecimals : splittedValue[1].length;
    } else {
      sigDecDigits = Util.isDefined(splittedValue[1]) && splittedValue[1].length > minDecimals ? splittedValue[1].length : minDecimals;
    }
    return sigIntDigits + sigDecDigits;
  }

}
