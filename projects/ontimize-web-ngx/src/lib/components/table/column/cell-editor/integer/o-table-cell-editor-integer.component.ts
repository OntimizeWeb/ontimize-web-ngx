import { ChangeDetectionStrategy, Component, Injector, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, ValidatorFn } from '@angular/forms';

import { InputConverter } from '../../../../../decorators/input-converter';
import {
  OBaseTableCellEditor,
} from '../o-base-table-cell-editor.class';

export const DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_INTEGER = [
  'min',
  'max',
  'step'
];

@Component({
  selector: 'o-table-cell-editor-integer',
  templateUrl: './o-table-cell-editor-integer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_INTEGER
})

export class OTableCellEditorIntegerComponent extends OBaseTableCellEditor {

  @ViewChild('templateref', { read: TemplateRef, static: true }) public templateref: TemplateRef<any>;

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
