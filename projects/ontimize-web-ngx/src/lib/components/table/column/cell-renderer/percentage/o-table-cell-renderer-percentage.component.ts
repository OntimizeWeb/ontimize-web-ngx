import { ChangeDetectionStrategy, Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { IPercentPipeArgument, OPercentageValueBaseType, OPercentPipe } from '../../../../../pipes/o-percentage.pipe';
import { NumberService } from '../../../../../services/number.service';
import { OTableCellRendererRealComponent } from '../real/o-table-cell-renderer-real.component';

const INPUTS_ARRAY = [
  ...OTableCellRendererRealComponent.INPUTS_ARRAY,
  'valueBase: value-base'
];

@Component({
  selector: 'o-table-cell-renderer-percentage',
  templateUrl: './o-table-cell-renderer-percentage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: INPUTS_ARRAY
})
export class OTableCellRendererPercentageComponent extends OTableCellRendererRealComponent implements OnInit {

  public static INPUTS_ARRAY = INPUTS_ARRAY;

  protected decimalSeparator: string = '.';
  minDecimalDigits = 0;
  maxDecimalDigits = 0;
  protected valueBase: OPercentageValueBaseType = 1;

  protected numberService: NumberService;

  protected componentPipe: OPercentPipe;
  protected pipeArguments: IPercentPipeArgument;

  @ViewChild('templateref', { read: TemplateRef, static: false }) public templateref: TemplateRef<any>;

  constructor(protected injector: Injector) {
    super(injector);
    this.tableColumn.type = 'real';
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
