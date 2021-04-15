import { Injector, Pipe, PipeTransform } from '@angular/core';
import { NumberService } from '../services/number.service';

export interface IIntegerPipeArgument {
  grouping?: boolean;
  thousandSeparator?: string;
  locale?: string;
}

@Pipe({
  name: 'oInteger',
  pure: false
})

export class OIntegerPipe implements PipeTransform {

  protected numberService: NumberService;

  constructor(protected injector: Injector) {
    this.numberService = this.injector.get(NumberService);
  }

  transform(text: string, args: IIntegerPipeArgument): string {
    return this.numberService.getIntegerValue(text, args);
  }
}
