import { Inject, Injectable, Optional } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import moment, { Moment } from 'moment';

@Injectable()
export class OntimizeMomentDateAdapter extends MomentDateAdapter {

  oFormat: string;

  constructor(@Optional() @Inject(MAT_DATE_LOCALE) dateLocale: string) {
    super(dateLocale);
  }

  format(date: any, displayFormat: string): string {
    return super.format(date, this.oFormat || displayFormat);
  }

  parse(value: any, parseFormat: string | string[]): any | null {
    return super.parse(value, this.oFormat || parseFormat);
  }

  deserialize(value: any): Moment | null {
    let date;
    if (typeof value === 'number') {
      date = moment(value);
    }
    if (typeof value === 'string') {
      if (!value) {
        return null;
      }
      date = moment(value, this.oFormat).locale(this.locale);
    }
    if (date && this.isValid(date)) {
      return date;
    }
    return super.deserialize(value);
  }
}