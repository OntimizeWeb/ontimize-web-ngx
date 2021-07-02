import { Injectable } from '@angular/core';

import { OListComponent } from '../../components/list/o-list.component';
import { Codes } from '../../util/codes';
import { Util } from '../../util/util';
import { AbstractComponentStateService } from './o-component-state.service';
import { OListComponentStateClass } from './o-list-component-state.class';


@Injectable()
export class OListComponentStateService extends AbstractComponentStateService<OListComponentStateClass, OListComponent> {

  initialize(component: OListComponent) {
    this.state = new OListComponentStateClass();
    super.initialize(component);
  }

  initializeState(state: OListComponentStateClass) {
    super.initializeState(state);
  }

  getDataToStore(): any {
    let dataToStore = Object.assign({}, this.state);
    dataToStore['query-rows'] = this.component.queryRows;
    if (!this.component.storePaginationState) {
      delete dataToStore['queryRecordOffset'];
    }
    if (this.component.quickFilter && Util.isDefined(this.component.quickFilterComponent)) {
      dataToStore['quickFilterActiveColumns'] = this.component.quickFilterComponent.getActiveColumns().join(Codes.ARRAY_INPUT_SEPARATOR);
    }
    dataToStore['filter-case-sensitive'] = this.component.isFilterCaseSensitive();
    return dataToStore;
  }

}


