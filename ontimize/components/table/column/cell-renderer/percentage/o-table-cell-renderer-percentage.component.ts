import { Component, Injector, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { NumberService } from '../../../../../services';
import { OPercentPipe, IPercentPipeArgument } from '../../../../../pipes';
import { DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_REAL, OTableCellRendererRealComponent } from '../real/o-table-cell-renderer-real.component';

export const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_PERCENTAGE = [
  ...DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_REAL
];

@Component({
  selector: 'o-table-cell-renderer-percentage',
  templateUrl: './o-table-cell-renderer-percentage.component.html',
  inputs: DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_REAL
})
export class OTableCellRendererPercentageComponent extends OTableCellRendererRealComponent implements OnInit {

  public static DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_REAL = DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_REAL;

  protected decimalSeparator: string = '.';
  protected decimalDigits: number = 0;
  protected numberService: NumberService;

  protected componentPipe: OPercentPipe;
  protected pipeArguments: IPercentPipeArgument;


  @ViewChild('templateref', { read: TemplateRef }) public templateref: TemplateRef<any>;

  constructor(protected injector: Injector) {
    super(injector);
    this.tableColumn.type = 'real';
    this.numberService = this.injector.get(NumberService);

    if (typeof (this.decimalDigits) === 'undefined') {
      this.decimalDigits = this.numberService.decimalDigits;
    }
    this.setComponentPipe();
  }

  setComponentPipe() {
    this.componentPipe = new OPercentPipe(this.injector);
  }

  ngOnInit() {
    super.ngOnInit();
    this.pipeArguments = {
      decimalDigits: this.decimalDigits,
      decimalSeparator: this.decimalSeparator,
      grouping: this.grouping,
      thousandSeparator: this.thousandSeparator
    };
  }

}
