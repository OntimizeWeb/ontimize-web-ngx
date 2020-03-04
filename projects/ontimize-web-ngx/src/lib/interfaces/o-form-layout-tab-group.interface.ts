import { ElementRef, EventEmitter } from '@angular/core';

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
  getFormCacheData: (idArg: string) => FormLayoutDetailComponentData;
  getLastTabId: () => string;
  setModifiedState: (modified: boolean, id: string) => void;
  updateNavigation: (data: any, id: string, insertionMode?: boolean) => void;
  updateActiveData: (data: any) => void;
  getRouteOfActiveItem: () => any[];
}
