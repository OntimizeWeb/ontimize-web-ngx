import { UntypedFormControl } from '@angular/forms';

import { IComponent } from './component.interface';

export interface IFormControlComponent extends IComponent {
  getControl(): UntypedFormControl;
  getFormControl(): UntypedFormControl;
  hasError(error: string): boolean;
}
