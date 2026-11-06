import { ChangeDetectionStrategy, Component, inject, Injector, TemplateRef, ViewChild } from '@angular/core';

import { ITranslatePipeArgument, OTranslatePipe } from '../../../../../pipes/o-translate.pipe';
import { OBaseTableCellRenderer } from '../o-base-table-cell-renderer.class';

export const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_TRANSLATE = [
  // translate-params [(rowData: any) => any[]]: function that receives the row data and return the parameters for the translate pipe.
  'translateArgsFn: translate-params'
];

@Component({
  standalone: true,
  selector: 'o-table-cell-renderer-translate',
  templateUrl: './o-table-cell-renderer-translate.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_TRANSLATE,
  providers: [OTranslatePipe]
})
export class OTableCellRendererTranslateComponent extends OBaseTableCellRenderer {

  @ViewChild('templateref', { read: TemplateRef, static: true })
  public templateref: TemplateRef<any>;

  public translateArgsFn: (rowData: any) => any[];

  protected componentPipe = inject(OTranslatePipe);
  protected pipeArguments: ITranslatePipeArgument = {};

  constructor(protected injector: Injector) {
    super(injector);

    this.tableColumn.type = 'translate';
  }

  public setComponentPipe(): void {
  }

  public getCellData(cellvalue: any, rowvalue?: any): string {
    this.pipeArguments = this.translateArgsFn ? { values: this.translateArgsFn(rowvalue) } : {};
    return super.getCellData(cellvalue, rowvalue);
  }

}
