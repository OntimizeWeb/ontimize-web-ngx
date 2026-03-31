import { Injector, Pipe, PipeTransform } from '@angular/core';

import { OIntegerPipe } from './o-integer.pipe';

export interface IRealPipeArgument {
  grouping?: boolean;
  thousandSeparator?: string;
  locale?: string;
  decimalSeparator?: string;
  minDecimalDigits?: number;
  maxDecimalDigits?: number;
  truncate?: boolean;
}

@Pipe({
  name: 'oReal',
  pure: false
})
export class ORealPipe extends OIntegerPipe implements PipeTransform {

  constructor(protected injector: Injector) {
    super(injector);
  }

  transform(text: string, args: IRealPipeArgument): string {
    return this.numberService.getRealValue(text, args);
  }

}
