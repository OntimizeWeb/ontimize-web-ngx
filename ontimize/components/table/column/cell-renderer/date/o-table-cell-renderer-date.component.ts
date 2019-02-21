import { Component, Injector, ViewChild, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { OMomentPipe, IMomentPipeArgument } from '../../../../../pipes';
import { OBaseTableCellRenderer } from '../o-base-table-cell-renderer.class';

export const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_DATE = [
  // format [string]: date format. See MomentJS (http://momentjs.com/).
  'format'
];

@Component({
  moduleId: module.id,
  selector: 'o-table-cell-renderer-date',
  templateUrl: './o-table-cell-renderer-date.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_DATE
})
export class OTableCellRendererDateComponent extends OBaseTableCellRenderer {

  public static DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_DATE = DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_DATE;

  protected componentPipe: OMomentPipe;
  protected pipeArguments: IMomentPipeArgument;

  protected format: string;

  @ViewChild('templateref', { read: TemplateRef }) public templateref: TemplateRef<any>;

  constructor(protected injector: Injector) {
    super(injector);
    this.tableColumn.type = 'date';
    this.setComponentPipe();
  }

  setComponentPipe() {
    this.componentPipe = new OMomentPipe(this.injector);
  }

  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.pipeArguments = {
      format: this.format
    };
  }
}
