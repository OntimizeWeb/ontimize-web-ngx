export * from './paginator/o-table-paginator.component';
export * from './aggregate/o-table-column-aggregate.component';

import { OTablePaginatorComponent } from './paginator/o-table-paginator.component';
import { OTableColumnAggregateComponent } from './aggregate/o-table-column-aggregate.component';

export const O_TABLE_FOOTER_COMPONENTS = [
  OTablePaginatorComponent,
  OTableColumnAggregateComponent
];
