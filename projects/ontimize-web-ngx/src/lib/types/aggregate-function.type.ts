import type { OTableComponent } from '../components/table/o-table.component';

export type AggregateFunction = (value: any[], columnAttr?: string, table?: OTableComponent) => number | Promise<number>;
