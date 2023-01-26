import { Component, EventEmitter, Injector, ViewEncapsulation } from '@angular/core';

import { AppConfig } from '../../config/app-config';
import { InputConverter } from '../../decorators/input-converter';
import { OTranslateService } from '../../services/translate/o-translate.service';
import LocaleCode from '../../util/locale';

export const DEFAULT_INPUTS_O_LANGUAGE_SELECTOR = [
  'useFlagIcons: use-flag-icons'
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

  @InputConverter()
  useFlagIcons: boolean = false;

  onChange: EventEmitter<object> = new EventEmitter<object>();

  protected translateService: OTranslateService;
  protected appConfig: AppConfig;
  protected availableLangs: string[];

  constructor(protected injector: Injector) {
    this.translateService = this.injector.get(OTranslateService);
    this.appConfig = this.injector.get(AppConfig);
    this.availableLangs = this.appConfig.getConfiguration().applicationLocales;
  }

  getFlagClass(lang: string) {
    let flagName = LocaleCode.getCountryCode(lang);
    flagName = (flagName !== 'en') ? flagName : 'gb';
    return 'flag-icon-' + flagName;
  }

  getAvailableLangs(): string[] {
    return this.availableLangs;
  }

  configureI18n(lang: any) {
    if (this.translateService && this.translateService.getCurrentLang() !== lang) {
      this.translateService.use(lang);
      this.onChange.emit(lang);
    }
  }

  getCurrentLang(): string {
    return this.translateService.getCurrentLang();
  }

  getCurrentCountry(): string {
    return LocaleCode.getCountryCode(this.getCurrentLang());
  }

}
