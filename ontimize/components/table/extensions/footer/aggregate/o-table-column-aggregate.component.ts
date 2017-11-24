import { Component, OnInit, forwardRef, Inject, Injector } from '@angular/core';
import { OTableComponent } from '../../../o-table.component';



export class OColumnAggregate {
    title: string;
    attr: string;
    operator: string | AggregateFunction;
}

export type AggregateFunction = (value: any[]) => number;

export const DEFAULT_TABLE_COLUMN_AGGREGATE = [
    // attr [string]: column name.
    'attr: attr',

    // title [string]: Title for the header total column
    'title: title',

    //aggregate [sum | count | avg | min |max]
    'aggregate:aggregate',

    //function-aggregate [ (value: any[]) => number] Function that calculates a value on the values of the column 'attr'
    'functionAggregate:function-aggregate'
];

@Component({
    selector: 'o-table-column-aggregate',
    templateUrl: './o-table-column-aggregate.component.html',
    inputs: DEFAULT_TABLE_COLUMN_AGGREGATE

})
export class OTableColumnAggregateComponent implements OnInit {
    public attr: string;
    public aggregate: string;
    public table: OTableComponent;
    public title: string = '';
    protected _aggregateFunction: AggregateFunction;
    public static DEFAULT_AGGREGATE = 'SUM';

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

        let ocolumnaggregate: OColumnAggregate = new OColumnAggregate();
        ocolumnaggregate.attr = this.attr;
        if (this.title) {
            ocolumnaggregate.title = this.title;
        }

        ocolumnaggregate.operator = this.aggregate ? this.aggregate : (this.functionAggregate ? this.functionAggregate : OTableColumnAggregateComponent.DEFAULT_AGGREGATE);
        this.table.registerColumnAggregate(ocolumnaggregate);
    }
}
