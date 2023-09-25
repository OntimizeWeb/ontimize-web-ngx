import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BooleanInputConverter } from '../../../../../../decorators/input-converter';
import { GroupedColumnAggregateConfiguration } from '../../../../../../interfaces/o-table-columns-grouping-interface';
import { AggregateFunction } from '../../../../../../types/aggregate-function.type';
import { Util } from '../../../../../../util';

export const DEFAULT_INPUTS_O_TABLE_COLUMN_GROUPING_COLUMN = [
  // attr [string]: column name.
  'attr',
  // title [string]: Title for the header aggregate column
  'title',
  // aggregate-name [string]: Name of the aggregate option
  'aggregateName: aggregate-name',
  // aggregate [sum | count | avg | min |max]
  'aggregate',
  // function-aggregate [ (value: any[]) => number] Function that calculates a value on the values of the column 'attr'
  'aggregateFunction: aggregate-function',
  // expand-groups-same-level[boolean]: Indicates if click in row expands/collapses all rows on same level. By default: true
  'expandGroupsSameLevel: expand-groups-same-level',
  // aggregate [boolean]
  'changeAggregateSameLevel: change-aggregate-same-level',
];

@Component({
  selector: 'o-table-columns-grouping-column',
  template: ' ',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: DEFAULT_INPUTS_O_TABLE_COLUMN_GROUPING_COLUMN
})

export class OTableColumnsGroupingColumnComponent {
  public attr: string;
  public title: string;
  public aggregateName: string;
  private _aggregate: string;
  public aggregateFunction: AggregateFunction;
  @BooleanInputConverter()
  expandGroupsSameLevel: boolean = true;
  @BooleanInputConverter()
  changeAggregateSameLevel: boolean = true;

  set aggregate(value: string) {
    this._aggregate = value;
  }

  get aggregate(): string {
    if (Util.isDefined(this.aggregateFunction) && Util.isDefined(this.aggregateName)) {
      return this.aggregateName;
    }
    return this._aggregate;
  }

  getAggregateConfiguration(): GroupedColumnAggregateConfiguration {
    return {
      attr: this.attr,
      title: this.title,
      aggregateName: this.aggregateName,
      aggregate: this.aggregate,
      aggregateFunction: this.aggregateFunction
    }
  }
}
