import { ChangeDetectionStrategy, Component, Injector, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormControl, ValidatorFn } from '@angular/forms';

import { InputConverter } from '../../../../../decorators/input-converter';
import {
  OTableCellEditorIntegerComponent,
} from '../integer/o-table-cell-editor-integer.component';

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
    if (typeof (this.min) !== 'undefined') {
      validators.push(this.minValidator.bind(this));
    }
    if (typeof (this.max) !== 'undefined') {
      validators.push(this.maxValidator.bind(this));
    }
    return validators;
  }

  protected minValidator(control: UntypedFormControl) {
    if ((typeof (control.value) === 'number') && (control.value < this.min)) {
      return {
        min: {
          requiredMin: this.min
        }
      };
    }
    return {};
  }

  protected maxValidator(control: UntypedFormControl) {
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
