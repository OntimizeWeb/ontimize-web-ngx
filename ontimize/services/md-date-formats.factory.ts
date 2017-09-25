import { Injector } from '@angular/core';
import { MdDateFormats } from '@angular/material';

export let MOMENT_DATE_DEFAULT_FORMATS: MdDateFormats = {
  parse: { dateInput: 'L' },
  display: { dateInput: 'L', monthYearLabel: 'Y', dateA11yLabel: 'LL', monthYearA11yLabel: 'MMMM Y' }
};

export class MomentDateFormats {
  constructor(protected formats?: MdDateFormats) {
  }
  getFormats(): MdDateFormats {
    return this.formats;
  }
}

export class MdDateFormatsFactory {
  defaultFormats: MdDateFormats = MOMENT_DATE_DEFAULT_FORMATS;
  constructor(protected injector: Injector) {
  }
  public factory(): any {
    return new MomentDateFormats(this.defaultFormats).getFormats();
  }
}

export function mdDateFormatsFactory(injector: Injector) {
  return new MdDateFormatsFactory(injector).factory();
}
