import { Pipe, PipeTransform, Injector } from '@angular/core';


export interface ICurrencyPipeArgument {
  currencySimbol?: string;
  currencySymbolPosition?: string;
  grouping?: boolean;
  thousandSeparator?: string;
  decimalSeparator?: string;
  decimalDigits?: number;
}

import {
  CurrencyService
} from '../services';

@Pipe({
  name: 'oCurrency'
})
export class OCurrencyPipe implements PipeTransform {

  protected currencyService: CurrencyService;
  constructor(protected injector: Injector) {
    this.currencyService = this.injector.get(CurrencyService);
  }

  transform(text: string, args: ICurrencyPipeArgument): string {
    let grouping = args.grouping;
    let thousandSeparator = args.thousandSeparator;
    let decimalSeparator = args.decimalSeparator;
    let decimalDigits = args.decimalDigits;
    let currencySimbol = args.currencySimbol;
    let currencySymbolPosition = args.currencySymbolPosition;

    return this.currencyService.getCurrencyValue(text, currencySimbol, currencySymbolPosition, grouping, thousandSeparator, decimalSeparator, decimalDigits);
  }
}
