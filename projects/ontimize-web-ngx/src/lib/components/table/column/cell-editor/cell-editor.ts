import {
  OTableCellEditorBooleanComponent
} from './boolean/o-table-cell-editor-boolean.component';
import {
  OTableCellEditorDateComponent
} from './date/o-table-cell-editor-date.component';
import {
  OTableCellEditorEmailComponent
} from './email/o-table-cell-editor-email.component';
import { OTableCellEditorIntegerComponent } from './integer/o-table-cell-editor-integer.component';
import {
  OTableCellEditorRealComponent
} from './real/o-table-cell-editor-real.component';
import {
  OTableCellEditorTextComponent
} from './text/o-table-cell-editor-text.component';
import {
  OTableCellEditorTimeComponent
} from './time/o-table-cell-editor-time.component';

export { O_TABLE_CELL_EDITORS_INPUTS, O_TABLE_CELL_EDITORS_OUTPUTS } from './cell-editor-inputs';

export const O_TABLE_CELL_EDITORS = [
  OTableCellEditorBooleanComponent,
  OTableCellEditorDateComponent,
  OTableCellEditorIntegerComponent,
  OTableCellEditorRealComponent,
  OTableCellEditorTextComponent,
  OTableCellEditorEmailComponent,
  OTableCellEditorTimeComponent
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
