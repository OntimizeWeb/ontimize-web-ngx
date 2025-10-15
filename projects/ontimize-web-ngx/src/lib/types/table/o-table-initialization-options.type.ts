import { ServiceResponse } from "../../interfaces";
import { PaginationData } from "../../interfaces/pagination-data.interface";

export type OTableInitializationOptions = {
  entity?: string;
  service?: string;
  columns?: string;
  visibleColumns?: string;
  defaultVisibleColumns?: string;
  keys?: string;
  sortColumns?: string;
  parentKeys?: string;
  filterColumns?: string;
  data?: ServiceResponse;
  paginationData?: PaginationData;
};
