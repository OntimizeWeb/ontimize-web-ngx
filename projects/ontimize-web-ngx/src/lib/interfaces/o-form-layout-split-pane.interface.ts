import { ElementRef } from '@angular/core';

import { OServiceComponent } from '../components/o-service-component.class';
import { FormLayoutDetailComponentData } from '../types/form-layout-detail-component-data.type';

export interface OFormLayoutSplitPane {
  elementRef: ElementRef;
  data: FormLayoutDetailComponentData;
  getParams: () => any;
  initializeComponentState: (state: any) => void;
  getDataToStore: () => object;
  getFormCacheData: () => FormLayoutDetailComponentData;
  setDetailComponent: (compData: FormLayoutDetailComponentData) => void;
  setModifiedState: (modified: boolean) => void;
  updateActiveData: (data: any) => void;
  getRouteOfActiveItem: () => any[];
  isMainComponent: (comp: OServiceComponent) => boolean;
}
