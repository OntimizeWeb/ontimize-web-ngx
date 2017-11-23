import { Component, OnInit, forwardRef, Inject, Injector } from '@angular/core';
import { OTableComponent } from '../../../o-table.component';

export type AggregateFunction = (value: any[]) => number;

export const DEFAULT_TABLE_COLUMN_AGGREGATE = [
    // string
    'attr: attr',
    // string
    'aggregate:aggregate',
    //function
    'functionAggregate:function-aggregate'
];

@Component({
    selector: 'o-table-column-aggregate',
    templateUrl: './o-table-column-aggregate.component.html',
    styleUrls: ['./o-table-column-aggregate.component.scss'],
    inputs: DEFAULT_TABLE_COLUMN_AGGREGATE

})
export class OTableColumnAggregateComponent implements OnInit {
    public attr: string;
    public aggregate: string;
    public table: OTableComponent;
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
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.table.registerColumnAggregate(this);
    }
}
