import { Component, Inject, forwardRef } from '@angular/core';

import { ITableCellRenderer } from '../../../interfaces';
import { OTableColumnComponent } from '../o-table-column.component';

@Component({
  selector: 'o-table-cell-renderer-string',
  template: ''
})
export class OTableCellRendererStringComponent implements ITableCellRenderer {

  constructor(@Inject(forwardRef(() => OTableColumnComponent)) tableColumn: OTableColumnComponent) {
    tableColumn.registerRenderer(this);
  }

  public init(parameters: any) {
    // nothing to initialize here
  }

  public render(cellData: any, rowData: any): string {
    return (typeof(cellData) !== 'undefined') ? String(cellData) : '';
  }

  public handleCreatedCell(cellElement: any, rowData: any) {
    // nothing to do here
  }

}
