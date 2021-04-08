import { ComponentFactoryResolver, Injector } from '@angular/core';

import { OServiceComponent } from '../../components/o-service-component.class';
import { FormLayoutDetailComponentData } from '../../types/form-layout-detail-component-data.type';
import { OFormLayoutManagerComponent } from './o-form-layout-manager.component';

export class OBaseFormLayoutManagerInstanceClass {

  constructor(
    protected injector: Injector,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected formLayoutManager: OFormLayoutManagerComponent
  ) {
  }

  getParams(): any {
    return null;
  }

  initializeComponentState(state: any) {

  }

  getDataToStore() {
    return {};
  };

  getFormCacheData(): FormLayoutDetailComponentData {
    return null
  }

  setModifiedState(modified: boolean) {

  }

  updateNavigation(data: any, keysValues: any, insertionMode: boolean) {

  }

  updateActiveData(data: any) {

  }

  getRouteOfActiveItem(): any[] {
    return [];
  }

  isMainComponent(comp: OServiceComponent): boolean {
    return false;
  }

  openDetail(detail: FormLayoutDetailComponentData) {

  }

  closeDetail() {

  }
}
