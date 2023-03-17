import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { Moment } from 'moment';

export type DateCustomClassFunction = (date: Moment) => MatCalendarCellCssClasses;
