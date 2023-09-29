import { Injectable } from '@angular/core';


import { AbstractComponentStateService } from './o-component-state.service';
import { OFormLayoutManagerComponentStateClass } from './o-form-layout-manager-component-state.class';
import { OFormLayoutManagerBase } from '../../layouts/form-layout/o-form-layout-manager-base.class';

@Injectable()
export class OFormLayoutManagerComponentStateService extends AbstractComponentStateService<OFormLayoutManagerComponentStateClass, OFormLayoutManagerBase> {

  initialize(component: OFormLayoutManagerBase) {
    this.state = new OFormLayoutManagerComponentStateClass();
    super.initialize(component);
  }

  initializeState(state: OFormLayoutManagerComponentStateClass) {
    super.initializeState(state);
  }

}
