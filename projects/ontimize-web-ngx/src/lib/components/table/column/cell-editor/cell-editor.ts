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

export const O_TABLE_CELL_EDITORS_INPUTS = [
  ...OTableCellEditorBooleanComponent.DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_BOOLEAN,
  ...OTableCellEditorDateComponent.DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_DATE,
  ...OTableCellEditorRealComponent.DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_REAL, // includes Integer
  ...OTableCellEditorTextComponent.DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_TEXT,
  ...OTableCellEditorTimeComponent.DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_TIME,
];

export const O_TABLE_CELL_EDITORS_OUTPUTS = [
  ...OTableCellEditorTextComponent.DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_TEXT
];

export const editorsMapping = {
  boolean: OTableCellEditorBooleanComponent,
  date: OTableCellEditorDateComponent,
  integer: OTableCellEditorIntegerComponent,
  real: OTableCellEditorRealComponent,
  percentage: OTableCellEditorRealComponent,
  currency: OTableCellEditorRealComponent,
  text: OTableCellEditorTextComponent,
  time: OTableCellEditorTimeComponent
};
