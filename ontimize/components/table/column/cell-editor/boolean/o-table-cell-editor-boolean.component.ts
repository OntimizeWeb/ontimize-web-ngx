import { ChangeDetectionStrategy, Component, Injector, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';

import { InputConverter } from '../../../../../decorators';
import { MatCheckboxChange } from '@angular/material';
import { OBaseTableCellEditor } from '../o-base-table-cell-editor.class';
import { Util } from '../../../../../utils';

export const DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_BOOLEAN = [
  ...OBaseTableCellEditor.DEFAULT_INPUTS_O_TABLE_CELL_EDITOR,
  'indeterminateOnNull: indeterminate-on-null',
  // true-value: true value. Default: true.
  'trueValue: true-value',
  // false-value: false value. Default: false.
  'falseValue: false-value',
  // boolean-type [number|boolean|string]: cellData value type. Default: boolean
  'booleanType: boolean-type',
  'autoCommit: auto-commit'
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  trueValue: any;
  falseValue: any;

  booleanType: string = 'boolean';

  @InputConverter()
  autoCommit: boolean = true;

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    super.ngOnInit();
    this.parseInputs();
  }

  protected parseInputs() {
    switch (this.booleanType) {
      case 'string':
        this.parseStringInputs();
        break;
      case 'number':
        this.parseNumberInputs();
        break;
      default:
        this.trueValue = true;
        this.falseValue = false;
        break;
    }
  }

  protected parseStringInputs() {
    if ((this.trueValue || '').length === 0) {
      this.trueValue = undefined;
    }
    if ((this.falseValue || '').length === 0) {
      this.falseValue = undefined;
    }
  }

  protected parseNumberInputs() {
    this.trueValue = parseInt(this.trueValue);
    if (isNaN(this.trueValue)) {
      this.trueValue = 1;
    }
    this.falseValue = parseInt(this.falseValue);
    if (isNaN(this.falseValue)) {
      this.falseValue = 0;
    }
  }

  startEdition(data: any) {
    super.startEdition(data);
    const self = this;
    setTimeout(() => {
      // using setTimeout to forcing this code execution after super.activateColumnEdition column.editing = true line
      if (self.autoCommit) {
        const isTrue = (self.formControl.value === self.trueValue);
        self.formControl.setValue(isTrue ? self.falseValue : self.trueValue, { emitEvent: false });
        self.commitEdition();
      } else {
        const isTrue = (self.formControl.value === self.trueValue);
        self.formControl.setValue(isTrue ? self.trueValue : self.falseValue, { emitEvent: false });
      }
    }, 0);
  }

  getCellData() {
    let cellData = super.getCellData();
    this.indeterminate = this.indeterminateOnNull && !Util.isDefined(cellData);
    if (!this.indeterminate) {
      cellData = this.parseValueByType(cellData);
    }
    return cellData;
  }

  hasCellDataTrueValue(cellData: any): boolean {
    let result: boolean = undefined;
    if (Util.isDefined(cellData)) {
      result = (cellData === this.trueValue);
      if (this.booleanType === 'string' && !Util.isDefined(this.trueValue)) {
        result = Util.parseBoolean(cellData, false);
      }
    }
    return result;
  }

  protected parseValueByType(val: any): any {
    let result = val;
    const cellIsTrue = this.hasCellDataTrueValue(val);
    let value = cellIsTrue ? this.trueValue : this.falseValue;
    switch (this.booleanType) {
      case 'string':
        result = this.translateService.get(value);
        break;
      case 'number':
        result = parseInt(value);
        break;
      default:
        break;
    }
    return result;
  }

  onChange(arg: MatCheckboxChange) {
    this.formControl.setValue(arg.checked ? this.trueValue : this.falseValue, { emitEvent: false });
    this.commitEdition();
  }
}
