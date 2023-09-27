import { Injectable } from '@angular/core';
import { OFilterBuilderStatus } from '../../types';
import { AbstractComponentStateService } from './o-component-state.service';
import { OFilterBuilderComponentStateClass } from './o-filter-builder-component-state.class';
import { OFilterBuilderBase } from '../../components/filter-builder/o-filter-builder-base.class';

@Injectable()
export class OFilterBuilderComponentStateService extends AbstractComponentStateService<OFilterBuilderComponentStateClass, OFilterBuilderBase> {

  initialize(component: OFilterBuilderBase) {
    this.state = new OFilterBuilderComponentStateClass();
    super.initialize(component);
  }

  initializeState(state: OFilterBuilderComponentStateClass) {
    super.initializeState(state);
  }

  storeFilter(filter: OFilterBuilderStatus) {
    let newFilter: OFilterBuilderStatus = { name: filter.name, description: filter.description };
    const storedFilter = [...this.component.getFilterValues()];
    newFilter['filter-builder-values'] = storedFilter;
    this.state.addStoredFilter(newFilter);
  }

}

