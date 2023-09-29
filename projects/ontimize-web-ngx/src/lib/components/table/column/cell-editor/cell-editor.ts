import {
  OTableCellEditorBooleanComponent
} from './boolean/o-table-cell-editor-boolean.component';
import {
  DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_DATE,
  OTableCellEditorDateComponent
} from './date/o-table-cell-editor-date.component';
import {
  OTableCellEditorEmailComponent
} from './email/o-table-cell-editor-email.component';
import { DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_INTEGER, OTableCellEditorIntegerComponent } from './integer/o-table-cell-editor-integer.component';
import { DEFAULT_INPUTS_O_TABLE_CELL_EDITOR, DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR } from './o-base-table-cell-editor.class';
import {
  OTableCellEditorRealComponent
} from './real/o-table-cell-editor-real.component';
import {
  OTableCellEditorTextComponent
} from './text/o-table-cell-editor-text.component';
import {
  DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_TIME,
  OTableCellEditorTimeComponent
} from './time/o-table-cell-editor-time.component';

export const O_TABLE_CELL_EDITORS = [
  OTableCellEditorBooleanComponent,
  OTableCellEditorDateComponent,
  OTableCellEditorIntegerComponent,
  OTableCellEditorRealComponent,
  OTableCellEditorTextComponent,
  OTableCellEditorEmailComponent,
  OTableCellEditorTimeComponent
];

export const O_TABLE_CELL_EDITORS_INPUTS = [
  ...DEFAULT_INPUTS_O_TABLE_CELL_EDITOR,
  ...DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_INTEGER,
  ...DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_DATE,
  ...DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_TIME
];

export const O_TABLE_CELL_EDITORS_OUTPUTS = [
  ...DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR
];

export const editorsMapping = {
  boolean: OTableCellEditorBooleanComponent,
  date: OTableCellEditorDateComponent,
  integer: OTableCellEditorIntegerComponent,
  real: OTableCellEditorRealComponent,
  percentage: OTableCellEditorRealComponent,
  currency: OTableCellEditorRealComponent,
  text: OTableCellEditorTextComponent,
  email: OTableCellEditorEmailComponent,
  time: OTableCellEditorTimeComponent
};
