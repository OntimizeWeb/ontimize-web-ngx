import { Component, Injector, ViewChild, TemplateRef, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { OBaseTableCellEditor } from '../o-base-table-cell-editor.class';

export const DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_TEXT = [
  ...OBaseTableCellEditor.DEFAULT_INPUTS_O_TABLE_CELL_EDITOR
];

export const DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_TEXT = [
  ...OBaseTableCellEditor.DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR
];

@Component({
  moduleId: module.id,
  selector: 'o-table-cell-editor-text',
  templateUrl: './o-table-cell-editor-text.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_TEXT,
  outputs: DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_TEXT
})

export class OTableCellEditorTextComponent extends OBaseTableCellEditor {

  public static DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_TEXT = DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_TEXT;
  public static DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_TEXT = DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_TEXT;

  @ViewChild('templateref', { read: TemplateRef }) public templateref: TemplateRef<any>;
  @ViewChild('input') inputRef: ElementRef;

  constructor(protected injector: Injector) {
    super(injector);
  }


}
