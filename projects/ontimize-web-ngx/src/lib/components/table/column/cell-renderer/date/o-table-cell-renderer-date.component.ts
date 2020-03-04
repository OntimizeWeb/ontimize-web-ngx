import { ChangeDetectionStrategy, Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { IMomentPipeArgument, OMomentPipe } from '../../../../../pipes/o-moment.pipe';
import { OBaseTableCellRenderer } from '../o-base-table-cell-renderer.class';

const INPUTS_ARRAY = [
  ...OBaseTableCellRenderer.INPUTS_ARRAY,
  // format [string]: date format. See MomentJS (http://momentjs.com/).
  'format'
];

@Component({
  selector: 'o-table-cell-renderer-date',
  templateUrl: './o-table-cell-renderer-date.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: INPUTS_ARRAY
})
export class OTableCellRendererDateComponent extends OBaseTableCellRenderer implements OnInit {

  public static INPUTS_ARRAY = INPUTS_ARRAY;

  protected componentPipe: OMomentPipe;
  protected pipeArguments: IMomentPipeArgument;

  protected format: string;

  @ViewChild('templateref', { read: TemplateRef, static: false }) public templateref: TemplateRef<any>;

  constructor(protected injector: Injector) {
    super(injector);
    this.tableColumn.type = 'date';
    this.setComponentPipe();
  }

  setComponentPipe() {
    this.componentPipe = new OMomentPipe(this.injector);
  }

  ngOnInit() {
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    this.pipeArguments = {
      format: this.format
    };
  }
}
