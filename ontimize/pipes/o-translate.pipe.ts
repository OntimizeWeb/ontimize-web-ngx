import {
  Pipe,
  PipeTransform,
  Injector,
  NgModule,
  ModuleWithProviders
} from '@angular/core';

import { OTranslateService } from '../services';

@Pipe({
  name: 'oTranslate',
  pure: false
})
export class OTranslatePipe implements PipeTransform {

  protected translateService: OTranslateService;

  constructor( protected injector: Injector ) {
    this.translateService = this.injector.get(OTranslateService);
  }

  transform(text: string): string {
    if (this.translateService) {
      return this.translateService.get(text);
    }
    return text;
  }

}

@NgModule({
  declarations: [OTranslatePipe],
  imports: [],
  exports: [OTranslatePipe]
})
export class OTranslateModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OTranslateModule,
      providers: []
    };
  }
}
