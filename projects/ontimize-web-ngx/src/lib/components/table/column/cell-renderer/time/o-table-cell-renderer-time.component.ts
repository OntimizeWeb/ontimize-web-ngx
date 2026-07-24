import { ChangeDetectionStrategy, Component, inject, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { ILuxonPipeArgument, OLuxonPipe } from '../../../../../pipes/o-luxon.pipe';
import { OMomentPipe } from '../../../../../pipes/o-moment.pipe';
import { injectODateAdapterPipe, O_DATE_ADAPTER } from '../../../../../shared/material/date/o-date-adapter.provider';
import { Util } from '../../../../../util/util';
import { OBaseTableCellRenderer } from '../o-base-table-cell-renderer.class';

export const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_TIME = [
  'format'
];

@Component({
  standalone: true,
  selector: 'o-table-cell-renderer-time',
  templateUrl: './o-table-cell-renderer-time.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_TIME,
  providers: [OLuxonPipe, OMomentPipe]
})
export class OTableCellRendererTimeComponent extends OBaseTableCellRenderer implements OnInit {

  protected componentPipe = injectODateAdapterPipe();
  protected pipeArguments: ILuxonPipeArgument;

  // Default format follows the active date adapter ('D ...' Luxon macro token vs 'L ...' moment token)
  protected _format: string = inject(O_DATE_ADAPTER, { optional: true }) === 'moment' ? 'L HH:mm a' : 'D HH:mm a';
  protected locale: string;

  @ViewChild('templateref', { read: TemplateRef, static: true }) public templateref: TemplateRef<any>;

  constructor(protected injector: Injector) {
    super(injector);
    this.tableColumn.type = 'time';
  }

  set format(value: string) {
    if (Util.isDefined(value)) {
      this._format = value;
    }
  }
  setComponentPipe() {
  }

  initialize() {
    super.initialize();
    this.pipeArguments = {
      format: this._format
    };
  }
}
