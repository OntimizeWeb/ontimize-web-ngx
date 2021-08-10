import { FormLayoutDetailComponentData } from '../types/form-layout-detail-component-data.type';
import { ILayoutManagerComponent } from './layout-manager-component.interface';

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
  isMainComponent: (comp: ILayoutManagerComponent) => boolean;
  openDetail?: (detail: FormLayoutDetailComponentData) => void;
  closeDetail: () => void;
  canAddDetailComponent: () => boolean;
}
