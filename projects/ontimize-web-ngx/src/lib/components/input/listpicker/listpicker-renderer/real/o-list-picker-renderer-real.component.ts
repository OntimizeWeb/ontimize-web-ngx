import { ChangeDetectionStrategy, Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { InputConverter } from '../../../../../decorators/input-converter';
import { IRealPipeArgument, ORealPipe } from '../../../../../pipes/o-real.pipe';
import { NumberService } from '../../../../../services/number.service';
import {
  DEFAULT_INPUTS_O_LISTPICKER_RENDERER_INTEGER,
  OListPickerRendererIntegerComponent
} from '../integer/o-list-picker-renderer-integer.component';

export const DEFAULT_INPUTS_O_LISTPICKER_RENDERER_REAL = [
  ...DEFAULT_INPUTS_O_LISTPICKER_RENDERER_INTEGER,
  // decimal-separator [string]: decimal separator. Default: dot (.).
  'decimalSeparator: decimal-separator',
  'minDecimalDigits: min-decimal-digits',
  'maxDecimalDigits: max-decimal-digits'
];

@Component({
  selector: 'o-list-picker-renderer-real',
  templateUrl: './o-list-picker-renderer-real.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: DEFAULT_INPUTS_O_LISTPICKER_RENDERER_REAL
})
export class OListPickerRendererRealComponent extends OListPickerRendererIntegerComponent implements OnInit {

  @InputConverter()
  minDecimalDigits: number = 2;
  @InputConverter()
  maxDecimalDigits: number = 2;

  protected decimalSeparator: string = '.';
  protected numberService: NumberService;

  protected componentPipe: ORealPipe;
  protected pipeArguments: IRealPipeArgument;

  @ViewChild('templateref', { read: TemplateRef, static: true }) public templateref: TemplateRef<any>;

  constructor(protected injector: Injector) {
    super(injector);
    this.numberService = this.injector.get(NumberService);
    this.setComponentPipe();
  }

  setComponentPipe() {
    this.componentPipe = new ORealPipe(this.injector);
  }

  initialize() {
    super.initialize();
    this.pipeArguments = {
      minDecimalDigits: this.minDecimalDigits,
      maxDecimalDigits: this.maxDecimalDigits,
      decimalSeparator: this.decimalSeparator,
      grouping: this.grouping,
      thousandSeparator: this.thousandSeparator
    };
  }

}
