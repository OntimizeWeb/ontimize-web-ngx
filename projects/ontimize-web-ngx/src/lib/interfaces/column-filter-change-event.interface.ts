import { OColumnValueFilter } from "../types/table/o-column-value-filter.type";

export interface ColumnFilterChangeEvent {
  action: 'add' | 'update' | 'remove';
  columns?: Array<string>;
  filters?: OColumnValueFilter[];
}