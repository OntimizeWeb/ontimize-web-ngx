import { Component, Injector, ViewChild, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, ValidatorFn } from '@angular/forms';

import { InputConverter } from '../../../../../decorators/input-converter';
import { OBaseTableCellEditor } from '../o-base-table-cell-editor.class';

const INPUTS_ARRAY = [
  ...OBaseTableCellEditor.INPUTS_ARRAY,
  'min',
  'max',
  'step'
];

const OUTPUTS_ARRAY = [
  ...OBaseTableCellEditor.OUTPUTS_ARRAY
];

@Component({
  selector: 'o-table-cell-editor-integer',
  templateUrl: './o-table-cell-editor-integer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: INPUTS_ARRAY,
  outputs: OUTPUTS_ARRAY
})

export class OTableCellEditorIntegerComponent extends OBaseTableCellEditor {

  public static INPUTS_ARRAY = INPUTS_ARRAY;
  public static OUTPUTS_ARRAY = OUTPUTS_ARRAY;

  @ViewChild('templateref', { read: TemplateRef, static: false }) public templateref: TemplateRef<any>;

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
    const cellData = super.getCellData();
    const intValue = parseInt(cellData, 10);
    return isNaN(intValue) ? undefined : intValue;
  }

  resolveValidators(): ValidatorFn[] {
    const validators: ValidatorFn[] = super.resolveValidators();
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
        min: {
          requiredMin: this.min
        }
      };
    }
    return {};
  }

  protected maxValidator(control: FormControl) {
    if ((typeof (control.value) === 'number') && (this.max < control.value)) {
      return {
        max: {
          requiredMax: this.max
        }
      };
    }
    return {};
  }
}
