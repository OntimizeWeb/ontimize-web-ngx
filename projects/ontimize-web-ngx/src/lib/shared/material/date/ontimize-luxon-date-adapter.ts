import { Inject, Injectable, Optional } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { LuxonDateAdapter } from '@angular/material-luxon-adapter';
import { DateTime } from 'luxon';

@Injectable()
export class OntimizeLuxonDateAdapter extends LuxonDateAdapter {

  public oFormat: string;

  constructor(@Optional() @Inject(MAT_DATE_LOCALE) dateLocale: string) {
    super(dateLocale);
  }

  format(date: DateTime, displayFormat: string): string {
    return super.format(date, this.oFormat || displayFormat);
  }

  parse(value: any, parseFormat: string | string[]): DateTime | null {
    return super.parse(value, this.oFormat || parseFormat);
  }

  deserialize(value: any): DateTime | null {
    let date: DateTime;
    if (typeof value === 'number') {
      date = DateTime.fromMillis(value);
    }
    if (typeof value === 'string') {
      if (!value) {
        return null;
      }
      if (this.oFormat) {
        date = DateTime.fromFormat(value, this.oFormat, { locale: this.locale });
      }
    }
    if (date && this.isValid(date)) {
      return date;
    }
    return super.deserialize(value);
  }
}
