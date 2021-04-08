import { ElementRef, EventEmitter } from '@angular/core';

import { OServiceComponent } from '../components/o-service-component.class';
import { FormLayoutDetailComponentData } from '../types/form-layout-detail-component-data.type';

export interface OFormLayoutTabGroup {
  elementRef: ElementRef;
  data: FormLayoutDetailComponentData[];
  selectedTabIndex: number;
  state: any;
  onSelectedTabChange: EventEmitter<any>;
  onCloseTab: EventEmitter<any>;
  getParams: () => any;
  initializeComponentState: (state: any) => void;
  getDataToStore: () => object;
  addTab: (compData: FormLayoutDetailComponentData) => void;
  closeTab: (id: string) => void;
  getFormCacheData: () => FormLayoutDetailComponentData;
  getLastTabId: () => string;
  setModifiedState: (modified: boolean) => void;
  updateNavigation: (data: any, insertionMode?: boolean) => void;
  updateActiveData: (data: any) => void;
  getRouteOfActiveItem: () => any[];
  isMainComponent: (comp: OServiceComponent) => boolean;
}
