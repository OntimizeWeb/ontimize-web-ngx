import { ChangeDetectionStrategy, Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { IPercentPipeArgument, OPercentageValueBaseType, OPercentPipe } from '../../../../../pipes/o-percentage.pipe';
import { DEFAULT_INPUTS_O_LISTPICKER_RENDERER_REAL, OListPickerRendererRealComponent } from '../real/o-list-picker-renderer-real.component';

export const DEFAULT_INPUTS_O_LISTPICKER_RENDERER_PERCENTAGE = [
  ...DEFAULT_INPUTS_O_LISTPICKER_RENDERER_REAL,
  'valueBase: value-base'
];

@Component({
  selector: 'o-list-picker-renderer-percentage',
  templateUrl: './o-list-picker-renderer-percentage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: DEFAULT_INPUTS_O_LISTPICKER_RENDERER_PERCENTAGE
})
export class OListPickerRendererPercentageComponent extends OListPickerRendererRealComponent implements OnInit {

  decimalSeparator: string = '.';
  minDecimalDigits = 0;
  maxDecimalDigits = 0;
  valueBase: OPercentageValueBaseType = 1;


  protected componentPipe: OPercentPipe;
  protected pipeArguments: IPercentPipeArgument;

  @ViewChild('templateref', { read: TemplateRef, static: true }) public templateref: TemplateRef<any>;

  constructor(protected injector: Injector) {
    super(injector);
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
