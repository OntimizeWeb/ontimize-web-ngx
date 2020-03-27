import { ChangeDetectionStrategy, Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { IPercentPipeArgument, OPercentageValueBaseType, OPercentPipe } from '../../../../../pipes/o-percentage.pipe';
import { NumberService } from '../../../../../services/number.service';
import {
  DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_REAL,
  OTableCellRendererRealComponent,
} from '../real/o-table-cell-renderer-real.component';

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
export class OTableCellRendererPercentageComponent extends OTableCellRendererRealComponent implements OnInit {

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
    this.tableColumn.type = 'percentage';
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
