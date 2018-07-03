export * from './paginator/o-table-paginator.component';
export * from './aggregate/o-table-column-aggregate.component';
export * from './aggregate/o-table-aggregate/o-table-aggregate.component';

import { OTableColumnAggregateComponent } from './aggregate/o-table-column-aggregate.component';
import { OTableAggregateComponent } from './aggregate/o-table-aggregate/o-table-aggregate.component';

export const O_TABLE_FOOTER_COMPONENTS = [
  OTableColumnAggregateComponent,
  OTableAggregateComponent
];
