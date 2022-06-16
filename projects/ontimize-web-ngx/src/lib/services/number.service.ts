import { Injectable, Injector } from '@angular/core';

import { IRealPipeArgument } from '../pipes';
import { Util } from '../util/util';
import { OTranslateService } from './translate/o-translate.service';

@Injectable({
  providedIn: 'root'
})
export class NumberService {

  public static DEFAULT_DECIMAL_DIGITS = 2;

  protected minDecimalDigits: number;
  protected maxDecimalDigits: number;
  protected locale: string;

  protected translateService: OTranslateService;

  constructor(protected injector: Injector) {

    this.translateService = this.injector.get(OTranslateService);
    // TODO: initialize from config
    this.minDecimalDigits = NumberService.DEFAULT_DECIMAL_DIGITS;
    this.maxDecimalDigits = NumberService.DEFAULT_DECIMAL_DIGITS;

    this.locale = this.translateService.getCurrentLang()
    this.translateService.onLanguageChanged.subscribe(() =>
      this.locale = this.translateService.getCurrentLang()
    );
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
    if (Util.isDefined(locale) || !Util.isDefined(thousandSeparator)) {
      formattedIntValue = new Intl.NumberFormat(Util.isDefined(locale) ? locale : this.locale).format(intValue);
    } else {
      formattedIntValue = String(intValue).toString().replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
    }
    return formattedIntValue;
  }

  getRealValue(value: any, args: IRealPipeArgument) {
    if (!Util.isDefined(value)) {
      return value;
    }

    const locale = args ? args.locale : undefined;
    const thousandSeparator = args ? args.thousandSeparator : undefined;
    const decimalSeparator = args ? args.decimalSeparator : undefined;
    const grouping = args ? args.grouping : false;

    const minDecimalDigits = args ? args.minDecimalDigits : this.minDecimalDigits;
    const maxDecimalDigits = args ? args.maxDecimalDigits : this.maxDecimalDigits;

    let formattedRealValue = value;
    const useIntlNumberFormat: boolean = Util.isDefined(locale) || (!Util.isDefined(thousandSeparator) || !Util.isDefined(decimalSeparator));
    if (useIntlNumberFormat) {
      formattedRealValue = args.truncate ? this.truncate(value, maxDecimalDigits) : null;
      if (!Util.isDefined(formattedRealValue)) {
        let formatterArgs: any = {
          minimumFractionDigits: minDecimalDigits,
          maximumFractionDigits: maxDecimalDigits,
          useGrouping: grouping
        };
        formattedRealValue = new Intl.NumberFormat(Util.isDefined(locale) ? locale : this.locale, formatterArgs).format(value);
      }
    } else {
      formattedRealValue = this.parseRealValue(value, maxDecimalDigits, thousandSeparator, decimalSeparator, grouping);
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

  private truncate(value: number, maxDecimals: number): string {
    const stringValue = String(value);
    const splittedValue = stringValue.split('.');
    const decimalsLength = Util.isDefined(splittedValue[1]) ? splittedValue[1].length : null;
    if (decimalsLength > maxDecimals) {
      return stringValue.slice(0, splittedValue[0].length + 1 + maxDecimals);
    }
    return null;
  }

  private parseRealValue(value: any, maxDecimalDigits: number, thousandSeparator: string, decimalSeparator: string, grouping: boolean): string {
    let result = value;
    const realValue = parseFloat(value);
    if (!isNaN(realValue)) {
      result = String(realValue);
      let tmpStr = realValue.toFixed(maxDecimalDigits);
      tmpStr = tmpStr.replace('.', decimalSeparator);
      if (grouping) {
        const parts = tmpStr.split(decimalSeparator);
        if (parts.length > 0) {
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
          result = parts.join(decimalSeparator);
        }
      } else {
        result = tmpStr;
      }
    }
    return result;
  }
}
