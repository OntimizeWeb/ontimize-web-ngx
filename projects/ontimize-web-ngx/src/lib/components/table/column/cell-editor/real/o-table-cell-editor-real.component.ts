import { ChangeDetectionStrategy, Component, Injector, TemplateRef, ViewChild } from '@angular/core';
import { ValidatorFn, Validators } from '@angular/forms';

import { NumberInputConverter } from '../../../../../decorators/input-converter';
import { Util } from '../../../../../util/util';
import { OTableCellEditorIntegerComponent } from '../integer/o-table-cell-editor-integer.component';

@Component({
  selector: 'o-table-cell-editor-real',
  templateUrl: './o-table-cell-editor-real.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class OTableCellEditorRealComponent extends OTableCellEditorIntegerComponent {

  @ViewChild('templateref', { read: TemplateRef, static: true }) public templateref: TemplateRef<any>;

  @NumberInputConverter()
  min: number;
  @NumberInputConverter()
  max: number;
  @NumberInputConverter()
  step: number = 0.01;

  constructor(protected injector: Injector) {
    super(injector);
  }

  getCellData() {
    const cellData = super.getCellData();
    const floatValue = parseFloat(cellData?.toString());
    return isNaN(floatValue) ? undefined : floatValue;
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
