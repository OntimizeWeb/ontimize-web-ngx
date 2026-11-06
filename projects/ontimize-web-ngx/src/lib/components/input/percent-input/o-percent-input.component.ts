import { Component, forwardRef, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';


import { BooleanInputConverter } from '../../../decorators/input-converter';
import { OMatErrorDirective } from '../../../directives/o-mat-error.directive';
import { OTranslatePipe } from '../../../pipes/o-translate.pipe';
import { OIntegerPipe } from '../../../pipes/o-integer.pipe';
import { IPercentPipeArgument, OPercentageValueBaseType, OPercentPipe } from '../../../pipes/o-percentage.pipe';
import { ORealPipe } from '../../../pipes/o-real.pipe';
import { Util } from '../../../util/util';
import { ORealInputComponent } from '../real-input/o-real-input.component';


export const DEFAULT_INPUTS_O_PERCENT_INPUT = [
  'valueBase: value-base'
];

export const DEFAULT_OUTPUTS_O_PERCENT_INPUT = [
];

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatTooltipModule, OMatErrorDirective, OTranslatePipe],
  selector: 'o-percent-input',
  templateUrl: './o-percent-input.component.html',
  inputs: DEFAULT_INPUTS_O_PERCENT_INPUT,
  outputs: DEFAULT_OUTPUTS_O_PERCENT_INPUT,
  encapsulation: ViewEncapsulation.None,
  providers: [OPercentPipe, { provide: ORealPipe, useExisting: OPercentPipe }, { provide: OIntegerPipe, useExisting: OPercentPipe }, { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => OPercentInputComponent), multi: true }]
})
export class OPercentInputComponent extends ORealInputComponent implements OnInit {

  @BooleanInputConverter()
  grouping: boolean = true;

  valueBase: OPercentageValueBaseType = 1;

  protected componentPipe = inject(OPercentPipe);
  protected pipeArguments: IPercentPipeArgument;

  public ngOnInit() {
    if (!Util.isDefined(this.min)) {
      this.min = 0;
    }
    if (!Util.isDefined(this.max)) {
      this.max = 100;
    }
    super.ngOnInit();

    this.pipeArguments.valueBase = this.valueBase;
  }

  setComponentPipe(): void {
  }
}
