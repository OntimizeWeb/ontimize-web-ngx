import { Component, Injector, ViewChild, TemplateRef, ViewEncapsulation } from '@angular/core';
import { MdCheckboxChange } from '@angular/material';
import { Util } from '../../../../../utils';
import { InputConverter } from '../../../../../decorators';
import { OBaseTableCellEditor } from '../o-base-table-cell-editor.class';

export const DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_BOOLEAN = [
  ...OBaseTableCellEditor.DEFAULT_INPUTS_O_TABLE_CELL_EDITOR,
  'indeterminateOnNull: indeterminate-on-null',
  // true-value: true value. Default: true.
  'trueValue: true-value',
  // false-value: false value. Default: false.
  'falseValue: false-value',
  // false-value [number|boolean|string]: cellData value type. Default: boolean
  'booleanType: boolean-type'
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
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-table-cell-editor-boolean]': 'true'
  }
})

export class OTableCellEditorBooleanComponent extends OBaseTableCellEditor {

  public static DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_BOOLEAN = DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_BOOLEAN;
  public static DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_BOOLEAN = DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_BOOLEAN;

  @ViewChild('templateref', { read: TemplateRef }) public templateref: TemplateRef<any>;

  indeterminate: boolean = false;

  @InputConverter()
  indeterminateOnNull: boolean = false;
  trueValue: any = true;
  falseValue: any = false;
  booleanType: string = 'boolean';

  constructor(protected injector: Injector) {
    super(injector);
    this.initialize();
  }

  getCellData() {
    let cellData = super.getCellData();
    this.indeterminate = this.indeterminateOnNull && (cellData === undefined);
    if (!this.indeterminate) {
      cellData = this.parseValueByType(cellData);
    }
    return cellData;
  }

  protected parseValueByType(val: any): any {
    let result = val;
    switch (this.booleanType) {
      case 'string':
        result = Util.parseBoolean(val, false);
        break;
      case 'number':
        result = (val === 1);
        break;
      case 'boolean':
      default:
        // boolean comparision as default value of dataType
        result = (val === true);
        break;
    }
    return result;
  }

  onChange(arg: MdCheckboxChange) {
    this.formControl.setValue(arg.checked ? this.trueValue : this.falseValue, { emitEvent: false });
    this.commitEdition();
  }
}
