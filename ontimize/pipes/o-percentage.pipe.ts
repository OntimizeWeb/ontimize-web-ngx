import { Pipe, PipeTransform, Injector } from '@angular/core';

import { ORealPipe } from './o-real.pipe';

export interface IPercentPipeArgument {
  grouping?: boolean;
  thousandSeparator?: string;
  locale?: string;
  decimalSeparator?: string;
  minDecimalDigits?: number;
  maxDecimalDigits?: number;
}

@Pipe({
  name: 'oPercent'
})
export class OPercentPipe extends ORealPipe implements PipeTransform {

  constructor(protected injector: Injector) {
    super(injector);
  }

  transform(text: string, args: IPercentPipeArgument): string {
    let grouping = args.grouping;
    let thousandSeparator = args.thousandSeparator;
    let locale = args.locale;
    let decimalSeparator = args.decimalSeparator;
    let minDecimalDigits = args.minDecimalDigits;
    let maxDecimalDigits = args.maxDecimalDigits;

    return this.numberService.getPercentValue(text, grouping, thousandSeparator, decimalSeparator, minDecimalDigits, maxDecimalDigits, locale);
  }

}
