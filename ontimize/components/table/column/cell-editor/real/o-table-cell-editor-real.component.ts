import { Component, Injector, ViewChild, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { ValidatorFn, FormControl } from '@angular/forms';
import { InputConverter } from '../../../../../decorators';
import { OTableCellEditorIntegerComponent } from '../integer/o-table-cell-editor-integer.component';
import { OBaseTableCellEditor } from '../o-base-table-cell-editor.class';

export const DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_REAL = [
  ...OTableCellEditorIntegerComponent.DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_INTEGER
];

export const DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_REAL = [
  ...OTableCellEditorIntegerComponent.DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_INTEGER
];

@Component({
  moduleId: module.id,
  selector: 'o-table-cell-editor-real',
  templateUrl: './o-table-cell-editor-real.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_REAL,
  outputs: DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_REAL
})

export class OTableCellEditorRealComponent extends OBaseTableCellEditor {

  public static DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_REAL = DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_REAL;
  public static DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_REAL = DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_REAL;

  @ViewChild('templateref', { read: TemplateRef }) public templateref: TemplateRef<any>;

  @InputConverter()
  min: number;
  @InputConverter()
  max: number;
  @InputConverter()
  step: number = 0.01;

  constructor(protected injector: Injector) {
    super(injector);
  }

  getCellData() {
    let cellData = super.getCellData();
    let floatValue = parseFloat(cellData);
    return isNaN(floatValue) ? undefined : floatValue;
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
