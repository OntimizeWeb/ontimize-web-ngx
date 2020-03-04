import { OColumn } from './o-column.interface';

export interface OTableOptions {
  selectColumn: OColumn;
  columns: OColumn[];
  visibleColumns: any[];
  filter: boolean;
  filterCaseSensitive: boolean;
  columnsInsertables: string[];
}
