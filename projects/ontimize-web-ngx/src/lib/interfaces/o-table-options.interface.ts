import type { OColumn } from '../components/table/column/o-column.class';

export interface OTableOptions {
  selectColumn: OColumn;
  expandableColumn: OColumn;
  columns: OColumn[];
  visibleColumns: any[];
  filter: boolean;
  filterCaseSensitive: boolean;
  columnsInsertables: string[];
}
