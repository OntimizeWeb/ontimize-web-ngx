import { AfterContentInit, ChangeDetectionStrategy, Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { BooleanInputConverter } from '../../../../../decorators/input-converter';
import { IIntegerPipeArgument, OIntegerPipe } from '../../../../../pipes/o-integer.pipe';
import { OBaseTableCellRenderer } from '../o-base-table-cell-renderer.class';

export const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_INTEGER = [
  // grouping [no|yes]: grouping thousands. Default: yes.
  'grouping',
  // thousand-separator [string]: thousands separator when grouping. Default: comma (,).
  'thousandSeparator: thousand-separator'
];

@Component({
  selector: 'o-table-cell-renderer-integer',
  templateUrl: './o-table-cell-renderer-integer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_INTEGER
})
export class OTableCellRendererIntegerComponent extends OBaseTableCellRenderer implements AfterContentInit, OnInit {

  @BooleanInputConverter()
  protected grouping: boolean = true;
  protected thousandSeparator: string = ',';
  protected componentPipe: OIntegerPipe;
  protected pipeArguments: IIntegerPipeArgument;

  @ViewChild('templateref', { read: TemplateRef, static: true }) public templateref: TemplateRef<any>;

  constructor(protected injector: Injector) {
    super(injector);
    this.tableColumn.type = 'integer';
    this.setComponentPipe();
  }

  setComponentPipe() {
    this.componentPipe = new OIntegerPipe(this.injector);
  }

  initialize() {
    super.initialize();
    this.pipeArguments = {
      grouping: this.grouping,
      thousandSeparator: this.thousandSeparator
    };
  }

}
