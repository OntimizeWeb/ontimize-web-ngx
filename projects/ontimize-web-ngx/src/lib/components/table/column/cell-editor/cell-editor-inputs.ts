import {
  DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_DATE
} from './date/o-table-cell-editor-date.component';
import { DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_INTEGER } from './integer/o-table-cell-editor-integer.component';
import { DEFAULT_INPUTS_O_TABLE_CELL_EDITOR, DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR } from './o-base-table-cell-editor.class';
import {
  DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_TIME
} from './time/o-table-cell-editor-time.component';

export const O_TABLE_CELL_EDITORS_INPUTS = [
  ...DEFAULT_INPUTS_O_TABLE_CELL_EDITOR,
  ...DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_INTEGER,
  ...DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_DATE,
  ...DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_TIME
];

export const O_TABLE_CELL_EDITORS_OUTPUTS = [
  ...DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR
];
