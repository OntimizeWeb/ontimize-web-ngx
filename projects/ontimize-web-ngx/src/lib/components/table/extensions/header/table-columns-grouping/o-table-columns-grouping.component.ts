import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  forwardRef,
  Inject,
  Injector,
  OnInit,
  QueryList
} from '@angular/core';

import { OTableColumnsGrouping } from '../../../../../interfaces/o-table-columns-grouping-interface';
import { Util } from '../../../../../util/util';
import { OTableComponent } from '../../../o-table.component';
import { OTableColumnsGroupingColumnComponent } from './columns/o-table-columns-grouping-column.component';

export const DEFAULT_INPUTS_O_TABLE_COLUMN_GROUPING = [
  // columns [string]: columns that might be filtered, separated by ';'. Default: all visible columns.
  'columns',
  'excludedAggregateColumns: excluded-aggregate-columns'
];

export const DEFAULT_OUTPUTS_O_TABLE_COLUMN_GROUPING = [
];

@Component({
  selector: 'o-table-columns-grouping',
  template: ' ',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: DEFAULT_INPUTS_O_TABLE_COLUMN_GROUPING,
  outputs: DEFAULT_OUTPUTS_O_TABLE_COLUMN_GROUPING
})

export class OTableColumnsGroupingComponent implements OTableColumnsGrouping, OnInit {

  protected _columnsArray: string[] = [];
  protected _excludedAggregateColumnsArray: string[] = [];

  @ContentChildren(OTableColumnsGroupingColumnComponent, { descendants: true })
  groupingColumns: QueryList<OTableColumnsGroupingColumnComponent>;

  constructor(
    protected injector: Injector,
    @Inject(forwardRef(() => OTableComponent)) protected table: OTableComponent
  ) { }


  set columns(arg: string) {
    this._columnsArray = Util.parseArray(arg, true);
  }

  get columnsArray(): string[] {
    return this._columnsArray;
  }

  set excludedAggregateColumns(arg: string) {
    this._excludedAggregateColumnsArray = Util.parseArray(arg, true);
  }

  ngOnInit() {
    if (this._columnsArray.length === 0) {
      this._columnsArray = this.table.groupedColumnsArray;
    }
    this.table.setOTableColumnsGrouping(this);
  }

  useColumnAggregate(columnAttr: string, hasDefaultAggregate: boolean): boolean {
    if (this._excludedAggregateColumnsArray.includes(columnAttr)) {
      return false;
    }
    const columnConf = this.getColumnGrouping(columnAttr);
    return hasDefaultAggregate || Util.isDefined(columnConf);
  }

  getColumnGrouping(columnAttr) {
    return this.groupingColumns.find(col => col.attr === columnAttr);
  }

}
