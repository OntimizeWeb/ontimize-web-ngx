import { SQLTypes } from "../util/sqltypes";
import { BasicExpression } from "./basic-expression.type";
import { SQLOrder } from "./sql-order.type";

export type QueryParameter = {
  columns: string[];
  sqltypes: { [key: string]: SQLTypes; };
  offset: number;
  pageSize: number;
  filter: BasicExpression,
  orderBy: SQLOrder
}