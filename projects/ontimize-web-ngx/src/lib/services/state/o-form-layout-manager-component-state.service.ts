import { Injectable } from '@angular/core';

import { OFormLayoutManagerComponent } from '../../layouts';
import { AbstractComponentStateService } from './o-component-state.service';
import { OFormLayoutManagerComponentStateClass } from './o-form-layout-manager-component-state.class';

@Injectable()
export class OFormLayoutManagerComponentStateService extends AbstractComponentStateService<OFormLayoutManagerComponentStateClass, OFormLayoutManagerComponent> {

  initialize(component: OFormLayoutManagerComponent) {
    this.state = new OFormLayoutManagerComponentStateClass();
    super.initialize(component);
  }

  initializeState(state: OFormLayoutManagerComponentStateClass) {
    super.initializeState(state);
  }

}
