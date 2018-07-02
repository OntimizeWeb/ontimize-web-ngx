import { Pipe, PipeTransform, Injector } from '@angular/core';

import { OIntegerPipe } from './o-integer.pipe';

export interface IRealPipeArgument {
  grouping?: boolean;
  thousandSeparator?: string;
  locale?: string;
  decimalSeparator?: string;
  minDecimalDigits?: number;
  maxDecimalDigits?: number;
}

@Pipe({
  name: 'oReal'
})
export class ORealPipe extends OIntegerPipe implements PipeTransform {

  constructor(protected injector: Injector) {
    super(injector);
  }

  transform(text: string, args: IRealPipeArgument): string {
    let grouping = args.grouping;
    let thousandSeparator = args.thousandSeparator;
    let locale = args.locale;
    let decimalSeparator = args.decimalSeparator;
    let minDecimalDigits = args.minDecimalDigits;
    let maxDecimalDigits = args.maxDecimalDigits;

    return this.numberService.getRealValue(text, grouping, thousandSeparator, decimalSeparator, minDecimalDigits, maxDecimalDigits, locale);
  }

}
