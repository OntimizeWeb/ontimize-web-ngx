import { ElementRef } from '@angular/core';

import type { OFormLayoutDialogComponent } from '../layouts/form-layout/dialog/o-form-layout-dialog.component';

export interface ILayoutManagerComponent {
  oFormLayoutDialog: OFormLayoutDialogComponent;
  elementRef: ElementRef;
}
