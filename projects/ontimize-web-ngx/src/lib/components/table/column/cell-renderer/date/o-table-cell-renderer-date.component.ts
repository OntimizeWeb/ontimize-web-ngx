import { ChangeDetectionStrategy, Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { ILuxonPipeArgument, OLuxonPipe } from '../../../../../pipes/o-luxon.pipe';
import { OMomentPipe } from '../../../../../pipes/o-moment.pipe';
import { injectODateAdapterPipe } from '../../../../../shared/material/date/o-date-adapter.provider';
import { OBaseTableCellRenderer } from '../o-base-table-cell-renderer.class';

export const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_DATE = [
  // format [string]: date format, interpreted by the active date adapter (Luxon by default; moment when O_DATE_ADAPTER is 'moment').
  'format'
];

@Component({
  standalone: true,
  selector: 'o-table-cell-renderer-date',
  templateUrl: './o-table-cell-renderer-date.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_DATE,
  providers: [OLuxonPipe, OMomentPipe]
})
export class OTableCellRendererDateComponent extends OBaseTableCellRenderer implements OnInit {

  protected componentPipe = injectODateAdapterPipe();
  protected pipeArguments: ILuxonPipeArgument;

  protected format: string;

  @ViewChild('templateref', { read: TemplateRef, static: true }) public templateref: TemplateRef<any>;

  constructor(protected injector: Injector) {
    super(injector);
    this.tableColumn.type = 'date';
  }

  setComponentPipe() {
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
