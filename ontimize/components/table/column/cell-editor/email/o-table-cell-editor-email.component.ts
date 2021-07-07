import { ChangeDetectionStrategy, Component, ElementRef, Injector, TemplateRef, ViewChild } from '@angular/core';

import { OBaseTableCellEditor } from '../o-base-table-cell-editor.class';

export const DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_EMAIL = [
  ...OBaseTableCellEditor.DEFAULT_INPUTS_O_TABLE_CELL_EDITOR
];

export const DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_EMAIL = [
  ...OBaseTableCellEditor.DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR
];

@Component({
  moduleId: module.id,
  selector: 'o-table-cell-editor-email',
  templateUrl: './o-table-cell-editor-email.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_EMAIL,
  outputs: DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_EMAIL
})

export class OTableCellEditorEmailComponent extends OBaseTableCellEditor {

  public static DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_EMAIL = DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_EMAIL;
  public static DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_EMAIL = DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_EMAIL;

  @ViewChild('templateref', { read: TemplateRef }) public templateref: TemplateRef<any>;
  @ViewChild('input') inputRef: ElementRef;

  constructor(protected injector: Injector) {
    super(injector);
  }


}
