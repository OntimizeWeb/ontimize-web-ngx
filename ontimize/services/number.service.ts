import {Inject} from '@angular/core';
import {APP_CONFIG, Config} from '../config/app-config';

export class NumberService {

  public static DEFAULT_THOUSAND_SEPARATOR = ',';
  public static DEFAULT_DECIMAL_SEPARATOR = '.';
  public static DEFAULT_DECIMAL_DIGITS = 2;

  protected _grouping : boolean;
  protected _thousandSeparator : string;
  protected _decimalSeparator : string;
  protected _decimalDigits : number;

  constructor (@Inject(APP_CONFIG) private _config: Config) {
    //TODO: initialize from config
    this._grouping = true;
    this._thousandSeparator = NumberService.DEFAULT_THOUSAND_SEPARATOR;
    this._decimalSeparator = NumberService.DEFAULT_DECIMAL_SEPARATOR;
    this._decimalDigits = NumberService.DEFAULT_DECIMAL_DIGITS;
  }

  public get grouping () : boolean {
    return this._grouping;
  }

  public set grouping (value : boolean) {
    this._grouping = value;
  }

  public get thousandSeparator () : string {
    return this._thousandSeparator;
  }

  public set thousandSeparator (value : string) {
    this._thousandSeparator = value;
  }

  public get decimalSeparator () : string {
    return this._decimalSeparator;
  }

  public set decimalSeparator (value : string) {
    this._decimalSeparator = value;
  }

  public get decimalDigits () : number {
    return this._decimalDigits;
  }

  public set decimalDigits (value : number) {
    this._decimalDigits = value;
  }

  public getIntegerValue (value: any, grouping?: boolean, thousandSeparator?: string) {
    if (typeof(grouping) === 'undefined') {
      grouping = this._grouping;
    }
    if (typeof(thousandSeparator) === 'undefined') {
      thousandSeparator = this._thousandSeparator;
    }
    let intValue = parseInt(value, 10);
    if (isNaN(intValue)) {
      intValue = 0;
    }
    let formattedIntValue = String(intValue);
    if (grouping) {
      formattedIntValue = intValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
    }
    return formattedIntValue;
  }

  public getRealValue (value: any, grouping?: boolean, thousandSeparator?: string,
      decimalSeparator?: string, decimalDigits?: number) {
    if (typeof(grouping) === 'undefined') {
      grouping = this._grouping;
    }
    if (typeof(thousandSeparator) === 'undefined') {
      thousandSeparator = this._thousandSeparator;
    }
    if (typeof(decimalSeparator) === 'undefined') {
      decimalSeparator = this._decimalSeparator;
    }
    if (typeof(decimalDigits) === 'undefined') {
      decimalDigits = this._decimalDigits;
    }
    let realValue = parseFloat(value);
    if (isNaN(realValue)) {
      realValue = 0;
    }
    let formattedRealValue = String(realValue);
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
    return formattedRealValue;
  }

}
