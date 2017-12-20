import { DateAdapter } from '@angular/material';
import { Moment } from 'moment';
import * as moment from 'moment';

const SUPPORTS_INTL_API = typeof Intl !== 'undefined';

const dateNames: string[] = [];
for (let date = 1; date <= 31; date++) {
  dateNames.push(String(date));
}

export class MomentDateAdapter extends DateAdapter<Date> {

  private localeData = moment.localeData();

  setLocale(locale: any): void {
    super.setLocale(locale);
    moment.locale(locale);
    this.localeData = moment.localeData(locale);
  }

  addCalendarYears(date: Date, years: number): Date {
    return this.addCalendarMonths(date, years * 12);
  }

  addCalendarMonths(date: Date, months: number): Date {
    let newDate = this._createDateWithOverflow(
      this.getYear(date), this.getMonth(date) + months, this.getDate(date));

    // It's possible to wind up in the wrong month if the original month has more days than the new
    // month. In this case we want to go to the last day of the desired month.
    // Note: the additional + 12 % 12 ensures we end up with a positive number, since JS % doesn't
    // guarantee this.
    if (this.getMonth(newDate) !== ((this.getMonth(date) + months) % 12 + 12) % 12) {
      newDate = this._createDateWithOverflow(this.getYear(newDate), this.getMonth(newDate), 0);
    }

    return newDate;
  }

  addCalendarDays(date: Date, days: number): Date {
    return this._createDateWithOverflow(
      this.getYear(date), this.getMonth(date), this.getDate(date) + days);
  }

  getDayOfWeek(date: Date): number {
    return date.getDay();
  }

  getISODateString(date: Date): string {
    return date.toISOString();
  }

  isDateInstance(obj: any) {
    return obj instanceof Date;
  }

  isValid(date: Date) {
    if (date instanceof Date) {
      return !isNaN(date.getTime());
    }
    return false;
  }

  /** Creates a date but allows the month and date to overflow. */
  private _createDateWithOverflow(year: number, month: number, date: number) {
    let result = new Date(year, month, date);

    // We need to correct for the fact that JS native Date treats years in range [0, 99] as
    // abbreviations for 19xx.
    if (year >= 0 && year < 100) {
      result.setFullYear(this.getYear(result) - 1900);
    }
    return result;
  }

  clone(date: Date): Date {
    return this.createDate(this.getYear(date), this.getMonth(date), this.getDate(date));
  }

  private _stripDirectionalityCharacters(str: string) {
    return str.replace(/[\u200e\u200f]/g, '');
  }

  createDate(year: number, month: number, date: number): Date {
    // Check for invalid month and date (except upper bound on date which we have to check after
    // creating the Date).
    if (month < 0 || month > 11) {
      throw Error(`Invalid month index "${month}". Month index has to be between 0 and 11.`);
    }

    if (date < 1) {
      throw Error(`Invalid date "${date}". Date has to be greater than 0.`);
    }

    let result = this._createDateWithOverflow(year, month, date);

    // Check that the date wasn't above the upper bound for the month, causing the month to overflow
    if (result.getMonth() !== month) {
      throw Error(`Invalid date "${date}" for month with index "${month}".`);
    }

    return result;
  }

  today(): Date {
    return new Date();
  }

  getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    switch (style) {
      case 'long':
        return this.localeData.months();
      case 'short':
        return this.localeData.monthsShort();
      case 'narrow':
        return this.localeData.monthsShort().map(month => month[0]);
    }
  }

  getDateNames(): string[] {
    return dateNames;
  }

  getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    switch (style) {
      case 'long':
        return this.localeData.weekdays();
      case 'short':
        return this.localeData.weekdaysShort();
      case 'narrow':
        // Moment does not accept format even though @types/moment suggests it does
        return this.localeData.weekdaysShort();
    }
  }

  getYearName(date: Date): string {
    if (SUPPORTS_INTL_API) {
      let dtf = new Intl.DateTimeFormat(this.locale, { year: 'numeric' });
      return this._stripDirectionalityCharacters(dtf.format(date));
    }
    return String(date.getFullYear());
  }

  getFirstDayOfWeek(): number {
    return this.localeData.firstDayOfWeek();
  }

  getNumDaysInMonth(date: Date): number {
    return this.getDate(this._createDateWithOverflow(
      this.getYear(date), this.getMonth(date) + 1, 0));
  }

  getMonth(date: Date): number {
    return date.getMonth();
  }

  getDate(date: Date): number {
    //if (date instanceof Date) {
    return date.getDate();
    //}
  }

  getYear(date: Date): number {
    //if (date instanceof Date) {
    return date.getFullYear();
    //}
  }

  format(date: Date, displayFormat: any): string {
    if (this.isValid(date)) {
      if (typeof displayFormat === 'string') {
        let momentDate = moment(date);
        return momentDate.format(displayFormat);
      }
    }
    return '';
  }

  parse(value: any, parseFormat: any): Date {
    if (typeof value === 'undefined' || value === '') {
      return null;
    }
    if (typeof value === 'number') {
      return new Date(value);
    }
    if (typeof value === 'string' && value !== '') {
      let momentDate: Moment = moment(value, parseFormat, true);
      if (momentDate.isValid()) {
        return momentDate.toDate();
      }
    }
    return value;
  }
}
