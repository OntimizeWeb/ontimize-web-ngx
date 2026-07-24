import { Injector, Pipe, PipeTransform } from '@angular/core';

import { MomentService } from '../services/moment.service';

/**
 * @deprecated Use ILuxonPipeArgument instead.
 */
export interface IMomentPipeArgument {
  format?: string;
}

/**
 * @deprecated Use OLuxonPipe (oLuxon) instead. This pipe is kept for backwards
 * compatibility and continues to depend on moment.js (through MomentService).
 */
@Pipe({
  name: 'oMoment',
  standalone: true
})

export class OMomentPipe implements PipeTransform {

  protected momentService: MomentService;

  constructor(protected injector: Injector) {
    this.momentService = this.injector.get(MomentService);
  }

  transform(value: any, args: IMomentPipeArgument) {
    const format = args.format;
    return this.momentService.parseDate(value, format);
  }
}
