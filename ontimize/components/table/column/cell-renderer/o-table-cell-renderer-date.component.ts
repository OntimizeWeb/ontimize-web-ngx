import { Component, Injector, Inject, forwardRef, ViewChild, TemplateRef } from '@angular/core';

import { OTableColumnComponent } from '../o-table-column.component';
import { OTableCellRenderer } from './o-table-cell-renderer';

export const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_DATE = [
  // format [string]: date format. See MomentJS (http://momentjs.com/).
  'format'
];
import {
  OMomentPipe,
  IMomentPipeArgument
} from '../../../../pipes';

@Component({
  selector: 'o-table-cell-renderer-date',
  templateUrl: './o-table-cell-renderer-date.component.html',
  inputs: [
    ...DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_DATE
  ]
})
export class OTableCellRendererDateComponent extends OTableCellRenderer {

  public static DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_DATE = DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_DATE;

  protected componentPipe: OMomentPipe;
  protected pipeArguments: IMomentPipeArgument;

  protected format: string;
  protected tableColumn: OTableColumnComponent;

  @ViewChild('templateref', { read: TemplateRef }) public templateref: TemplateRef<any>;

  constructor( @Inject(forwardRef(() => OTableColumnComponent)) tableColumn: OTableColumnComponent,
    protected injector: Injector) {
    super();
    this.tableColumn = this.injector.get(OTableColumnComponent);
    this.tableColumn.type = 'date';
    this.tableColumn.registerRenderer(this);

    this.setComponentPipe();
  }


  setComponentPipe() {
    this.componentPipe = new OMomentPipe(this.injector);
  }

  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.pipeArguments = {
      format:this.format
    };

    this.tableColumn.registerRenderer(this);
  }


}
