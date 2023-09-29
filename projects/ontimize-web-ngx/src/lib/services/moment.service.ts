import { Injectable, Injector } from '@angular/core';
import moment from 'moment';

import { AppConfig } from '../config/app-config';
import { Config } from '../types/config.type';

@Injectable({
  providedIn: 'root'
})
export class MomentService {

  // HTML5 input date: YYYY-MM-DD // locale ES-es: DD-MM-YYYY // locale EN-en: MM-DD-YYYY // ISO 8601:
  // YYYY-MM-DDThh:mm:ss.S // UTC: YYYY-MM-DD hh:mm:ssZ
  static DATE_FORMATS = ['YYYY-MM-DD', 'DD-MM-YYYY', 'MM-DD-YYYY', 'YYYY-MM-DDThh:mm:ss.S', 'YYYY-MM-DDThh:mm:ss.SSSZ', 'YYYY-MM-DD hh:mm:ssZ'];
  static defaultFormat: string = 'L';
  private _locale: string;
  private _config: Config;

  constructor(protected injector: Injector) {
    this._config = this.injector.get(AppConfig).getConfiguration();
    this.load(this._config.locale);
  }

  load(locale: string) {
    this._locale = locale;
  }

  parseDate(value: any, format?: string, locale?: string): any {
    let result = '';
    if (!locale) {
      locale = this._locale;
    }
    if (typeof value === 'number') {
      result = moment(new Date(value)).locale(locale).format(format ? format : MomentService.defaultFormat);
    } else {
      result = moment(value, MomentService.DATE_FORMATS, locale).format(format ? format : MomentService.defaultFormat);
    }
    result = (result === 'Invalid date') ? '' : result;
    return result;
  }

  getLocale() {
    return this._locale;
  }

}
