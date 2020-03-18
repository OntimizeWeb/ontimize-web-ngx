import { EventEmitter } from '@angular/core';

import { OColumn } from '../components/table/column/o-column.class';
import { OColumnValueFilter } from '../types/o-column-value-filter.type';

export interface OTableDataSource {

  onRenderedDataChange: EventEmitter<any>;
  renderedData: any[];
  resultsLength: number;
  sqlTypes: any;
  data: any[];
  loadDataScrollable: number;
  quickFilter: string;

  getColumnData: (column: string) => any;
  getColumnValueFilters: () => OColumnValueFilter[];
  getColumnValueFilterByAttr: (attr: string) => OColumnValueFilter;
  getCurrentData: () => any[];
  getCurrentAllData: () => any[];
  getRenderedData: (data: any[]) => any[];
  getAllRendererData: () => any[];
  getCurrentRendererData: () => any[];
  getTableData: () => any[];
  addColumnFilter: (filter: OColumnValueFilter) => void;
  initializeColumnsFilters: (filters: OColumnValueFilter[]) => void;
  clearColumnFilters: (trigger?: boolean) => void;
  isColumnValueFilterActive: () => boolean;
  updateRenderedRowData: (rowData: any) => void;
  getAggregateData: (column: OColumn) => any;
}
