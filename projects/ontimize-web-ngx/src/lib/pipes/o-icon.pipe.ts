import { Injector, Pipe, PipeTransform } from '@angular/core';

import { IconService } from '../services/icon.service';

export interface IIconPipeArgument {
  iconPosition?: string;
  icon: string;
}

@Pipe({
  name: 'oIcon',
  pure: false
})
export class OIconPipe implements PipeTransform {

  protected iconService: IconService;
  constructor(protected injector: Injector) {
    this.iconService = this.injector.get(IconService);
  }

  transform(text: any, args: IIconPipeArgument): any {
    return this.iconService.getIconValue(text, args);
  }
}
