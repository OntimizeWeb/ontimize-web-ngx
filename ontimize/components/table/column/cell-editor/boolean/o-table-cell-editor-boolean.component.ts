import { Component, Injector, ViewChild, TemplateRef, ViewEncapsulation } from '@angular/core';
import { MatCheckboxChange } from '@angular/material';
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
  moduleId: module.id,
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
  }

  getCellData() {
    let cellData = super.getCellData();
    this.indeterminate = this.indeterminateOnNull && !Util.isDefined(cellData);
    if (!this.indeterminate) {
      cellData = this.parseValueByType(cellData);
    }
    return cellData;
  }

  private OTCEBC_parseValueFromString(val: string): boolean {
    return Util.parseBoolean(val, false);
  }

  private OTCEBC_parseValueFromNumber(val: string | number): number {
    const value = typeof val === 'number' ? val : parseInt(val);
    return (value === 1) ? 1 : 0;
  }

  private OTCEBC_parseValueFromBoolean(val: any): boolean {
    return (val === true);
  }

  protected parseValueByType(val: any): boolean | number {
    let result;
    // check if booleanType exists or the switch will break
    if (!this.booleanType) {
      result = this.OTCEBC_parseValueFromBoolean(val);
    }
    switch (this.booleanType) {
      case 'string':
        result = this.OTCEBC_parseValueFromString(val);
        break;
      case 'number':
        result = this.OTCEBC_parseValueFromNumber(val);
        break;
      case 'boolean':
      default:
        // boolean comparision as default value of dataType
        result = this.OTCEBC_parseValueFromBoolean(val);
        break;
    }
    return result;
  }

  onChange(arg: MatCheckboxChange) {
    this.formControl.setValue(arg.checked ? this.trueValue : this.falseValue, { emitEvent: false });
    this.commitEdition();
  }
}
