import { MatCalendarCellCssClasses } from '@angular/material';
import moment from 'moment';

export type DateCustomClassFunction = (date: moment.Moment) => MatCalendarCellCssClasses;
