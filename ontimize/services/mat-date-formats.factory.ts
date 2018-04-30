import { Injector } from '@angular/core';
import { MatDateFormats } from '@angular/material';

export let MOMENT_DATE_DEFAULT_FORMATS: MatDateFormats = {
  parse: { dateInput: 'L' },
  display: { dateInput: 'L', monthYearLabel: 'Y', dateA11yLabel: 'LL', monthYearA11yLabel: 'MMMM Y' }
};

export class MomentDateFormats {
  constructor(protected formats?: MatDateFormats) {
  }
  getFormats(): MatDateFormats {
    return this.formats;
  }
}

export class MatDateFormatsFactory {
  defaultFormats: MatDateFormats = MOMENT_DATE_DEFAULT_FORMATS;
  constructor(protected injector: Injector) {
  }
  public factory(): any {
    return new MomentDateFormats(this.defaultFormats).getFormats();
  }
}

export function matDateFormatsFactory(injector: Injector) {
  return new MatDateFormatsFactory(injector).factory();
}
