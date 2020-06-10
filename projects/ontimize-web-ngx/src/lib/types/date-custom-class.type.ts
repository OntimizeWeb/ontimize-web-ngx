import { MatCalendarCellCssClasses } from '@angular/material';
import { Moment } from 'moment';

export type DateCustomClassFunction = (date: Moment) => MatCalendarCellCssClasses;
