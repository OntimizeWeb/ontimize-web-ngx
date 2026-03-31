import { ChangeDetectionStrategy, Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { IMomentPipeArgument, OMomentPipe } from '../../../../../pipes/o-moment.pipe';
import { OBaseTableCellRenderer } from '../o-base-table-cell-renderer.class';

export const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_DATE = [
  // format [string]: date format. See MomentJS (http://momentjs.com/).
  'format'
];

@Component({
  selector: 'o-table-cell-renderer-date',
  templateUrl: './o-table-cell-renderer-date.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_DATE
})
export class OTableCellRendererDateComponent extends OBaseTableCellRenderer implements OnInit {

  protected componentPipe: OMomentPipe;
  protected pipeArguments: IMomentPipeArgument;

  protected format: string;

  @ViewChild('templateref', { read: TemplateRef, static: true }) public templateref: TemplateRef<any>;

  constructor(protected injector: Injector) {
    super(injector);
    this.tableColumn.type = 'date';
    this.setComponentPipe();
  }

  setComponentPipe() {
    this.componentPipe = new OMomentPipe(this.injector);
  }

  initialize() {
    super.initialize();
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    this.pipeArguments = {
      format: this.format
    };
  }
  getFormat(): string {
    return this.format;
  }
}
