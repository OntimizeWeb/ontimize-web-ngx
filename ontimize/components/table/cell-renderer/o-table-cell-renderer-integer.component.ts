import { Component, OnInit, Inject, Injector, forwardRef } from '@angular/core';

import { ITableCellRenderer } from '../../../interfaces';
import { OTableColumnComponent } from '../o-table-column.component';
import { NumberService } from '../../../services';
import { Util } from '../../../util/util';

export const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_INTEGER = [

  // grouping [no|yes]: grouping thousands. Default: yes.
  'grouping',

  // thousand-separator [string]: thousands separator when grouping. Default: comma (,).
  'thousandSeparator: thousand-separator'

];

@Component({
  selector: 'o-table-cell-renderer-integer',
  template: '',
  inputs: [
    ...DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_INTEGER
  ]
})
export class OTableCellRendererIntegerComponent implements OnInit, ITableCellRenderer {

  public static DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_INTEGER = DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_INTEGER;

  protected numberService: NumberService;
  protected grouping : any;
  protected thousandSeparator : string;

  constructor( @Inject(forwardRef(() => OTableColumnComponent)) tableColumn: OTableColumnComponent,
    protected injector: Injector) {
    tableColumn.registerRenderer(this);
    this.numberService = this.injector.get(NumberService);
  }

  public ngOnInit() {
    this.grouping = Util.parseBoolean(this.grouping, true);
    if (typeof(this.thousandSeparator) === 'undefined') {
      this.thousandSeparator = this.numberService.thousandSeparator;
    }
  }

  public init(parameters: any) {
    if (typeof(parameters) !== 'undefined') {
      if (typeof(parameters.grouping) !== 'undefined') {
        this.grouping = parameters.grouping;
      }
      if (typeof(parameters.thousandSeparator) !== 'undefined') {
        this.thousandSeparator = parameters.thousandSeparator;
      }
    }
  }

  public render(cellData: any, rowData: any): string {
    return this.numberService.getIntegerValue(cellData, this.grouping, this.thousandSeparator);
  }

  public handleCreatedCell(cellElement: any, rowData: any) {
    // nothing to do here
  }

}
