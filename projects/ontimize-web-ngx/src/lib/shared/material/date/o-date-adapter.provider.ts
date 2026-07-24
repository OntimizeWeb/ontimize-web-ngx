import { inject, InjectionToken, Optional, PipeTransform, Provider } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats } from '@angular/material/core';

import { OLuxonPipe } from '../../../pipes/o-luxon.pipe';
import { OMomentPipe } from '../../../pipes/o-moment.pipe';
import { ODateValueType } from '../../../types/o-date-value.type';
import { dateFormatFactory } from './mat-date-formats.factory';
import { luxonDateFormatFactory } from './mat-luxon-date-formats.factory';
import { OntimizeLuxonDateAdapter } from './ontimize-luxon-date-adapter';
import { OntimizeMomentDateAdapter } from './ontimize-moment-date-adapter';

/**
 * Date adapter used by the framework's date components (`o-date-input`,
 * `o-daterange-input`, table date/time cell editors and renderers, the
 * filter-by-column dialog, `o-time-input`). `luxon` is the default.
 */
export type ODateAdapterType = 'luxon' | 'moment';

/**
 * Injection token that selects the date adapter. Not provided → `luxon`.
 *
 * Provide it app-wide (`provideODateAdapter('moment')` in `bootstrapApplication`
 * providers / `AppModule` providers) or scoped (a route's `providers`, or the
 * `providers` of any ancestor component) — every Ontimize date component below
 * that injector resolves its `DateAdapter` / `MAT_DATE_FORMATS` from it.
 *
 * Note: `format`-like inputs are interpreted by the active adapter, so their
 * tokens must match it (moment `'L'`/`'DD/MM/YYYY'` vs Luxon `'D'`/`'dd/MM/yyyy'`).
 */
export const O_DATE_ADAPTER = new InjectionToken<ODateAdapterType>('o-date-adapter');

/** Convenience provider: `providers: [provideODateAdapter('moment')]`. */
export function provideODateAdapter(adapter: ODateAdapterType): Provider {
  return { provide: O_DATE_ADAPTER, useValue: adapter };
}

export function ontimizeDateAdapterFactory(adapterType: ODateAdapterType | null, dateLocale: string): DateAdapter<any> {
  return adapterType === 'moment' ? new OntimizeMomentDateAdapter(dateLocale) : new OntimizeLuxonDateAdapter(dateLocale);
}

export function ontimizeDateFormatsFactory(adapterType: ODateAdapterType | null): MatDateFormats {
  return adapterType === 'moment' ? dateFormatFactory() : luxonDateFormatFactory();
}

/**
 * `DateAdapter` + `MAT_DATE_FORMATS` providers resolved from `O_DATE_ADAPTER`.
 * Spread into a component's `providers` so each instance gets its own adapter
 * (required: the adapter instance carries the per-component `oFormat`).
 */
export const O_DATE_ADAPTER_PROVIDERS: Provider[] = [
  { provide: DateAdapter, useFactory: ontimizeDateAdapterFactory, deps: [[new Optional(), O_DATE_ADAPTER], [new Optional(), MAT_DATE_LOCALE]] },
  { provide: MAT_DATE_FORMATS, useFactory: ontimizeDateFormatsFactory, deps: [[new Optional(), O_DATE_ADAPTER]] }
];

/**
 * Injects the date pipe matching the active adapter (`oMoment` or `oLuxon`).
 * Both pipes must be listed in the caller's `providers`. Field-initializer use only.
 */
export function injectODateAdapterPipe(): PipeTransform {
  return inject(O_DATE_ADAPTER, { optional: true }) === 'moment' ? inject(OMomentPipe) : inject(OLuxonPipe);
}

/**
 * Adapter-agnostic equivalent of `Util.parseByValueType` built on the injected
 * `DateAdapter`, so `string` outputs/inputs honour the active adapter's format
 * tokens. Same contract: not-defined values pass through, unparseable ones
 * return `undefined`.
 */
export function parseDateByValueTypeWithAdapter(adapter: DateAdapter<any>, value: any, valueType: ODateValueType, format?: string): any {
  if (value === undefined || value === null) {
    return value;
  }
  let date: any;
  if (adapter.isDateInstance(value)) {
    date = value;
  } else if (value instanceof Date) {
    date = adapter.deserialize(value);
  } else if (typeof value === 'number') {
    date = adapter.deserialize(new Date(value));
  } else if (typeof value === 'string') {
    date = adapter.deserialize(value);
    if (!date || !adapter.isValid(date)) {
      date = adapter.parse(value, format);
    }
    if (!date || !adapter.isValid(date)) {
      // moment fell back to the Date constructor for non-ISO strings
      date = adapter.deserialize(new Date(value));
    }
  } else {
    return void 0;
  }
  if (!date || !adapter.isValid(date)) {
    return void 0;
  }
  switch (valueType) {
    case 'string':
      return adapter.format(date, format);
    case 'date':
      return new Date(date.valueOf());
    case 'iso-8601':
      // UTC so the output carries the 'Z' suffix, as moment's toISOString() did
      return new Date(date.valueOf()).toISOString();
    case 'timestamp':
      return date.valueOf();
    default:
      return void 0;
  }
}
