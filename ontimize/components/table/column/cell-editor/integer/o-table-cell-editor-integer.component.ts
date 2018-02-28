import { Component, Injector, ViewChild, TemplateRef } from '@angular/core';
import { InputConverter } from '../../../../../decorators';
import { OBaseTableCellEditor } from '../o-base-table-cell-editor.class';

export const DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_INTEGER = [
  ...OBaseTableCellEditor.DEFAULT_INPUTS_O_TABLE_CELL_EDITOR,
  'min',
  'max',
  'step'
  // ,
  // 'grouping',
  // 'thousandSeparator : thousand-separator',
  // 'olocale : locale'
];

export const DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_INTEGER = [
  ...OBaseTableCellEditor.DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR
];

@Component({
  selector: 'o-table-cell-editor-integer',
  templateUrl: './o-table-cell-editor-integer.component.html',
  inputs: DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_INTEGER,
  outputs: DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_INTEGER
})

export class OTableCellEditorIntegerComponent extends OBaseTableCellEditor {

  public static DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_INTEGER = DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_INTEGER;
  public static DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_INTEGER = DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_INTEGER;

  @ViewChild('templateref', { read: TemplateRef }) public templateref: TemplateRef<any>;

  @InputConverter()
  min: number;
  @InputConverter()
  max: number;
  @InputConverter()
  step: number;
  // @InputConverter()
  // protected grouping: boolean = false;
  // protected thousandSeparator: string;
  // protected olocale: string;

  constructor(protected injector: Injector) {
    super(injector);
    this.initialize();
  }


}
