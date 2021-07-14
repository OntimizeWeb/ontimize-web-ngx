import { ChangeDetectionStrategy, Component, Injector, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';

import {
  DEFAULT_INPUTS_O_TABLE_CELL_EDITOR,
  DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR,
  OBaseTableCellEditor
} from '../o-base-table-cell-editor.class';

export const DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_EMAIL = [
  ...DEFAULT_INPUTS_O_TABLE_CELL_EDITOR
];

export const DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_EMAIL = [
  ...DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR
];

@Component({
  selector: 'o-table-cell-editor-email',
  templateUrl: './o-table-cell-editor-email.component.html',
  styleUrls: ['./o-table-cell-editor-email.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_EMAIL,
  outputs: DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_EMAIL,
  encapsulation: ViewEncapsulation.None
})

export class OTableCellEditorEmailComponent extends OBaseTableCellEditor {

  @ViewChild('templateref', { read: TemplateRef, static: true }) public templateref: TemplateRef<any>;

  constructor(protected injector: Injector) {
    super(injector);
  }


}
