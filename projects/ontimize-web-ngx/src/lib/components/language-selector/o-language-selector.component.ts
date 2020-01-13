import { Component, Injector, EventEmitter, NgModule, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OSharedModule } from '../../shared';
import { OTranslateService } from '../../services';
import { AppConfig } from '../../config/app-config';
import { InputConverter } from '../../decorators';
import LocaleCode from '../../util/locale';

export const DEFAULT_INPUTS_O_LANGUAGE_SELECTOR = [
  'useFlagIcons: use-flag-icons'
];

export const DEFAULT_OUTPUTS_LANGUAGE_SELECTOR = [
  'onChange'
];

@Component({
  moduleId: module.id,
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

  @InputConverter()
  useFlagIcons: boolean = false;

  onChange: EventEmitter<Object> = new EventEmitter<Object>();

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
    }
  }

  getCurrentLang(): string {
    return this.translateService.getCurrentLang();
  }

  getCurrentCountry(): string {
    return LocaleCode.getCountryCode(this.getCurrentLang());
  }

}

@NgModule({
  declarations: [OLanguageSelectorComponent],
  imports: [OSharedModule, CommonModule],
  exports: [OLanguageSelectorComponent]
})
export class OLanguageSelectorModule {
}
