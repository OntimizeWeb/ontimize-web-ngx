import { Injectable } from '@angular/core';

import { OTreeComponent } from '../../components/tree/o-tree.component';
import { AbstractComponentStateService } from './o-component-state.service';
import { OTreeComponentStateClass } from './o-tree-component-state.class';


@Injectable()
export class OTreeComponentStateService extends AbstractComponentStateService<OTreeComponentStateClass, OTreeComponent> {

  initialize(component: OTreeComponent) {
    this.state = new OTreeComponentStateClass();
    super.initialize(component);
  }

  initializeState(state: OTreeComponentStateClass) {
    super.initializeState(state);
  }

  getDataToStore(): any {
    const dataToStore: any = {};
    const propertiesKeys = [
      'quick-filter',
      'page',
      'selection'
    ];
    Object.assign(dataToStore, this.getTreePropertiesToStore(propertiesKeys));
    return dataToStore;
  }

  protected getTreePropertiesToStore(properties: string[]): any {
    const result = {};
    properties.forEach(prop => {
      Object.assign(result, this.getTreePropertyToStore(prop));
    });
    return result;
  }

  protected getTreePropertyToStore(property: string): any {
    let result: any = {};
    switch (property) {
      case 'quick-filter':
        result = this.getQuickFilterState();
        break;

        break;
      case 'page':
        result = this.getPageState();
        break;
      case 'selection':
        result['selection'] = this.getSelectionState();
        break;

    }
    return result;
  }
  getQuickFilterState(): any {
    return {
      'filter': this.component.quickFilterComponent ? this.component.quickFilterComponent.getValue() : ''
    };
  }

  protected getPageState(): any {
    const result: any = {};

    if (this.component.matpaginator) {
      result['query-rows'] = this.component.matpaginator.pageSize;
    } else if (this.component.state.queryRows) {
      result['query-rows'] = this.component.state.queryRows;
    } else {
      result['query-rows'] = this.component.originalQueryRows;
    };

    if (this.component.currentPage > 0) {
      result.currentPage = this.component.currentPage;
    }
    if (this.component.pageable) {
      result.totalQueryRecordsNumber = this.component.state.totalQueryRecordsNumber;
      result.queryRecordOffset = Math.max(
        (this.component.state.queryRecordOffset - this.component.dataSource.data.length),
        (this.component.state.queryRecordOffset - this.component.queryRows)
      );
    }
    return result;
  }

  protected getSelectionState(): any {
    const selection = [];
    if (this.component) {
      // storing selected items keys values
      const tableKeys = this.component.getKeys();
      this.component.getSelectedItems().forEach(item => {
        const data = {};
        tableKeys.forEach(key => {
          data[key] = item[key];
        });
        selection.push(data);
      });
    }
    return selection;
  }

}


