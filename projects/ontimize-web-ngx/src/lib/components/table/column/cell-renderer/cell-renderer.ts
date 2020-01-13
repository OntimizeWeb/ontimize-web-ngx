import { OTableCellRendererActionComponent } from './action/o-table-cell-renderer-action.component';
import { OTableCellRendererBooleanComponent } from './boolean/o-table-cell-renderer-boolean.component';
import { OTableCellRendererCurrencyComponent } from './currency/o-table-cell-renderer-currency.component';
import { OTableCellRendererDateComponent } from './date/o-table-cell-renderer-date.component';
import { OTableCellRendererImageComponent } from './image/o-table-cell-renderer-image.component';
import { OTableCellRendererIntegerComponent } from './integer/o-table-cell-renderer-integer.component';
import { OTableCellRendererPercentageComponent } from './percentage/o-table-cell-renderer-percentage.component';
import { OTableCellRendererRealComponent } from './real/o-table-cell-renderer-real.component';
import { OTableCellRendererServiceComponent } from './service/o-table-cell-renderer-service.component';
import { OTableCellRendererTimeComponent } from './time/o-table-cell-renderer-time.component';
import { OTableCellRendererTranslateComponent } from './translate/o-table-cell-renderer-translate.component';

export * from './action/o-table-cell-renderer-action.component';
export * from './boolean/o-table-cell-renderer-boolean.component';
export * from './currency/o-table-cell-renderer-currency.component';
export * from './date/o-table-cell-renderer-date.component';
export * from './image/o-table-cell-renderer-image.component';
export * from './integer/o-table-cell-renderer-integer.component';
export * from './percentage/o-table-cell-renderer-percentage.component';
export * from './real/o-table-cell-renderer-real.component';
export * from './service/o-table-cell-renderer-service.component';

export * from './o-base-table-cell-renderer.class';
export * from './time/o-table-cell-renderer-time.component';

export const O_TABLE_CELL_RENDERERS = [
  OTableCellRendererActionComponent,
  OTableCellRendererDateComponent,
  OTableCellRendererBooleanComponent,
  OTableCellRendererImageComponent,
  OTableCellRendererIntegerComponent,
  OTableCellRendererRealComponent,
  OTableCellRendererCurrencyComponent,
  OTableCellRendererPercentageComponent,
  OTableCellRendererServiceComponent,
  OTableCellRendererTranslateComponent,
  OTableCellRendererTimeComponent
];
