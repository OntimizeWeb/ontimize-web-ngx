import { Component, Injector, ViewChild, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, ValidatorFn } from '@angular/forms';

import { InputConverter } from '../../../../../decorators';
import { OBaseTableCellEditor } from '../o-base-table-cell-editor.class';

export const DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_INTEGER = [
  ...OBaseTableCellEditor.DEFAULT_INPUTS_O_TABLE_CELL_EDITOR,
  'min',
  'max',
  'step'
];

export const DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_INTEGER = [
  ...OBaseTableCellEditor.DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR
];

@Component({
  moduleId: module.id,
  selector: 'o-table-cell-editor-integer',
  templateUrl: './o-table-cell-editor-integer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  step: number = 1;

  constructor(protected injector: Injector) {
    super(injector);
  }

  getCellData() {
    let cellData = super.getCellData();
    let intValue = parseInt(cellData);
    return isNaN(intValue) ? undefined : intValue;
  }

  resolveValidators(): ValidatorFn[] {
    let validators: ValidatorFn[] = super.resolveValidators();
    if (typeof (this.min) !== 'undefined') {
      validators.push(this.minValidator.bind(this));
    }
    if (typeof (this.max) !== 'undefined') {
      validators.push(this.maxValidator.bind(this));
    }
    return validators;
  }

  protected minValidator(control: FormControl) {
    if ((typeof (control.value) === 'number') && (control.value < this.min)) {
      return {
        'min': {
          'requiredMin': this.min
        }
      };
    }
    return {};
  }

  protected maxValidator(control: FormControl) {
    if ((typeof (control.value) === 'number') && (this.max < control.value)) {
      return {
        'max': {
          'requiredMax': this.max
        }
      };
    }
    return {};
  }
}
