import { Subject } from 'rxjs';

import {
  OTableColumnsGroupingColumnComponent
} from '../../components/table/extensions/header/table-columns-grouping/columns/o-table-columns-grouping-column.component';
import { GroupedColumnAggregateConfiguration } from '../../interfaces/o-table-columns-grouping-interface';
import { Util } from '../../util/util';

export type AggregateChangeArg = {
  columnAttr: string;
  activeAggregate: string;
  changeAllGroupedRows: boolean;
  row: OTableGroupedRow;
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
  private columnsData: {
    [key: string]: {
      component: OTableColumnsGroupingColumnComponent,
      activeAggregate: string,
      value: any,
      data: any[]
    }
  } = {};

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
    if (Util.isDefined(this.columnsData[this.column].component)) {
      return this.columnsData[this.column].component.expandGroupsSameLevel;
    }
    return defaultValue;
  }

  setColumnAggregateData(columnAttr: string, value: any[]) {
    this.columnsData[columnAttr].data = value;
  }

  getColumnAggregateData(columnAttr: string) {
    if (Util.isDefined(this.columnsData[columnAttr])) {
      return this.columnsData[columnAttr].data;
    }
    return [];
  }

  setColumnActiveAggregateFunction(columnAttr: string, aggregateFnName: string, emitEvent: boolean = true) {
    if (Util.isDefined(this.columnsData[columnAttr])) {
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
      if (Util.isDefined(this.columnsData[columnAttr].component)) {
        changeAllGroupedRows = this.columnsData[columnAttr].component.changeAggregateSameLevel;
      }

      this.aggregateFunctionChange.next({
        columnAttr: columnAttr,
        activeAggregate: aggregateFnName,
        changeAllGroupedRows: changeAllGroupedRows,
        row: this
      });
    }
  }

  getColumnActiveAggregateFunction(columnAttr: string) {
    if (Util.isDefined(this.columnsData[columnAttr])) {
      return this.columnsData[columnAttr].activeAggregate;
    }
    return null;
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

  getColumnCustomAggregateName(columnAttr: string): string {
    const columnConf = this.columnsData[columnAttr];
    if (Util.isDefined(columnConf) &&
      Util.isDefined(columnConf.component) &&
      Util.isDefined(columnConf.component.aggregateFunction)) {
      return columnConf.component.aggregateName;
    }
    return null;
  }

  getColumnAggregateConfiguration(columnAttr: string): GroupedColumnAggregateConfiguration {
    if (!Util.isDefined(this.columnsData[columnAttr])) {
      return {
        attr: columnAttr,
        aggregate: 'sum'
      }
    }
    return {
      attr: columnAttr,
      aggregate: this.columnsData[columnAttr].activeAggregate
    }
  }
}
