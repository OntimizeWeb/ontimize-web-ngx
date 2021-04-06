// import { DEFAULT_OUTPUTS_O_TABLE_CELL_RENDERER_ACTION } from './action/o-table-cell-renderer-action.component';
import {
  DEFAULT_INPUTS_O_COMBO_RENDERER_BOOLEAN,
  OComboRendererBooleanComponent
} from './boolean/o-combo-renderer-boolean.component';
import { OComboRendererCountryFlagComponent } from './country-flag/o-combo-renderer-country-flag.component';
import {
  DEFAULT_INPUTS_O_COMBO_RENDERER_CURRENCY,
  OComboRendererCurrencyComponent
} from './currency/o-combo-renderer-currency.component';
import { DEFAULT_INPUTS_O_COMBO_RENDERER_DATE, OComboRendererDateComponent } from './date/o-combo-renderer-date.component';
import { OComboRendererIntegerComponent } from './integer/o-combo-renderer-integer.component';
import {
  DEFAULT_INPUTS_O_COMBO_RENDERER_PERCENTAGE,
  OComboRendererPercentageComponent
} from './percentage/o-combo-renderer-percentage.component';
import { OComboRendererRealComponent } from './real/o-combo-renderer-real.component';

export const O_COMBO_RENDERERS = [
  OComboRendererBooleanComponent,
  OComboRendererIntegerComponent,
  OComboRendererRealComponent,
  OComboRendererCurrencyComponent,
  OComboRendererDateComponent,
  OComboRendererPercentageComponent,
  OComboRendererCountryFlagComponent
];

export const O_COMBO_RENDERERS_INPUTS = [
  ...DEFAULT_INPUTS_O_COMBO_RENDERER_CURRENCY, // includes Integer and Real
  ...DEFAULT_INPUTS_O_COMBO_RENDERER_BOOLEAN,
  ...DEFAULT_INPUTS_O_COMBO_RENDERER_DATE,
  ...DEFAULT_INPUTS_O_COMBO_RENDERER_PERCENTAGE
];

export const O_COMBO_RENDERERS_OUTPUTS = [
];

export const renderersMapping = {
  integer: OComboRendererIntegerComponent,
  real: OComboRendererRealComponent,
  currency: OComboRendererCurrencyComponent,
  boolean: OComboRendererBooleanComponent,
  date: OComboRendererDateComponent,
  percentage: OComboRendererPercentageComponent,
  countryFlag: OComboRendererCountryFlagComponent
};
