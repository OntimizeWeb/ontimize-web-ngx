import { AggregateFunction } from "../types/aggregate-function.type";

export interface GroupedColumnAggregateConfiguration {
  attr: string;
  title?: string;
  aggregateName?: string;
  aggregate: string;
  aggregateFunction?: AggregateFunction;
}

export interface OTableColumnsGrouping {
  columnsArray: string[];
  getColumnGrouping(columnAttr);
  useColumnAggregate(columnAttr: string, hasDefaultAggregate: boolean): boolean;
}
