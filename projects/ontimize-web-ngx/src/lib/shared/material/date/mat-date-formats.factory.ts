import { MatDateFormats } from '@angular/material/core';

/**
 * @deprecated Use OntimizeMatLuxonDateFormats / luxonDateFormatFactory instead.
 * Kept for consumers still using the moment-based OntimizeMomentDateAdapter.
 */
export class OntimizeMatDateFormats {

  protected DEFAULT_DATE_FORMATS: MatDateFormats = {
    parse: { dateInput: 'L' },
    display: { dateInput: 'L', monthYearLabel: 'Y', dateA11yLabel: 'LL', monthYearA11yLabel: 'MMMM Y' }
  };

  public factory(): any {
    return this.DEFAULT_DATE_FORMATS;
  }
}

export function dateFormatFactory() {
  return new OntimizeMatDateFormats().factory();
}
