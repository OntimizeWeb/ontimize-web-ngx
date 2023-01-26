import { OFilterBuilderComponent } from "../components/filter-builder/o-filter-builder.component";
import { OQueryDataArgs } from "../types/query-data-args.type";

export interface IServiceDataComponent {
  queryData(filter?: any, ovrrArgs?: OQueryDataArgs): void;
  reloadPaginatedDataFromStart(): void;
  reloadData(): void;
  setFilterBuilder(filterBuilder: OFilterBuilderComponent): void;
  pageable: boolean;
}
