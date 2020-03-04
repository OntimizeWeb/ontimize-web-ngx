import { ChangeDetectionStrategy, Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { InputConverter } from '../../../../../decorators/input-converter';
import { IRealPipeArgument, ORealPipe } from '../../../../../pipes/o-real.pipe';
import { NumberService } from '../../../../../services/number.service';
import { OTableCellRendererIntegerComponent } from '../integer/o-table-cell-renderer-integer.component';

const INPUTS_ARRAY = [
  ...OTableCellRendererIntegerComponent.INPUTS_ARRAY,
  // decimal-separator [string]: decimal separator. Default: dot (.).
  'decimalSeparator: decimal-separator',
  'minDecimalDigits: min-decimal-digits',
  'maxDecimalDigits: max-decimal-digits'
];

@Component({
  selector: 'o-table-cell-renderer-real',
  templateUrl: './o-table-cell-renderer-real.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: INPUTS_ARRAY
})
export class OTableCellRendererRealComponent extends OTableCellRendererIntegerComponent implements OnInit {

  public static INPUTS_ARRAY = INPUTS_ARRAY;

  @InputConverter()
  minDecimalDigits: number = 2;
  @InputConverter()
  maxDecimalDigits: number = 2;

  protected decimalSeparator: string = '.';
  protected numberService: NumberService;

  protected componentPipe: ORealPipe;
  protected pipeArguments: IRealPipeArgument;

  @ViewChild('templateref', { read: TemplateRef, static: false }) public templateref: TemplateRef<any>;

  constructor(protected injector: Injector) {
    super(injector);
    this.tableColumn.type = 'real';
    this.numberService = this.injector.get(NumberService);
    this.setComponentPipe();
  }

  setComponentPipe() {
    this.componentPipe = new ORealPipe(this.injector);
  }

  ngOnInit() {
    super.ngOnInit();
    this.pipeArguments = {
      minDecimalDigits: this.minDecimalDigits,
      maxDecimalDigits: this.maxDecimalDigits,
      decimalSeparator: this.decimalSeparator,
      grouping: this.grouping,
      thousandSeparator: this.thousandSeparator
    };
  }

}
