import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscriber } from 'rxjs';

import { AppConfig } from '../../config/app-config';
import * as CORE_TRANSLATIONS from '../../i18n/i18n';
import { MomentService } from '../../services/moment.service';
import { SnackBarService } from '../../services/snackbar.service';
import { ObservableWrapper } from '../../util/async';
import { _getInjectionTokenValue, O_TRANSLATE_SERVICE } from '../factories';
import { Util } from '../../util/util';
import { Codes } from '../../util/codes';

/**
 * `OTranslateService` factory.
 * Creates a new instance of the translate service.
 */
export function translateServiceFactory(injector: Injector): any {
  const serviceClass = _getInjectionTokenValue(O_TRANSLATE_SERVICE, injector);
  const service = Util.createServiceInstance(serviceClass, injector);
  return Util.isDefined(service) ? service : new OTranslateService(injector);
}

@Injectable({ providedIn: 'root', useFactory: translateServiceFactory, deps: [Injector] })
export class OTranslateService {

  public static ASSETS_PATH = './assets/i18n/';
  public static ASSETS_EXTENSION = '.json';
  public DEFAULT_LANG = 'en';
  public onLanguageChanged: EventEmitter<any> = new EventEmitter();

  protected ngxTranslateService: TranslateService;
  protected momentService: MomentService;
  protected httpClient: HttpClient;

  protected localStorageKey: string;
  protected notFoundLang: Array<string> = [];
  protected appConfig: AppConfig;

  protected existingLangFiles: Array<string> = [];

  constructor(protected injector: Injector) {
    this.ngxTranslateService = this.injector.get(TranslateService);
    this.momentService = this.injector.get(MomentService);
    this.httpClient = this.injector.get(HttpClient);
    this.appConfig = this.injector.get(AppConfig);
    this.localStorageKey = this.appConfig.getConfiguration().uuid;
  }

  public storeLanguage(language: string): void {
    if (language) {
      const dataStr = localStorage.getItem(this.localStorageKey);
      const data = (dataStr && dataStr.length > 0) ? JSON.parse(dataStr) : {};
      data[Codes.LANGUAGE_KEY] = language;
      try {
        localStorage.setItem(this.localStorageKey, JSON.stringify(data));
      } catch (e) {
        console.error("Cannot set new item in localStorage. Error: " + e);
      }
    }
  }

  public getStoredLanguage(): string {
    const dataStr = localStorage.getItem(this.localStorageKey);
    return dataStr ? JSON.parse(dataStr)[Codes.LANGUAGE_KEY] : void 0;
  }

  protected checkExistingLangFile(lang: string): Promise<any> {
    const self = this;
    return new Promise((resolve) => {
      if (self.existingLangFiles.indexOf(lang) !== -1) {
        resolve(true);
        return;
      }
      const localeAssetsPath = (this.ngxTranslateService.currentLoader as any).prefix;
      const localeAssetsExtension = (this.ngxTranslateService.currentLoader as any).suffix;
      self.httpClient.get(localeAssetsPath + lang + localeAssetsExtension).subscribe(() => {
        if (self.existingLangFiles.indexOf(lang) === -1) {
          self.existingLangFiles.push(lang);
        }
        // I18N File loaded successfully
        resolve(true);
      }, () => {
        // I18N File failed to load
        if (self.notFoundLang.indexOf(lang) === -1) {
          self.notFoundLang.push(lang);
        }
        resolve(false);
      });
    });
  }

  public setDefaultLang(lang: string): void {
    this.ngxTranslateService.defaultLang = lang;
    this.checkExistingLangFile(lang).then((exists) => {
      if (!exists) {
        console.error('Default language(' + lang + ') has no bundle file defined');
      }
    });
  }

  public get(text: string, values: any[] = []): string {
    let textTranslated;
    try {
      const bundle = this.ngxTranslateService.get(text, values);
      if (bundle) {
        bundle.subscribe(x => textTranslated = x);
      }
      textTranslated = textTranslated === text ? undefined : textTranslated;
    } catch (e) {
      textTranslated = undefined;
    }
    if (!textTranslated) {
      const bundle = CORE_TRANSLATIONS.MAP[this.ngxTranslateService.currentLang] || CORE_TRANSLATIONS.MAP[this.DEFAULT_LANG];
      if (bundle && bundle[text]) {
        textTranslated = bundle[text];
      } else {
        textTranslated = text;
      }
    }
    return textTranslated;
  }

  public setAppLang(lang: string): Observable<any> {
    const observable = new Observable(observer => {
      this.use(lang, observer);
    });
    return observable;
  }

  public use(lang: string, observer?: Subscriber<any>): void {
    if (lang === undefined) {
      const newLang = lang || this.DEFAULT_LANG;
      // setting lang for initializING moment and other components
      this.propagateLang(newLang, {}, observer);
    } else {
      this.checkExistingLangFile(lang).then((exists) => {
        let newLang = lang;
        if (!exists) {
          newLang = Util.isDefined(this.appConfig['_config']['defaultLocale']) ? this.appConfig['_config']['defaultLocale'] : this.ngxTranslateService.getDefaultLang();
          const msg = CORE_TRANSLATIONS.MAP[newLang || this.DEFAULT_LANG]['MESSAGES.ERROR_MISSING_LANG'];
          this.injector.get(SnackBarService).open(msg, {
            milliseconds: 2500
          });
        }
        this.ngxTranslateService.use(newLang).subscribe(
          res => {
            this.storeLanguage(newLang);
            this.propagateLang(newLang, res, observer);
          }
        );
      });
    }
  }

  protected propagateLang(lang: string, langRes?: any, observer?: Subscriber<any>) {
    const coreBundle = CORE_TRANSLATIONS.MAP[lang || this.DEFAULT_LANG];
    if (coreBundle !== undefined) {
      const mixed = Object.assign({}, coreBundle, langRes);
      this.ngxTranslateService.translations[lang] = mixed;
    }
    this.momentService.load(lang);
    ObservableWrapper.callEmit(this.onLanguageChanged, lang);
    if (observer) {
      observer.next(langRes);
    }
  }

  public getCurrentLang() {
    return this.ngxTranslateService.currentLang;
  }

  public getBrowserLang() {
    // copying this.ngxTranslateService.getBrowserLang() but with a fix for default selected language (browserLang)
    if (typeof window === 'undefined' || typeof window.navigator === 'undefined') {
      return undefined;
    }
    const navigator: any = window.navigator;
    let browserLang = navigator.languages ? navigator.languages[0] : null;
    browserLang = navigator.language || browserLang || navigator.browserLanguage || navigator.userLanguage;
    if (browserLang.indexOf('-') !== -1) {
      browserLang = browserLang.split('-')[0];
    }
    if (browserLang.indexOf('_') !== -1) {
      browserLang = browserLang.split('_')[0];
    }
    return browserLang;
  }

}
