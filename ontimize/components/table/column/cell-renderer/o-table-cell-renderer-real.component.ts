import { Component, Inject, forwardRef, Injector, TemplateRef, ViewChild } from '@angular/core';
import { OTableCellRendererIntegerComponent, DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_INTEGER } from './o-table-cell-renderer-integer.component';
import { OTableColumnComponent } from '../o-table-column.component';

import { NumberService } from '../../../../services';
import {
  ORealPipe,
  IRealPipeArgument
} from '../../../../pipes';

export const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_REAL = [

  ...DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_INTEGER,

  // decimal-separator [string]: decimal separator. Default: dot (.).
  'decimalSeparator: decimal-separator',

  // decimal-digits [number]: number of decimal digits. Default: 2.
  'decimalDigits: decimal-digits'

];

@Component({
  selector: 'o-table-cell-renderer-real',
  templateUrl: './o-table-cell-renderer-real.component.html',
  inputs: [
    ...DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_REAL
  ]
})
export class OTableCellRendererRealComponent extends OTableCellRendererIntegerComponent {

  public static DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_REAL = DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_REAL;

  protected tableColumn: OTableColumnComponent;

  protected decimalSeparator: string = '.';
  protected decimalDigits: number = 2;
  protected numberService: NumberService;

  protected componentPipe: ORealPipe;
  protected pipeArguments: IRealPipeArgument;


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
    this.componentPipe = new ORealPipe(this.injector);
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
