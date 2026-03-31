import { ChangeDetectionStrategy, Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { IMomentPipeArgument, OMomentPipe } from '../../../../../pipes/o-moment.pipe';
import { Util } from '../../../../../util/util';
import { OBaseTableCellRenderer } from '../o-base-table-cell-renderer.class';

export const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_TIME = [
  'format'
];

@Component({
  selector: 'o-table-cell-renderer-time',
  templateUrl: './o-table-cell-renderer-time.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_TIME
})
export class OTableCellRendererTimeComponent extends OBaseTableCellRenderer implements OnInit {

  protected componentPipe: OMomentPipe;
  protected pipeArguments: IMomentPipeArgument;

  protected _format: string = 'L HH:mm a';
  protected locale: string;

  @ViewChild('templateref', { read: TemplateRef, static: true }) public templateref: TemplateRef<any>;

  constructor(protected injector: Injector) {
    super(injector);
    this.tableColumn.type = 'time';
    this.setComponentPipe();
  }

  set format(value: string) {
    if (Util.isDefined(value)) {
      this._format = value;
    }
  }
  setComponentPipe() {
    this.componentPipe = new OMomentPipe(this.injector);
  }

  initialize() {
    super.initialize();
    this.pipeArguments = {
      format: this._format
    };
  }
}
