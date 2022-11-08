import { Injectable } from '@angular/core';
import { OFilterBuilderComponent } from '../../components';
import { OTableFiltersStatus, OTableStoredFilter } from '../../types/table/o-table-filter-status.type';
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

  storeFilter(newFilter: OTableFiltersStatus) {
    const storedFilter = {}
    Object.assign(storedFilter, this.component.getFilterValues());
    newFilter['filter-builder-values'] = storedFilter as OTableStoredFilter;
    this.state.addStoredFilter(newFilter);
  }

}


