import { ChangeDetectionStrategy, Component, Injector, TemplateRef, ViewChild } from '@angular/core';
import { ValidatorFn } from '@angular/forms';

import { InputConverter } from '../../../../../decorators/input-converter';
import { Util } from '../../../../../util/util';
import { OValidators } from '../../../../../validators/o-validators';
import { OTableCellEditorIntegerComponent } from '../integer/o-table-cell-editor-integer.component';

@Component({
  selector: 'o-table-cell-editor-real',
  templateUrl: './o-table-cell-editor-real.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class OTableCellEditorRealComponent extends OTableCellEditorIntegerComponent {

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
    const floatValue = parseFloat(cellData.toString());
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
