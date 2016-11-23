import { Pipe, PipeTransform, Injector } from '@angular/core';
import { OIntegerPipe } from './o-integer.pipe';
import { IRealPipeArgument } from '../interfaces/pipes.interfaces';

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
    let decimalDigits = args.decimalDigits;

    return this.numberService.getRealValue(text, grouping, thousandSeparator, decimalSeparator, decimalDigits, locale);
  }
}
