import { ChangeDetectionStrategy, Component, Injector, TemplateRef, ViewChild } from '@angular/core';

import { ITranslatePipeArgument, OTranslatePipe } from '../../../../../pipes/o-translate.pipe';
import { OBaseTableCellRenderer } from '../o-base-table-cell-renderer.class';

const INPUTS_ARRAY = [
  ...OBaseTableCellRenderer.INPUTS_ARRAY,
  // translate-params [(rowData: any) => any[]]: function that receives the row data and return the parameters for the translate pipe.
  'translateArgsFn: translate-params'
];

@Component({
  selector: 'o-table-cell-renderer-translate',
  templateUrl: './o-table-cell-renderer-translate.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: INPUTS_ARRAY
})
export class OTableCellRendererTranslateComponent extends OBaseTableCellRenderer {

  public static INPUTS_ARRAY = INPUTS_ARRAY;

  @ViewChild('templateref', { read: TemplateRef, static: false })
  public templateref: TemplateRef<any>;

  public translateArgsFn: (rowData: any) => any[];

  protected componentPipe: OTranslatePipe;
  protected pipeArguments: ITranslatePipeArgument = {};

  constructor(protected injector: Injector) {
    super(injector);

    this.tableColumn.type = 'translate';

    this.setComponentPipe();
  }

  public setComponentPipe(): void {
    this.componentPipe = new OTranslatePipe(this.injector);
  }

  public getCellData(cellvalue: any, rowvalue?: any): string {
    this.pipeArguments = this.translateArgsFn ? { values: this.translateArgsFn(rowvalue) } : {};
    return super.getCellData(cellvalue, rowvalue);
  }

}
