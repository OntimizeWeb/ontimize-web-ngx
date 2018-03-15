import { PipeTransform, Injector } from '@angular/core';
import { OTableColumnComponent } from '../o-table-column.component';
import { OTableComponent } from '../../o-table.component';

export class OBaseTableCellRenderer {

  protected pipeArguments: any;
  protected componentPipe: PipeTransform;
  tableColumn: OTableColumnComponent;

  constructor(protected injector: Injector) {
    this.tableColumn = this.injector.get(OTableColumnComponent);
  }

  /**
   * @param value data to render integer
   */
  getCellData(cellvalue: any, rowvalue?: any) {
    let parsedValue: string;
    if (this.componentPipe && typeof this.pipeArguments !== 'undefined' && cellvalue !== undefined) {

      parsedValue = this.componentPipe.transform(cellvalue, this.pipeArguments);
    } else {
      parsedValue = cellvalue;
    }
    return parsedValue;
  }

  initialize() {
    this.tableColumn.registerRenderer(this);
  }

  get table(): OTableComponent {
    return this.tableColumn.table;
  }

  get column(): string {
    return this.tableColumn.attr;
  }
}
