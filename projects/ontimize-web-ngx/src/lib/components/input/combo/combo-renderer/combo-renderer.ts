// import { DEFAULT_OUTPUTS_O_TABLE_CELL_RENDERER_ACTION } from './action/o-table-cell-renderer-action.component';
import {
  DEFAULT_INPUTS_O_COMBO_RENDERER_CURRENCY,
  OComboRendererCurrencyComponent
} from './currency/o-combo-renderer-currency.component';
import { OComboRendererIntegerComponent } from './integer/o-combo-renderer-integer.component';
import { OComboRendererRealComponent } from './real/o-combo-renderer-real.component';

// import { OTableCellRendererBooleanComponent } from './boolean/o-table-cell-renderer-boolean.component';
// import { OTableCellRendererDateComponent } from './date/o-table-cell-renderer-date.component';
// import { OTableCellRendererImageComponent } from './image/o-table-cell-renderer-image.component';
// import { OTableCellRendererIntegerComponent } from './integer/o-table-cell-renderer-integer.component';
// import { OTableCellRendererPercentageComponent } from './percentage/o-table-cell-renderer-percentage.component';
// import { OTableCellRendererRealComponent } from './real/o-table-cell-renderer-real.component';
// import { OTableCellRendererServiceComponent } from './service/o-table-cell-renderer-service.component';
// import { OTableCellRendererTimeComponent } from './time/o-table-cell-renderer-time.component';
// import { OTableCellRendererTranslateComponent } from './translate/o-table-cell-renderer-translate.component';

export const O_COMBO_RENDERERS = [
  // OTableCellRendererActionComponent,
  // OTableCellRendererDateComponent,
  // OTableCellRendererBooleanComponent,
  // OTableCellRendererImageComponent,
  OComboRendererIntegerComponent,
  OComboRendererRealComponent,
  OComboRendererCurrencyComponent,
  // OTableCellRendererPercentageComponent,
  // OTableCellRendererServiceComponent,
  // OTableCellRendererTranslateComponent,
  // OTableCellRendererTimeComponent
];

export const O_COMBO_RENDERERS_INPUTS = [
  ...DEFAULT_INPUTS_O_COMBO_RENDERER_CURRENCY, // includes Integer and Real
];

export const O_COMBO_RENDERERS_OUTPUTS = [
];

export const renderersMapping = {
  integer: OComboRendererIntegerComponent,
  real: OComboRendererRealComponent,
  currency: OComboRendererCurrencyComponent,
  // action: OTableCellRendererActionComponent,
  // boolean: OTableCellRendererBooleanComponent,
  // date: OTableCellRendererDateComponent,
  // image: OTableCellRendererImageComponent,
  // percentage: OTableCellRendererPercentageComponent,
  // service: OTableCellRendererServiceComponent,
  // translate: OTableCellRendererTranslateComponent,
  // time: OTableCellRendererTimeComponent
};
