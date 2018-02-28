import { Component, Injector, ViewChild, TemplateRef } from '@angular/core';
import { OTableCellEditorIntegerComponent } from '../integer/o-table-cell-editor-integer.component';

export const DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_REAL = [
  ...OTableCellEditorIntegerComponent.DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_INTEGER
];

export const DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_REAL = [
  ...OTableCellEditorIntegerComponent.DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_INTEGER
];

@Component({
  selector: 'o-table-cell-editor-real',
  templateUrl: './o-table-cell-editor-real.component.html',
  inputs: DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_REAL,
  outputs: DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_REAL
})

export class OTableCellEditorRealComponent extends OTableCellEditorIntegerComponent {

  public static DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_REAL = DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_REAL;
  public static DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_REAL = DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_REAL;

  @ViewChild('templateref', { read: TemplateRef }) public templateref: TemplateRef<any>;

  constructor(protected injector: Injector) {
    super(injector);
    this.initialize();
  }


}
