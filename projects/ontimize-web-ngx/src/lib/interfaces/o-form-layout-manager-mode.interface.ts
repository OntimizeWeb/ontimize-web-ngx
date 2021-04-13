import { EventEmitter } from '@angular/core';

import { OServiceComponent } from '../components/o-service-component.class';
import { FormLayoutDetailComponentData } from '../types/form-layout-detail-component-data.type';

export interface OFormLayoutManagerMode {
  data: any | any[];
  getParams: () => any;
  initializeComponentState?: (state: any) => void;
  getDataToStore: () => object;
  getFormCacheData: () => FormLayoutDetailComponentData;
  setModifiedState: (modified: boolean) => void;
  updateNavigation: (data: any, keysValues: any, insertionMode?: boolean) => void;
  updateActiveData: (data: any) => void;
  getRouteOfActiveItem: () => any[];
  isMainComponent: (comp: OServiceComponent) => boolean;
  openDetail?: (detail: FormLayoutDetailComponentData) => void;
  closeDetail: () => void;
}
