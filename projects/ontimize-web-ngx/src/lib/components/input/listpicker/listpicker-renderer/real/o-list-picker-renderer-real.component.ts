import { ChangeDetectionStrategy, Component, inject, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { NumberInputConverter } from '../../../../../decorators/input-converter';
import { IRealPipeArgument, ORealPipe } from '../../../../../pipes/o-real.pipe';
import { NumberService } from '../../../../../services/number.service';
import { DEFAULT_INPUTS_O_LISTPICKER_RENDERER_INTEGER, OListPickerRendererIntegerComponent } from '../integer/o-list-picker-renderer-integer.component';

export const DEFAULT_INPUTS_O_LISTPICKER_RENDERER_REAL = [
  ...DEFAULT_INPUTS_O_LISTPICKER_RENDERER_INTEGER,
  // decimal-separator [string]: decimal separator. Default: dot (.).
  'decimalSeparator: decimal-separator',
  'minDecimalDigits: min-decimal-digits',
  'maxDecimalDigits: max-decimal-digits'
];

@Component({
  standalone: true,
  selector: 'o-list-picker-renderer-real',
  templateUrl: './o-list-picker-renderer-real.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: DEFAULT_INPUTS_O_LISTPICKER_RENDERER_REAL,
  providers: [ORealPipe]
})
export class OListPickerRendererRealComponent extends OListPickerRendererIntegerComponent implements OnInit {

  @NumberInputConverter()
  minDecimalDigits: number = 2;
  @NumberInputConverter()
  maxDecimalDigits: number = 2;

  protected decimalSeparator: string = '.';

  protected componentPipe = inject(ORealPipe);
  protected pipeArguments: IRealPipeArgument;

  @ViewChild('templateref', { read: TemplateRef, static: true }) public templateref: TemplateRef<any>;

  constructor(protected injector: Injector) {
    super(injector);
  }

  setComponentPipe() {
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
