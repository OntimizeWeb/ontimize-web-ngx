import { PipeTransform, Injector } from '@angular/core';
import { OTableColumnComponent } from '../o-table-column.component';

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
  getCellData(value: any) {
    let parsedValue: string;
    if (this.componentPipe && typeof this.pipeArguments !== 'undefined' && value !== undefined) {

      parsedValue = this.componentPipe.transform(value, this.pipeArguments);
    }
    return parsedValue;
  }

  initialize() {
    this.tableColumn.registerRenderer(this);
  }
}
