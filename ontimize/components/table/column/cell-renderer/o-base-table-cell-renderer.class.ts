import { Injector, OnInit, PipeTransform, TemplateRef } from '@angular/core';

import { Util } from '../../../../utils';
import { OTableComponent } from '../../o-table.component';
import { OTableColumnComponent } from '../o-table-column.component';

export class OBaseTableCellRenderer implements OnInit {

  public templateref: TemplateRef<any>;

  protected pipeArguments: any;
  protected componentPipe: PipeTransform;
  tableColumn: OTableColumnComponent;
  protected type: string;

  constructor(protected injector: Injector) {
    this.tableColumn = this.injector.get(OTableColumnComponent);
  }

  ngOnInit(): void {
    this.registerRenderer();
  }

  registerRenderer() {
    this.tableColumn.registerRenderer(this);
    if (!Util.isDefined(this.type) && Util.isDefined(this.tableColumn.type)) {
      this.type = this.tableColumn.type;
    }
  }

  /** @deprecated */
  initialize() {
    //
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

  get table(): OTableComponent {
    return this.tableColumn.table;
  }

  get column(): string {
    return this.tableColumn.attr;
  }

  getTooltip(cellValue: any, rowValue: any) {
    return this.getCellData(cellValue, rowValue);
  }

}
