import { Injector, Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MomentService } from '../services';
import * as CORE_TRANSLATIONS from '../i18n/i18n';
import { ObservableWrapper } from '../util/async';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class OTranslateService {

  public onLanguageChanged: EventEmitter<any> = new EventEmitter();

  protected translateService: TranslateService;
  protected momentService: MomentService;

  constructor(protected injector: Injector) {
    this.translateService = this.injector.get(TranslateService);
    this.momentService = this.injector.get(MomentService);
  }

  public setDefaultLang(lang: string): void {
    this.translateService.setDefaultLang(lang);
  }

  public get(text: string): string {
    let textTranslated = undefined;
    try {
      let bundle = this.translateService.get(text);
      if (bundle && bundle['value']) {
        textTranslated = bundle['value'];
      }

      textTranslated = textTranslated === text ? undefined : textTranslated;
    } catch (e) {
      textTranslated = undefined;
    }
    if (!textTranslated) {
      let bundle = CORE_TRANSLATIONS.MAP[this.translateService.currentLang];
      if (bundle && bundle[text]) {
        textTranslated = bundle[text];
      } else {
        textTranslated = text;
      }
    }
    return textTranslated;
  }

  public use(lang: string): Observable<any> {
    var observable = new Observable(observer => {
      this.translateService.use(lang)
        .subscribe(
        res => {
          this.momentService.load(lang);
          ObservableWrapper.callEmit(this.onLanguageChanged, lang);
          observer.next(res);
        }
        );
    });
    return observable;
  }

  public getCurrentLang() {
    return this.translateService.currentLang;
  }

}
