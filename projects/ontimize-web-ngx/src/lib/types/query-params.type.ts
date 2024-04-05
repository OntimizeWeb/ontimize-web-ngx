import { OQueryDataArgs } from "./query-data-args.type";
import { SQLOrder } from "./sql-order.type";

export type OQueryParams = {
  filters: Object;
  columns: string[];
  entity: string;
  pageable: boolean;
  sqlTypes: Object;
  sort: SQLOrder[];
  ovrrArgs: OQueryDataArgs
}
