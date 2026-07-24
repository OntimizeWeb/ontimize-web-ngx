import { MatDateFormats } from '@angular/material/core';

export class OntimizeMatLuxonDateFormats {

  protected DEFAULT_DATE_FORMATS: MatDateFormats = {
    parse: { dateInput: 'D' },
    display: { dateInput: 'D', monthYearLabel: 'yyyy', dateA11yLabel: 'DD', monthYearA11yLabel: 'MMMM yyyy' }
  };

  public factory(): any {
    return this.DEFAULT_DATE_FORMATS;
  }
}

export function luxonDateFormatFactory() {
  return new OntimizeMatLuxonDateFormats().factory();
}
