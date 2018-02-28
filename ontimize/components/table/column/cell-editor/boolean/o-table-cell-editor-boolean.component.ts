import { Component, Injector, ViewChild, TemplateRef, ViewEncapsulation } from '@angular/core';
import { Util } from '../../../../../utils';
import { OBaseTableCellEditor } from '../o-base-table-cell-editor.class';

export const DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_BOOLEAN = [
  ...OBaseTableCellEditor.DEFAULT_INPUTS_O_TABLE_CELL_EDITOR
];

export const DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_BOOLEAN = [
  ...OBaseTableCellEditor.DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR
];

@Component({
  selector: 'o-table-cell-editor-boolean',
  templateUrl: './o-table-cell-editor-boolean.component.html',
  styleUrls: ['./o-table-cell-editor-boolean.component.scss'],
  inputs: DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_BOOLEAN,
  outputs: DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_BOOLEAN,
  encapsulation : ViewEncapsulation.None,
  host: {
    '[class.o-table-cell-editor-boolean]': 'true'
  }
})

export class OTableCellEditorBooleanComponent extends OBaseTableCellEditor {

  public static DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_BOOLEAN = DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_BOOLEAN;
  public static DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_BOOLEAN = DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_BOOLEAN;

  @ViewChild('templateref', { read: TemplateRef }) public templateref: TemplateRef<any>;

  indeterminate: boolean = false;

  constructor(protected injector: Injector) {
    super(injector);
    this.initialize();
  }

  getCellData() {
    let cellData = super.getCellData();
    this.indeterminate = (cellData === undefined);
    if (!this.indeterminate) {
      cellData = Util.parseBoolean(cellData, false);
    }
    return cellData;
  }

  onChangeCheckbox() {
    const self = this;
    setTimeout(() => {
      self.commitEdition();
    }, 750);
  }
}
