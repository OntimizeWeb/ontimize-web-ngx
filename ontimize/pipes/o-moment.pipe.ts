
import { Pipe, PipeTransform, Injector } from '@angular/core';
import { MomentService } from '../services';

export interface IMomentPipeArgument {
  format?: string;
}

@Pipe({
  name: 'oMoment'
})

export class OMomentPipe implements PipeTransform {

  protected momentService: MomentService;

  constructor(protected injector: Injector) {
    this.momentService = this.injector.get(MomentService);
  }

  transform(value: any, args: IMomentPipeArgument) {
    let format = args.format;
    return this.momentService.parseDate(value, format);
  }
}
