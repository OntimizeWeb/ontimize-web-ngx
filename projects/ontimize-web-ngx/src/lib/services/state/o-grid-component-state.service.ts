import { Injectable } from '@angular/core';

import { OGridComponent } from '../../components/grid/o-grid.component';
import { Codes } from '../../util/codes';
import { Util } from '../../util/util';
import { AbstractComponentStateService } from './o-component-state.service';
import { OGridComponentStateClass } from './o-grid-component-state.class';

@Injectable()
export class OGridComponentStateService extends AbstractComponentStateService<OGridComponentStateClass, OGridComponent> {

  initialize(component: OGridComponent) {
    this.state = new OGridComponentStateClass();
    super.initialize(component);
  }

  initializeState(state: OGridComponentStateClass) {
    super.initializeState(state);
  }

  getDataToStore(): any {
    const dataToStore = Object.assign({}, this.state);
    dataToStore['query-rows'] = this.component.queryRows;
    dataToStore['currentPage'] = this.component.currentPage;

    if (this.component.storePaginationState) {
      dataToStore['queryRecordOffset'] = Math.max(
        (this.state.queryRecordOffset - this.component.dataArray.length),
        (this.state.queryRecordOffset - this.component.queryRows)
      );
    } else {
      delete dataToStore['queryRecordOffset'];
    }

    if (Util.isDefined(this.component.sortColumnOrder)) {
      dataToStore['sort-column'] = this.component.sortColumnOrder.columnName + Codes.COLUMNS_ALIAS_SEPARATOR +
        (this.component.sortColumnOrder.ascendent ? Codes.ASC_SORT : Codes.DESC_SORT);
    }
    dataToStore['filter-case-sensitive'] = this.component.isFilterCaseSensitive();

    if (this.component.quickFilter && Util.isDefined(this.component.quickFilterComponent)) {
      dataToStore['quickFilterActiveColumns'] = this.component.quickFilterComponent.getActiveColumns().join(Codes.ARRAY_INPUT_SEPARATOR);
    }
    return dataToStore;
  }

}


