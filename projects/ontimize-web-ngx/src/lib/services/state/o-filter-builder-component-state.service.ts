import { Injectable } from '@angular/core';
import { OFilterBuilderComponent } from '../../components';
import { OFilterBuilderStatus } from '../../types';
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

  storeFilter(newFilter: OFilterBuilderStatus) {
    const storedFilter = [...this.component.getFilterValues()];
    newFilter['filter-builder-values'] = storedFilter;
    this.state.addStoredFilter(newFilter);
  }

}

