import { FormControl } from '@angular/forms';

import { IComponent } from './component.interface';

export interface IFormControlComponent extends IComponent {
  getControl(): FormControl;
  getFormControl(): FormControl;
  hasError(error: string): boolean;
}
