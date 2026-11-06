import { Injector, Pipe, PipeTransform } from '@angular/core';

import { LuxonService } from '../services/luxon.service';

export interface ILuxonPipeArgument {
  format?: string;
}

@Pipe({
  name: 'oLuxon',
  standalone: true
})

export class OLuxonPipe implements PipeTransform {

  protected luxonService: LuxonService;

  constructor(protected injector: Injector) {
    this.luxonService = this.injector.get(LuxonService);
  }

  transform(value: any, args: ILuxonPipeArgument) {
    const format = args.format;
    return this.luxonService.parseDate(value, format);
  }
}
