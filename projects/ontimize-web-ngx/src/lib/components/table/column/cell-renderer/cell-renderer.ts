import { OTableCellRendererActionComponent, DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_ACTION, DEFAULT_OUTPUTS_O_TABLE_CELL_RENDERER_ACTION } from './action/o-table-cell-renderer-action.component';
import { OTableCellRendererBooleanComponent, DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_BOOLEAN } from './boolean/o-table-cell-renderer-boolean.component';
import { OTableCellRendererCurrencyComponent, DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_CURRENCY } from './currency/o-table-cell-renderer-currency.component';
import { OTableCellRendererDateComponent, DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_DATE } from './date/o-table-cell-renderer-date.component';
import { OTableCellRendererImageComponent, DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_IMAGE } from './image/o-table-cell-renderer-image.component';
import { OTableCellRendererIntegerComponent } from './integer/o-table-cell-renderer-integer.component';
import { OTableCellRendererPercentageComponent } from './percentage/o-table-cell-renderer-percentage.component';
import { OTableCellRendererRealComponent } from './real/o-table-cell-renderer-real.component';
import { OTableCellRendererServiceComponent, DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_SERVICE } from './service/o-table-cell-renderer-service.component';
import { OTableCellRendererTimeComponent } from './time/o-table-cell-renderer-time.component';
import { OTableCellRendererTranslateComponent, DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_TRANSLATE } from './translate/o-table-cell-renderer-translate.component';

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

export const O_TABLE_CELL_RENDERERS_INPUTS = [
  ...DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_BOOLEAN,
  ...DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_CURRENCY, // includes Integer and Real
  ...DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_DATE,
  ...DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_IMAGE,
  ...DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_ACTION,
  ...DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_SERVICE,
  ...DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_TRANSLATE
];

export const O_TABLE_CELL_RENDERERS_OUTPUTS = [
  ...DEFAULT_OUTPUTS_O_TABLE_CELL_RENDERER_ACTION
];

export const renderersMapping = {
  action: OTableCellRendererActionComponent,
  boolean: OTableCellRendererBooleanComponent,
  currency: OTableCellRendererCurrencyComponent,
  date: OTableCellRendererDateComponent,
  image: OTableCellRendererImageComponent,
  integer: OTableCellRendererIntegerComponent,
  percentage: OTableCellRendererPercentageComponent,
  real: OTableCellRendererRealComponent,
  service: OTableCellRendererServiceComponent,
  translate: OTableCellRendererTranslateComponent,
  time: OTableCellRendererTimeComponent
};
