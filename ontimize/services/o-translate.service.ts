import { Injector, Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';
import { MomentService, DialogService } from '../services';
import * as CORE_TRANSLATIONS from '../i18n/i18n';
import { ObservableWrapper } from '../util/async';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

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

  constructor(protected injector: Injector) {
    this.ngxTranslateService = this.injector.get(TranslateService);
    this.momentService = this.injector.get(MomentService);
    this.http = this.injector.get(Http);
  }

  protected checkExistingLangFile(lang: string): Promise<any> {
    var self = this;
    return new Promise((resolve) => {
      self.http.get(OTranslateService.ASSETS_PATH + lang + OTranslateService.ASSETS_EXTENSION)
        .subscribe(function () {
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
        this.ngxTranslateService.setDefaultLang(lang);
      }
    });
  }

  public get(text: string): string {
    let textTranslated = undefined;
    try {
      let bundle = this.ngxTranslateService.get(text);
      if (bundle && bundle['value']) {
        textTranslated = bundle['value'];
      }

      textTranslated = textTranslated === text ? undefined : textTranslated;
    } catch (e) {
      textTranslated = undefined;
    }
    if (!textTranslated) {
      let bundle = CORE_TRANSLATIONS.MAP[this.ngxTranslateService.currentLang || this.DEFAULT_LANG];
      if (bundle && bundle[text]) {
        textTranslated = bundle[text];
      } else {
        textTranslated = text;
      }
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
        if (!exists) {
          newLang = this.ngxTranslateService.getDefaultLang();
          this.injector.get(DialogService).alert('ERROR', CORE_TRANSLATIONS.MAP[newLang || this.DEFAULT_LANG]['MESSAGES.ERROR_MISSING_LANG']);
        }
        this.ngxTranslateService.use(newLang).subscribe(
          res => {
            this.propagateLang(lang, res, observer);
          }
        );
      });
    }
  }

  protected propagateLang(lang: string, langRes?: any, observer?: Subscriber<any>) {
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
    return this.ngxTranslateService.getBrowserLang();
  }

}
