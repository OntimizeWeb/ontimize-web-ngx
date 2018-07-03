export * from './export/o-table-export-dialog.component';
export * from './store-filter/o-table-store-filter-dialog.component';
export * from './visible-columns/o-table-visible-columns-dialog.component';
export * from './filter-by-column/o-table-filter-by-column-data-dialog.component';

import { OTableExportDialogComponent } from './export/o-table-export-dialog.component';
import { OTableStoreFilterDialogComponent } from './store-filter/o-table-store-filter-dialog.component';
import { OTableVisibleColumnsDialogComponent } from './visible-columns/o-table-visible-columns-dialog.component';
import { OTableFilterByColumnDataDialogComponent } from './filter-by-column/o-table-filter-by-column-data-dialog.component';

export const O_TABLE_DIALOGS = [
  OTableExportDialogComponent,
  OTableStoreFilterDialogComponent,
  OTableVisibleColumnsDialogComponent,
  OTableFilterByColumnDataDialogComponent
];
