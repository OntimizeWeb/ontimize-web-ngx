export * from './table-button/o-table-button.component';
export * from './table-columns-filter/o-table-columns-filter.component';
export * from './table-option/o-table-option.component';
export * from './table-insertable-row/o-table-insertable-row.component';
export * from './table-insertable-row/o-table-editable-row/o-table-editable-row.component';
// export * from './table-quick-filter/o-table-quick-filter.component';


import { OTableButtonComponent } from './table-button/o-table-button.component';
import { OTableColumnsFilterComponent } from './table-columns-filter/o-table-columns-filter.component';
import { OTableOptionComponent } from './table-option/o-table-option.component';
import { OTableInsertableRowComponent } from './table-insertable-row/o-table-insertable-row.component';
import { OTableEditableRowComponent } from './table-insertable-row/o-table-editable-row/o-table-editable-row.component';

export const O_TABLE_HEADER_COMPONENTS = [
  OTableButtonComponent,
  OTableColumnsFilterComponent,
  OTableOptionComponent,
  OTableInsertableRowComponent,
  OTableEditableRowComponent
];
