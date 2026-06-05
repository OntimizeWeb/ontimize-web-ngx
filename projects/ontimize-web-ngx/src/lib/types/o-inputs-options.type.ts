import { SubscriptSizing } from '@angular/material/form-field';

export type OInputsColor = 'primary' | 'accent';

export type OInputsOptions = {
  iconColor?: OInputsColor,
  selectAllOnClick?: boolean,
  stringCase?: 'uppercase' | 'lowercase' | 'default';
  subscriptSizing?: SubscriptSizing;
};
