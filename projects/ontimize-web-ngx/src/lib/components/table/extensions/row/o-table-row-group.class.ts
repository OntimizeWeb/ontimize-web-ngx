import { Subject } from 'rxjs';

import { GroupedColumnAggregateConfiguration } from '../../../../interfaces/o-table-columns-grouping-interface';
import { Util } from '../../../../util/util';
import {
  OTableColumnsGroupingColumnComponent
} from '../header/table-columns-grouping/columns/o-table-columns-grouping-column.component';

export type AggregateChangeArg = {
  columnAttr: string;
  activeAggregate: string;
  changeAllGroupedRows: boolean;
  row: OTableGroupedRow;
}

export type AggregateColumnData = {
  component: OTableColumnsGroupingColumnComponent;
  activeAggregate: string;
  value: any;
  data: any[];
}

export class OTableGroupedRow {
  column: string;
  title: string;
  groupData: any[];
  level = 0;
  keysAsString: string;
  parent: OTableGroupedRow;
  expanded = true;
  get visible(): boolean {
    return !this.parent || (this.parent.visible && this.parent.expanded);
  }
  private columnsData: { [key: string]: AggregateColumnData } = {};

  aggregateFunctionChange: Subject<AggregateChangeArg> = new Subject<AggregateChangeArg>();

  constructor(arg?: any) {
    if (Util.isDefined(arg)) {
      this.column = arg.column;
      this.keysAsString = arg.keysAsString;
      this.level = arg.level;
      this.parent = arg.parent;
    }
  }

  hasColumnData(columnAttr: string): boolean {
    return Util.isDefined(this.columnsData[columnAttr]);
  }

  hasActiveAggregate(columnAttr: string): boolean {
    return this.hasColumnData(columnAttr) && Util.isDefined(this.columnsData[columnAttr].activeAggregate);
  }

  getColumnGroupingComponent(columnAttr: string): OTableColumnsGroupingColumnComponent {
    return this.hasColumnData(columnAttr) ? this.columnsData[columnAttr].component : null;
  }

  getColumnAggregateValue(columnAttr: string): any {
    return this.columnsData[columnAttr].value;
  }

  setColumnAggregateValue(columnAttr: string, value: any) {
    this.columnsData[columnAttr].value = value;
  }

  expandSameLevel(defaultValue: boolean): boolean {
    if (!this.hasColumnData(this.column)) {
      return defaultValue;
    }
    const groupingComponent = this.getColumnGroupingComponent(this.column);
    if (Util.isDefined(groupingComponent)) {
      return groupingComponent.expandGroupsSameLevel;
    }
    return defaultValue;
  }

  setColumnAggregateData(columnAttr: string, value: any[]) {
    if (this.hasColumnData(columnAttr)) {
      this.columnsData[columnAttr].data = value;
    }
  }

  getColumnAggregateData(columnAttr: string) {
    return this.hasColumnData(columnAttr) ? this.columnsData[columnAttr].data : [];
  }

  setColumnActiveAggregateFunction(columnAttr: string, aggregateFnName: string, emitEvent: boolean = true) {
    if (this.hasColumnData(columnAttr)) {
      this.columnsData[columnAttr].activeAggregate = aggregateFnName;
    } else {
      this.columnsData[columnAttr] = {
        component: null,
        activeAggregate: aggregateFnName,
        value: null,
        data: []
      };
    }
    if (emitEvent) {
      let changeAllGroupedRows = true;
      const groupingComponent = this.getColumnGroupingComponent(columnAttr);
      if (Util.isDefined(groupingComponent)) {
        changeAllGroupedRows = groupingComponent.changeAggregateSameLevel;
      }

      this.aggregateFunctionChange.next({
        columnAttr: columnAttr,
        activeAggregate: aggregateFnName,
        changeAllGroupedRows: changeAllGroupedRows,
        row: this
      });
    }
  }

  getColumnActiveAggregateTitle(columnAttr: string) {
    const conf = this.getActiveColumnAggregateConfiguration(columnAttr);
    if (conf.title) {
      return conf.title;
    }
    return `AGGREGATE_NAME.${conf.aggregateName || conf.aggregate}`;
  }

  initializeColumnAggregate(columnAttr: string, component: OTableColumnsGroupingColumnComponent) {
    if (!this.columnsData.hasOwnProperty(columnAttr)) {
      this.columnsData[columnAttr] = {
        component: null,
        activeAggregate: 'sum',
        value: null,
        data: []
      };
    }
    if (Util.isDefined(component)) {
      this.columnsData[columnAttr].component = component;
      this.columnsData[columnAttr].activeAggregate = component.aggregate;
    }
  }

  getActiveColumnAggregateConfiguration(columnAttr: string): GroupedColumnAggregateConfiguration {
    if (!this.hasColumnData(columnAttr)) {
      return {
        attr: columnAttr,
        aggregate: 'sum'
      }
    }

    const activeAggregate = this.columnsData[columnAttr].activeAggregate;
    const groupingColumnComponent = this.columnsData[columnAttr].component;
    if (Util.isDefined(groupingColumnComponent) && groupingColumnComponent.aggregate === activeAggregate) {
      return groupingColumnComponent.getAggregateConfiguration();
    }

    return {
      attr: columnAttr,
      aggregate: this.columnsData[columnAttr].activeAggregate
    }
  }

}
