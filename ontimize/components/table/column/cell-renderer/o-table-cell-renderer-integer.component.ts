import { Component, ViewChild, TemplateRef, Injector, forwardRef, Inject } from '@angular/core';
import { OTableColumnComponent } from '../o-table-column.component';
import { InputConverter } from '../../../../decorators';
import { OTableCellRenderer } from './o-table-cell-renderer';

import {
  OIntegerPipe,
  IIntegerPipeArgument
} from '../../../../pipes';


export const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_INTEGER = [

  // grouping [no|yes]: grouping thousands. Default: yes.
  'grouping',
  // thousand-separator [string]: thousands separator when grouping. Default: comma (,).
  'thousandSeparator: thousand-separator'

];

@Component({
  selector: 'o-table-cell-renderer-integer',
  templateUrl: './o-table-cell-renderer-integer.component.html',
  inputs: [
    ...DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_INTEGER
  ]
})


export class OTableCellRendererIntegerComponent extends OTableCellRenderer {

  public static DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_INTEGER = DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_INTEGER;

  @InputConverter()
  protected grouping: boolean = true;
  protected thousandSeparator: string =',';

  protected tableColumn: OTableColumnComponent;

  protected componentPipe: OIntegerPipe;
  protected pipeArguments: IIntegerPipeArgument;

  @ViewChild('templateref', { read: TemplateRef }) public templateref: TemplateRef<any>;

  constructor( @Inject(forwardRef(() => OTableColumnComponent)) tableColumn: OTableColumnComponent,
    protected injector: Injector) {
    super();
    this.tableColumn = this.injector.get(OTableColumnComponent);
    this.tableColumn.type ='integer';
    this.setComponentPipe();
  }

  setComponentPipe() {
    this.componentPipe = new OIntegerPipe(this.injector);
  }

  ngOnInit() {
    this.pipeArguments = {
      grouping: this.grouping,
      thousandSeparator: this.thousandSeparator
    };
    this.tableColumn.registerRenderer(this);

  }


}
