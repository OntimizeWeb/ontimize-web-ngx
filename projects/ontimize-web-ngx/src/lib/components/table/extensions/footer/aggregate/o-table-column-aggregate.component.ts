import { ChangeDetectionStrategy, Component, forwardRef, Inject, Injector, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AggregateFunction } from '../../../../../types/aggregate-function.type';
import { OColumnAggregate } from '../../../../../types/table/o-column-aggregate.type';
import { OTableComponent } from '../../../o-table.component';

export const DEFAULT_TABLE_COLUMN_AGGREGATE = [
  // attr [string]: column name.
  'attr',

  // title [string]: Title for the header total column
  'title',

  // aggregate [sum | count | avg | min |max]
  'aggregate',

  // function-aggregate [ (value: any[]) => number] Function that calculates a value on the values of the column 'attr'
  'functionAggregate: function-aggregate'
];

@Component({
  selector: 'o-table-column-aggregate',
  templateUrl: './o-table-column-aggregate.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: DEFAULT_TABLE_COLUMN_AGGREGATE
})
export class OTableColumnAggregateComponent implements OnDestroy, OnInit {
  public static DEFAULT_AGGREGATE = 'SUM';

  public attr: string;
  public aggregate: string;
  public table: OTableComponent;
  public title: string = '';
  protected _aggregateFunction: AggregateFunction;

  protected subscription: Subscription = new Subscription();

  constructor(
    @Inject(forwardRef(() => OTableComponent)) table: OTableComponent,
    protected injector: Injector) {
    this.table = table;
  }

  get functionAggregate(): AggregateFunction {
    return this._aggregateFunction;
  }

  set functionAggregate(val: AggregateFunction) {
    this._aggregateFunction = val;
  }

  getColumnData(attr) {
    let columnData = [];
    if (this.table.dataSource) {
      columnData = this.table.dataSource.getColumnData(attr);
    }
    return columnData;
  }

  ngOnInit() {
    if (!this.attr) {
      return;
    }

    const ocolumnaggregate: OColumnAggregate = {};
    ocolumnaggregate.attr = this.attr;
    if (this.title) {
      ocolumnaggregate.title = this.title;
    }

    ocolumnaggregate.operator = this.aggregate ? this.aggregate : (this.functionAggregate ? this.functionAggregate : OTableColumnAggregateComponent.DEFAULT_AGGREGATE);
    this.table.registerColumnAggregate(ocolumnaggregate);

    this.subscription.add(this.table.onReinitialize.subscribe(() => this.table.registerColumnAggregate(ocolumnaggregate)));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
