import { Component, Injector, EventEmitter, NgModule, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OSharedModule } from '../../shared';
import { OTranslateService } from '../../services';
import { AppConfig } from '../../config/app-config';


export const DEFAULT_INPUTS_O_LANGUAGE_SELECTOR = [
];

export const DEFAULT_OUTPUTS_LANGUAGE_SELECTOR = [
  'onChange'
];

@Component({
  selector: 'o-language-selector',
  inputs: DEFAULT_INPUTS_O_LANGUAGE_SELECTOR,
  outputs: DEFAULT_OUTPUTS_LANGUAGE_SELECTOR,
  templateUrl: './o-language-selector.component.html',
  styleUrls: ['./o-language-selector.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-language-selector]': 'true'
  }
})

export class OLanguageSelectorComponent {

  public static DEFAULT_INPUTS_O_LANGUAGE_SELECTOR = DEFAULT_INPUTS_O_LANGUAGE_SELECTOR;
  public static DEFAULT_OUTPUTS_LANGUAGE_SELECTOR = DEFAULT_OUTPUTS_LANGUAGE_SELECTOR;

  onChange: EventEmitter<Object> = new EventEmitter<Object>();

  protected translateService: OTranslateService;
  protected _config: AppConfig;
  protected availableLangs: string[];

  constructor(protected injector: Injector) {
    this.translateService = this.injector.get(OTranslateService);
    this._config = this.injector.get(AppConfig);
    this.availableLangs = this._config.getConfiguration().applicationLocales;
  }

  // ngOnInit(): void {

  // }

  // ngOnDestroy() {

  // }

  getFlagClass(lang: string) {
    const flagName = (lang !== 'en') ? lang : 'gb';
    return 'flag-icon-' + flagName;
  }

  getAvailableLangs(): string[] {
    return this.availableLangs;
  }

  configureI18n(lang: any) {
    if (this.translateService && this.translateService.getCurrentLang() !== lang) {
      this.translateService.use(lang);
    }
  }

  getCurrentLang(): string {
    return this.translateService.getCurrentLang();
  }

}


@NgModule({
  declarations: [OLanguageSelectorComponent],
  imports: [OSharedModule, CommonModule],
  exports: [OLanguageSelectorComponent]
})
export class OLanguageSelectorModule {
}
