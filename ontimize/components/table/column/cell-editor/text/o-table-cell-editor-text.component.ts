import { Component, Injector, ViewChild, TemplateRef } from '@angular/core';
import { OBaseTableCellEditor } from '../o-base-table-cell-editor.class';

export const DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_TEXT = [
  ...OBaseTableCellEditor.DEFAULT_INPUTS_O_TABLE_CELL_EDITOR
];

export const DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_TEXT = [
  ...OBaseTableCellEditor.DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR
];

@Component({
  selector: 'o-table-cell-editor-text',
  templateUrl: './o-table-cell-editor-text.component.html',
  inputs: DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_TEXT,
  outputs: DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_TEXT
})

export class OTableCellEditorTextComponent extends OBaseTableCellEditor {

  public static DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_TEXT = DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_TEXT;
  public static DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_TEXT = DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_TEXT;

  @ViewChild('templateref', { read: TemplateRef }) public templateref: TemplateRef<any>;

  constructor(protected injector: Injector) {
    super(injector);
    this.initialize();
  }

  innerOnBlur(event: any) {
    super.onBlur(event);

  }
}
