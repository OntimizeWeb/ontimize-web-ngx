import { Injector, Pipe, PipeTransform } from '@angular/core';
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
  name: 'oPercent',
  pure: false
})
export class OPercentPipe extends ORealPipe implements PipeTransform {

  constructor(protected injector: Injector) {
    super(injector);
  }

  transform(text: string, args: IPercentPipeArgument): string {
    if (args && args.valueBase) {
      args.valueBase = this.parseValueBase(args.valueBase);
    }
    return this.numberService.getPercentValue(text, args);
  }

  protected parseValueBase(value: OPercentageValueBaseType): OPercentageValueBaseType {
    const parsed = parseInt(value as any, 10);
    if (parsed === 1 || parsed === 100) {
      return parsed;
    }
    return 1;
  }

}
