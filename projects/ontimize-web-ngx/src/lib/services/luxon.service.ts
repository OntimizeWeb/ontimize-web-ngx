import { inject, Injectable } from '@angular/core';
import { DateTime } from 'luxon';

import { AppConfig } from '../config/app-config';
import { Config } from '../types/config.type';

@Injectable({
  providedIn: 'root'
})
export class LuxonService {

  // HTML5 input date: yyyy-MM-dd // locale ES-es: dd-MM-yyyy // locale EN-en: MM-dd-yyyy // ISO 8601:
  // yyyy-MM-dd'T'HH:mm:ss.S // UTC: yyyy-MM-dd HH:mm:ssZZ
  // Note: the legacy MomentService formats used 'hh' (12h, no meridiem) here, which is
  // ambiguous without an 'a'/'A' token — corrected to 'HH' (24h) for these Luxon formats.
  static DATE_FORMATS = ['yyyy-MM-dd', 'dd-MM-yyyy', 'MM-dd-yyyy', 'yyyy-MM-dd\'T\'HH:mm:ss.S', 'yyyy-MM-dd\'T\'HH:mm:ss.SSSZZ', 'yyyy-MM-dd HH:mm:ssZZ'];
  static defaultFormat: string = 'D';
  private _locale: string = '';
  private _config: Config;

  constructor() {
    this._config = inject(AppConfig).getConfiguration();
    this.load(this._config.locale ?? '');
  }

  load(locale: string) {
    this._locale = locale;
  }

  parseDate(value: any, format?: string, locale?: string): any {
    let result = '';
    if (!locale) {
      locale = this._locale;
    }
    let date: DateTime = null;
    if (typeof value === 'number') {
      date = DateTime.fromMillis(value, { locale });
    } else {
      for (const candidate of LuxonService.DATE_FORMATS) {
        const parsed = DateTime.fromFormat(value, candidate, { locale });
        if (parsed.isValid) {
          date = parsed;
          break;
        }
      }
      if (!date) {
        date = DateTime.fromISO(value, { locale });
      }
    }
    result = (date && date.isValid) ? date.toFormat(format ? format : LuxonService.defaultFormat) : '';
    return result;
  }

  getLocale() {
    return this._locale;
  }

}
