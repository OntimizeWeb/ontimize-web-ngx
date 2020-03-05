import { ChangeDetectionStrategy, Component, ElementRef, Injector, TemplateRef, ViewChild } from '@angular/core';

import {
  DEFAULT_INPUTS_O_TABLE_CELL_EDITOR,
  DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR,
  OBaseTableCellEditor,
} from '../o-base-table-cell-editor.class';

export const DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_TEXT = [
  ...DEFAULT_INPUTS_O_TABLE_CELL_EDITOR
];

export const DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_TEXT = [
  ...DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR
];

@Component({
  selector: 'o-table-cell-editor-text',
  templateUrl: './o-table-cell-editor-text.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_TEXT,
  outputs: DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_TEXT
})

export class OTableCellEditorTextComponent extends OBaseTableCellEditor {

  public static DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_TEXT = DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_TEXT;
  public static DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_TEXT = DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_TEXT;

  @ViewChild('templateref', { read: TemplateRef, static: false }) public templateref: TemplateRef<any>;
  @ViewChild('input', { static: false }) inputRef: ElementRef;

  constructor(protected injector: Injector) {
    super(injector);
  }


}
