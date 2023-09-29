/*
 *  LocaleConfig Interface
 */
export interface LocaleConfig {
  direction?: string;
  separator?: string;
  weekLabel?: string;
  applyLabel?: string;
  cancelLabel?: string;
  customRangeLabel?: string;
  daysOfWeek?: string[];
  monthNames?: string[];
  firstDay?: number;
  format?: string;
}
