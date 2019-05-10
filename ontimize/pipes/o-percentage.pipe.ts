import { Pipe, PipeTransform, Injector } from '@angular/core';
import { ORealPipe } from './o-real.pipe';

export type OPercentageValueBaseType = 1 | 100;

export interface IPercentPipeArgument {
  grouping?: boolean;
  thousandSeparator?: string;
  locale?: string;
  decimalSeparator?: string;
  minDecimalDigits?: number;
  maxDecimalDigits?: number;
  valueBase?: OPercentageValueBaseType;
}

@Pipe({
  name: 'oPercent'
})
export class OPercentPipe extends ORealPipe implements PipeTransform {

  constructor(protected injector: Injector) {
    super(injector);
  }

  transform(text: string, args: IPercentPipeArgument): string {
    return this.numberService.getPercentValue(text, args);
  }

}
