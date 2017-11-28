import { Component, Inject, forwardRef, Injector, TemplateRef, ViewChild } from '@angular/core';
import { DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_REAL, OTableCellRendererRealComponent } from './o-table-cell-renderer-real.component';
import { OTableColumnComponent } from '../o-table-column.component';

import { NumberService } from '../../../../services';
import {
  OPercentPipe,
  IPercentPipeArgument
} from '../../../../pipes';



export const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_PERCENTAGE = [

  ...DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_REAL
];

@Component({
  selector: 'o-table-cell-renderer-percentage',
  templateUrl: './o-table-cell-renderer-percentage.component.html',
  inputs: [
    ...DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_REAL
  ]
})
export class OTableCellRendererPercentageComponent extends OTableCellRendererRealComponent {

  public static DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_REAL = DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_REAL;

  protected tableColumn: OTableColumnComponent;

  protected decimalSeparator: string = '.';
  protected decimalDigits: number = 0;
  protected numberService: NumberService;

  protected componentPipe: OPercentPipe;
  protected pipeArguments: IPercentPipeArgument;


  @ViewChild('templateref', { read: TemplateRef }) public templateref: TemplateRef<any>;

  constructor( @Inject(forwardRef(() => OTableColumnComponent)) tableColumn: OTableColumnComponent,
    protected injector: Injector) {
    super(tableColumn, injector);
    this.tableColumn = this.injector.get(OTableColumnComponent);
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
    this.pipeArguments = {
      decimalDigits: this.decimalDigits,
      decimalSeparator: this.decimalSeparator,
      grouping: this.grouping,
      thousandSeparator: this.thousandSeparator
    };
    this.tableColumn.registerRenderer(this);
  }


}
