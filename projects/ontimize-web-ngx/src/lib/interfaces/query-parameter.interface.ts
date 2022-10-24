import { SQLTypes } from "../util/sqltypes";
import { BasicExpression } from "../types/basic-expression.type";
import { SQLOrder } from "../types/sql-order.type";

export interface QueryParameter  {
  columns: string[];
  sqltypes: { [key: string]: SQLTypes; };
  filter: BasicExpression,
}
export interface AdvancedQueryParameter extends QueryParameter  {
  offset: number;
  pageSize: number;
  filter: BasicExpression,
  orderBy: SQLOrder
}