import { ChangeDetectionStrategy, Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { IPercentPipeArgument, OPercentageValueBaseType, OPercentPipe } from '../../../../../pipes/o-percentage.pipe';
import { NumberService } from '../../../../../services/number.service';
import { DEFAULT_INPUTS_O_COMBO_RENDERER_REAL, OComboRendererRealComponent } from '../real/o-combo-renderer-real.component';

export const DEFAULT_INPUTS_O_COMBO_RENDERER_PERCENTAGE = [
  ...DEFAULT_INPUTS_O_COMBO_RENDERER_REAL,
  'valueBase: value-base'
];

@Component({
  selector: 'o-combo-renderer-percentage',
  templateUrl: './o-combo-renderer-percentage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: DEFAULT_INPUTS_O_COMBO_RENDERER_PERCENTAGE
})
export class OComboRendererPercentageComponent extends OComboRendererRealComponent implements OnInit {

  decimalSeparator: string = '.';
  minDecimalDigits = 0;
  maxDecimalDigits = 0;
  valueBase: OPercentageValueBaseType = 1;

  protected numberService: NumberService;

  protected componentPipe: OPercentPipe;
  protected pipeArguments: IPercentPipeArgument;

  @ViewChild('templateref', { read: TemplateRef, static: true }) public templateref: TemplateRef<any>;

  constructor(protected injector: Injector) {
    super(injector);
    this.numberService = this.injector.get(NumberService);

    this.setComponentPipe();
  }

  setComponentPipe() {
    this.componentPipe = new OPercentPipe(this.injector);
  }

  initialize() {
    super.initialize();
    this.pipeArguments = {
      minDecimalDigits: this.minDecimalDigits,
      maxDecimalDigits: this.maxDecimalDigits,
      decimalSeparator: this.decimalSeparator,
      grouping: this.grouping,
      thousandSeparator: this.thousandSeparator,
      valueBase: this.valueBase
    };
  }

}
