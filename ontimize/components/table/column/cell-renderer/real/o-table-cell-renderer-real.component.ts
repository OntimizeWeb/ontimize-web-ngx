import { Component, Injector, TemplateRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';

import { NumberService } from '../../../../../services';
import { IRealPipeArgument, ORealPipe } from '../../../../../pipes';
import { DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_INTEGER, OTableCellRendererIntegerComponent } from '../integer/o-table-cell-renderer-integer.component';
import { InputConverter } from '../../../../../decorators';

export const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_REAL = [
  ...DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_INTEGER,
  // decimal-separator [string]: decimal separator. Default: dot (.).
  'decimalSeparator: decimal-separator',
  'minDecimalDigits: min-decimal-digits',
  'maxDecimalDigits: max-decimal-digits'
];

@Component({
  moduleId: module.id,
  selector: 'o-table-cell-renderer-real',
  templateUrl: './o-table-cell-renderer-real.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_REAL
})
export class OTableCellRendererRealComponent extends OTableCellRendererIntegerComponent {

  public static DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_REAL = DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_REAL;

  @InputConverter()
  minDecimalDigits: number = 2;
  @InputConverter()
  maxDecimalDigits: number = 2;

  protected decimalSeparator: string = '.';
  protected numberService: NumberService;

  protected componentPipe: ORealPipe;
  protected pipeArguments: IRealPipeArgument;

  @ViewChild('templateref', { read: TemplateRef }) public templateref: TemplateRef<any>;

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
