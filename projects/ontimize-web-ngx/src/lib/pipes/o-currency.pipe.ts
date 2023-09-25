import { Injector, Pipe, PipeTransform } from '@angular/core';
import { CurrencyService } from '../services/currency.service';
import { ORealPipe } from './o-real.pipe';

export interface ICurrencyPipeArgument {
  currencySimbol?: string;
  currencySymbolPosition?: string;
  grouping?: boolean;
  thousandSeparator?: string;
  decimalSeparator?: string;
  minDecimalDigits?: number;
  maxDecimalDigits?: number;
}

@Pipe({
  name: 'oCurrency',
  pure: false
})
export class OCurrencyPipe extends ORealPipe implements PipeTransform {

  protected currencyService: CurrencyService;

  constructor(protected injector: Injector) {
    super(injector);
    this.currencyService = this.injector.get(CurrencyService);
  }

  transform(text: string, args: ICurrencyPipeArgument): string {
    return this.currencyService.getCurrencyValue(text, args);
  }
}
