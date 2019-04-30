import { AfterContentInit, Injector, PipeTransform, TemplateRef } from '@angular/core';

import { Util } from '../../../../utils';
import { OTableComponent } from '../../o-table.component';
import { OTableColumnComponent } from '../o-table-column.component';

export class OBaseTableCellRenderer implements AfterContentInit {

  public templateref: TemplateRef<any>;
  public tableColumn: OTableColumnComponent;

  protected type: string;
  protected pipeArguments: any;
  protected componentPipe: PipeTransform;

  constructor(protected injector: Injector) {
    this.tableColumn = this.injector.get(OTableColumnComponent);
  }

  public ngAfterContentInit(): void {
    this.registerRenderer();
  }

  get table(): OTableComponent {
    return this.tableColumn.table;
  }

  get column(): string {
    return this.tableColumn.attr;
  }

  public registerRenderer(): void {
    this.tableColumn.registerRenderer(this);
    if (!Util.isDefined(this.type) && Util.isDefined(this.tableColumn.type)) {
      this.type = this.tableColumn.type;
    }
  }

  /**
   * Returns the displayed table cell value
   * @param cellvalue the internal table cell value
   * @param rowvalue the table row value
   */
  public getCellData(cellvalue: any, rowvalue?: any): string {
    let parsedValue: string;
    if (this.componentPipe && typeof this.pipeArguments !== 'undefined' && cellvalue !== undefined) {
      parsedValue = this.componentPipe.transform(cellvalue, this.pipeArguments);
    } else {
      parsedValue = cellvalue;
    }
    return parsedValue;
  }

  public getTooltip(cellValue: any, rowValue: any): string {
    return this.getCellData(cellValue, rowValue);
  }

}
