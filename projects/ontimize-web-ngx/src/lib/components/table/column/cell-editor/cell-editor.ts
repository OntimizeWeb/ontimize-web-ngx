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
  ...OTableCellEditorBooleanComponent.INPUTS_ARRAY,
  ...OTableCellEditorDateComponent.INPUTS_ARRAY,
  ...OTableCellEditorRealComponent.INPUTS_ARRAY, // includes Integer
  ...OTableCellEditorTextComponent.INPUTS_ARRAY,
  ...OTableCellEditorTimeComponent.INPUTS_ARRAY,
];

export const O_TABLE_CELL_EDITORS_OUTPUTS = [
  ...OTableCellEditorTextComponent.OUTPUTS_ARRAY
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
