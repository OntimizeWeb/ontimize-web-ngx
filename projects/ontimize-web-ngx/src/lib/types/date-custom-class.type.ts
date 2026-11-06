import { MatCalendarCellCssClasses } from '@angular/material/datepicker';

/**
 * Callback used by the `date-class` input of `o-date-input` / `o-daterange-input`.
 *
 * The `date` argument is the calendar object handled by the active `DateAdapter`:
 * a luxon `DateTime` with the default `OntimizeLuxonDateAdapter`, or a `Moment`
 * when the deprecated `OntimizeMomentDateAdapter` is provided explicitly. It is
 * typed as `any` so callbacks written against either library remain assignable;
 * annotate your own function's parameter to get strict typing.
 */
export type DateCustomClassFunction = (date: any) => MatCalendarCellCssClasses;
