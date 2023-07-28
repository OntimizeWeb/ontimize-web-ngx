import { ChangeDetectionStrategy, Component, Injector, TemplateRef, ViewChild } from '@angular/core';
import { ValidatorFn } from '@angular/forms';

import { InputConverter } from '../../../../../decorators/input-converter';
import { Util } from '../../../../../util/util';
import { OValidators } from '../../../../../validators/o-validators';
import {
  DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_INTEGER,
  DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_INTEGER
} from '../integer/o-table-cell-editor-integer.component';
import { OBaseTableCellEditor } from '../o-base-table-cell-editor.class';

export const DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_REAL = [
  ...DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_INTEGER
];

export const DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_REAL = [
  ...DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_INTEGER
];

@Component({
  selector: 'o-table-cell-editor-real',
  templateUrl: './o-table-cell-editor-real.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_REAL,
  outputs: DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_REAL
})

export class OTableCellEditorRealComponent extends OBaseTableCellEditor {

  @ViewChild('templateref', { read: TemplateRef, static: true }) public templateref: TemplateRef<any>;

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
    const cellData = super.getCellData();
    const floatValue = parseFloat(cellData);
    return isNaN(floatValue) ? undefined : floatValue;
  }

  resolveValidators(): ValidatorFn[] {
    const validators: ValidatorFn[] = super.resolveValidators();
    if (Util.isDefined(this.min)) {
      validators.push(OValidators.createMinValidator(this.min));
    }
    if (Util.isDefined(this.max)) {
      validators.push(OValidators.createMaxValidator(this.max));
    }
    return validators;
  }



}
