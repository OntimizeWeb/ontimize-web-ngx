import { ChangeDetectionStrategy, Component, Injector, TemplateRef, ViewChild } from '@angular/core';
import { ValidatorFn, Validators } from '@angular/forms';

import { NumberInputConverter } from '../../../../../decorators/input-converter';
import { Util } from '../../../../../util/util';
import { OBaseTableCellEditor } from '../o-base-table-cell-editor.class';

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

  @NumberInputConverter()
  min: number;
  @NumberInputConverter()
  max: number;
  @NumberInputConverter()
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
    if (Util.isDefined(this.min)) {
      validators.push(Validators.min(this.min));
    }
    if (Util.isDefined(this.max)) {
      validators.push(Validators.max(this.max));
    }
    return validators;
  }
}
