import { Observable } from 'rxjs';

import { ColumnValueFilterOperator } from '../types/table/o-column-value-filter.type';

export interface FilterEntry {
  attr: string;
  values: any;
  operator?: ColumnValueFilterOperator;
}

export interface FilterMap {
  [key: string]: FilterEntry;
}

export interface FilterState {
  filters: FilterMap;
  quickFilter?: string;
}


export interface IFilterManagerService {
  getFilters$(id: string): Observable<FilterState>;
  getFilters(id: string): FilterState;
  setFilters(id: string, filters: FilterEntry[], quickFilter?: string): void;
  updateFilter(id: string, key: string, value: any): void;
  removeFilter(id: string, key: string): void;
  updateQuickFilter(id: string, quickFilter: string): void;
  resetFilters(id: string): void;
  close(id: string): void;
}
