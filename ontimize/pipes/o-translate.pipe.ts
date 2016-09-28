import { Pipe, PipeTransform, Inject,
  NgModule,
  ModuleWithProviders} from '@angular/core';
import { OTranslateService } from '../services';

@Pipe({
  name: 'oTranslate',
  pure: false
})
export class OTranslatePipe implements PipeTransform {

  constructor(@Inject(OTranslateService) private translateService: OTranslateService) {
  }

  transform(text: string): string {
    return this.translateService.get(text);
  }

}

@NgModule({
  declarations: [OTranslatePipe],
  imports: [],
  exports: [OTranslatePipe],
})
export class OTranslateModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OTranslateModule,
      providers: []
    };
  }
}
