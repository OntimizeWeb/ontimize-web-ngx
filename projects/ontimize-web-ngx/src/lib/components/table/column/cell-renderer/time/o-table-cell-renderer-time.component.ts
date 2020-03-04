import { ChangeDetectionStrategy, Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { IMomentPipeArgument, OMomentPipe } from '../../../../../pipes/o-moment.pipe';
import { Util } from '../../../../../util/util';
import { OBaseTableCellRenderer } from '../o-base-table-cell-renderer.class';

const INPUTS_ARRAY = [
  ...OBaseTableCellRenderer.INPUTS_ARRAY,
  'format'
];

@Component({
  selector: 'o-table-cell-renderer-time',
  templateUrl: './o-table-cell-renderer-time.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: INPUTS_ARRAY
})
export class OTableCellRendererTimeComponent extends OBaseTableCellRenderer implements OnInit {

  public static INPUTS_ARRAY = INPUTS_ARRAY;

  protected componentPipe: OMomentPipe;
  protected pipeArguments: IMomentPipeArgument;

  protected _format: string = 'L HH:mm a';
  protected locale: string;

  @ViewChild('templateref', { read: TemplateRef, static: false }) public templateref: TemplateRef<any>;

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

  ngOnInit() {
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    this.pipeArguments = {
      format: this._format
    };
  }
}
