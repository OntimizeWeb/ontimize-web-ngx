export * from './boolean/o-table-cell-editor-boolean.component';
export * from './date/o-table-cell-editor-date.component';
export * from './integer/o-table-cell-editor-integer.component';
export * from './real/o-table-cell-editor-real.component';
export * from './text/o-table-cell-editor-text.component';

export * from './o-base-table-cell-editor.class';
export * from './time/o-table-cell-editor-time.component';

import { OTableCellEditorBooleanComponent } from './boolean/o-table-cell-editor-boolean.component';
import { OTableCellEditorDateComponent } from './date/o-table-cell-editor-date.component';
import { OTableCellEditorIntegerComponent } from './integer/o-table-cell-editor-integer.component';
import { OTableCellEditorRealComponent } from './real/o-table-cell-editor-real.component';
import { OTableCellEditorTextComponent } from './text/o-table-cell-editor-text.component';
import { OTableCellEditorTimeComponent } from './time/o-table-cell-editor-time.component';

export const O_TABLE_CELL_EDITORS = [
  OTableCellEditorBooleanComponent,
  OTableCellEditorDateComponent,
  OTableCellEditorIntegerComponent,
  OTableCellEditorRealComponent,
  OTableCellEditorTextComponent,
  OTableCellEditorTimeComponent
];
