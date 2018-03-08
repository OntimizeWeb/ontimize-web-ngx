import { Injector, Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { TranslateService } from '@ngx-translate/core';
import { MomentService, DialogService } from '../../services';
import * as CORE_TRANSLATIONS from '../../i18n/i18n';
import { ObservableWrapper } from '../../util/async';
import { AppConfig } from '../../config/app-config';

@Injectable()
export class OTranslateService {

  public static ASSETS_PATH = './assets/i18n/';
  public static ASSETS_EXTENSION = '.json';

  public DEFAULT_LANG = 'en';
  public onLanguageChanged: EventEmitter<any> = new EventEmitter();

  protected ngxTranslateService: TranslateService;
  protected momentService: MomentService;
  protected http: Http;

  protected notFoundLang: Array<String> = [];
  // protected _config: Config;
  protected appConfig: AppConfig;

  protected existingLangFiles: Array<String> = [];

  constructor(protected injector: Injector) {
    this.ngxTranslateService = this.injector.get(TranslateService);
    this.momentService = this.injector.get(MomentService);
    this.http = this.injector.get(Http);
    this.appConfig = this.injector.get(AppConfig);
    // this._config = this.injector.get(AppConfig).getConfiguration();

  }

  protected checkExistingLangFile(lang: string): Promise<any> {
    var self = this;
    return new Promise((resolve) => {
      if (self.existingLangFiles.indexOf(lang) !== -1) {
        resolve(true);
        return;
      }
      self.http.get(OTranslateService.ASSETS_PATH + lang + OTranslateService.ASSETS_EXTENSION)
        .subscribe(function () {
          if (self.existingLangFiles.indexOf(lang) === -1) {
            self.existingLangFiles.push(lang);
          }
          // I18N File loaded successfully
          resolve(true);
        }, function () {
          // I18N File failed to load
          if (self.notFoundLang.indexOf(lang) === -1) {
            self.notFoundLang.push(lang);
          }
          resolve(false);
        });
    });
  }

  public setDefaultLang(lang: string): void {
    this.checkExistingLangFile(lang).then((exists) => {
      if (exists) {
        // this.ngxTranslateService.setDefaultLang(lang);
        this.ngxTranslateService.defaultLang = lang;
      }
    });
  }

  public get(text: string, values: any[] = []): string {
    let textTranslated = text;
    try {
      let bundle = this.ngxTranslateService.get(text, values);
      if (bundle && bundle['value']) {
        textTranslated = bundle['value'];
      }
    } catch (e) {
      textTranslated = text;
    }
    return textTranslated;
  }

  public setAppLang(lang: string): Observable<any> {
    var observable = new Observable(observer => {
      this.use(lang, observer);
    });
    return observable;
  }

  public use(lang: string, observer?: Subscriber<any>): void {
    if (lang === undefined /*|| this.notFoundLang.indexOf(lang) !== -1*/) {
      let newLang = lang || this.DEFAULT_LANG;
      //setting lang for initializING moment and other components
      this.propagateLang(newLang, {}, observer);
    } else {
      this.checkExistingLangFile(lang).then((exists) => {
        let newLang = lang;
        if (!exists && !this.appConfig.useRemoteBundle()) {
          newLang = this.ngxTranslateService.getDefaultLang();
          this.injector.get(DialogService).alert('ERROR', CORE_TRANSLATIONS.MAP[newLang || this.DEFAULT_LANG]['MESSAGES.ERROR_MISSING_LANG']);
        }
        this.ngxTranslateService.use(newLang).subscribe(
          res => {
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
    var browserLang = navigator.languages ? navigator.languages[0] : null;
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
