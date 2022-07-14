import { Injectable } from '@angular/core';
import { OFilterBuilderComponent } from '../../components';
import { AbstractComponentStateService } from './o-component-state.service';
import { OFilterBuilderComponentStateClass } from './o-filter-builder-component-state.class';

@Injectable()
export class OFilterBuilderComponentStateService extends AbstractComponentStateService<OFilterBuilderComponentStateClass, OFilterBuilderComponent> {

  initialize(component: OFilterBuilderComponent) {
    this.state = new OFilterBuilderComponentStateClass();
    super.initialize(component);
  }

  initializeState(state: OFilterBuilderComponentStateClass) {
    super.initializeState(state);
  }

  getDataToStore(): any {
    let dataToStore = Object.assign({}, this.state);

    return dataToStore;
  }

}


