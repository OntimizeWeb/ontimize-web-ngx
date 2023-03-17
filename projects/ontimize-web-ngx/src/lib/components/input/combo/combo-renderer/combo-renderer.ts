import {
  OComboRendererBooleanComponent
} from './boolean/o-combo-renderer-boolean.component';
import {
  OComboRendererCurrencyComponent
} from './currency/o-combo-renderer-currency.component';
import { OComboRendererDateComponent } from './date/o-combo-renderer-date.component';
import { OComboRendererIconComponent } from './icon/o-combo-renderer-icon.component';
import { OComboRendererIntegerComponent } from './integer/o-combo-renderer-integer.component';
import {
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
  OComboRendererIconComponent
];

export const renderersMapping = {
  integer: OComboRendererIntegerComponent,
  real: OComboRendererRealComponent,
  currency: OComboRendererCurrencyComponent,
  boolean: OComboRendererBooleanComponent,
  date: OComboRendererDateComponent,
  percentage: OComboRendererPercentageComponent,
  icon: OComboRendererIconComponent
};
