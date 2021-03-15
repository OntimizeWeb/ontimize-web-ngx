import {
  DEFAULT_INPUTS_O_LISTPICKER_RENDERER_CURRENCY,
  OListPickerRendererCurrencyComponent
} from './currency/o-listpicker-renderer-currency.component';
import {
  DEFAULT_INPUTS_O_LISTPICKER_RENDERER_DATE,
  OListPickerRendererDateComponent
} from './date/o-listpicker-renderer-date.component';
import { OListPickerRendererIntegerComponent } from './integer/o-listpicker-renderer-integer.component';
import {
  DEFAULT_INPUTS_O_LISTPICKER_RENDERER_PERCENTAGE,
  OListPickerRendererPercentageComponent
} from './percentage/o-listpicker-renderer-percentage.component';
import { OListPickerRendererRealComponent } from './real/o-listpicker-renderer-real.component';

export const O_LISTPICKER_RENDERERS = [
  OListPickerRendererIntegerComponent,
  OListPickerRendererRealComponent,
  OListPickerRendererCurrencyComponent,
  OListPickerRendererDateComponent,
  OListPickerRendererPercentageComponent
];

export const O_LISTPICKER_RENDERERS_INPUTS = [
  ...DEFAULT_INPUTS_O_LISTPICKER_RENDERER_CURRENCY, // includes Integer and Real
  ...DEFAULT_INPUTS_O_LISTPICKER_RENDERER_DATE,
  ...DEFAULT_INPUTS_O_LISTPICKER_RENDERER_PERCENTAGE
];

export const O_LISTPICKER_RENDERERS_OUTPUTS = [
];

export const renderersMapping = {
  integer: OListPickerRendererIntegerComponent,
  real: OListPickerRendererRealComponent,
  currency: OListPickerRendererCurrencyComponent,
  date: OListPickerRendererDateComponent,
  percentage: OListPickerRendererPercentageComponent
};
