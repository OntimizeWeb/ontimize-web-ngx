import { Component, Injector, OnInit, TemplateRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';

import { NumberService } from '../../../../../services/number.service';
import { IPercentPipeArgument, OPercentPipe, OPercentageValueBaseType } from '../../../../../pipes/o-percentage.pipe';
import { DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_REAL, OTableCellRendererRealComponent } from '../real/o-table-cell-renderer-real.component';

export const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_PERCENTAGE = [
  ...DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_REAL,
  'valueBase: value-base'
];

@Component({
  selector: 'o-table-cell-renderer-percentage',
  templateUrl: './o-table-cell-renderer-percentage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_PERCENTAGE
})
export class OTableCellRendererPercentageComponent extends OBaseTableCellRenderer implements OnInit {

  public static DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_PERCENTAGE = DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_PERCENTAGE;

  protected decimalSeparator: string = '.';
  minDecimalDigits = 0;
  maxDecimalDigits = 0;
  protected valueBase: OPercentageValueBaseType = 1;

  // also existing in OTableCellRendererIntegerComponent
  @InputConverter()
  protected grouping: boolean = true;
  protected thousandSeparator: string = ',';

  protected numberService: NumberService;

  protected componentPipe: OPercentPipe;
  protected pipeArguments: IPercentPipeArgument;

  @ViewChild('templateref', { read: TemplateRef, static: false }) public templateref: TemplateRef<any>;

  constructor(protected injector: Injector) {
    super(injector);
    this.tableColumn.type = 'percentage';
    this.numberService = this.injector.get(NumberService);

    this.setComponentPipe();
  }

  setComponentPipe() {
    this.componentPipe = new OPercentPipe(this.injector);
  }

  ngOnInit() {
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
