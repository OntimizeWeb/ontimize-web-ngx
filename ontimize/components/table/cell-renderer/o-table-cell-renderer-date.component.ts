import { Component, Inject, Injector, forwardRef } from '@angular/core';


import { OTableColumnComponent, ITableCellRenderer } from '../o-table-column.component';
import { MomentService } from '../../../services';

export const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_DATE = [

  // format [string]: date format. See MomentJS (http://momentjs.com/).
  'format'

];

@Component({
  selector: 'o-table-cell-renderer-date',
  template: '',
  inputs: [
    ...DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_DATE
  ]
})
export class OTableCellRendererDateComponent implements ITableCellRenderer {

  public static DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_DATE = DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_DATE;

  protected momentService: MomentService;
  protected format: string;

  constructor( @Inject(forwardRef(() => OTableColumnComponent)) tableColumn: OTableColumnComponent,
    protected injector: Injector) {
    tableColumn.registerRenderer(this);
    this.momentService = this.injector.get(MomentService);
  }

  public init(parameters: any) {
    if (typeof(parameters) !== 'undefined') {
      if (typeof(parameters.format) !== 'undefined') {
        this.format = parameters.format;
      }
    }
  }

  public render(cellData: any, rowData: any): string {
    return '<div o-timestamp-value="' + ((typeof(cellData) !== 'undefined') ? cellData : 0) +'">' +
        ((typeof(cellData) !== 'undefined') ? this.momentService.parseDate(cellData, this.format) : '') +
        '</div>';
  }

  public handleCreatedCell(cellElement: any, rowData: any) {
    // nothing to do here
  }

}
