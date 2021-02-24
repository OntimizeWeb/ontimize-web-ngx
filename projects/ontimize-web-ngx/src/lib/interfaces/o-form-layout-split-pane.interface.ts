import { ElementRef } from '@angular/core';

import { FormLayoutDetailComponentData } from '../types/form-layout-detail-component-data.type';

export interface OFormLayoutSplitPane {
  elementRef: ElementRef;
  getFormCacheData: () => FormLayoutDetailComponentData;
  setDetailComponent: (compData: FormLayoutDetailComponentData) => void;
  setModifiedState: (modified: boolean) => void;
}
