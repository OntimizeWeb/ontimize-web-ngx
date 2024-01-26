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
      'sort-columns',
      'oColumns-display',
      'columns-filter',
      'quick-filter',
      'page',
      'selection',
      'initial-configuration',
      'filter-columns',
      'filter-column-active',
      'grouped-columns',
      'grouped-column-types',
      'user-stored-filters',
      'user-stored-configurations'
    ];
    Object.assign(dataToStore, this.getTablePropertiesToStore(propertiesKeys));
    return dataToStore;
  }

  protected getTablePropertiesToStore(properties: string[]): any {
    const result = {};
    properties.forEach(prop => {
      Object.assign(result, this.getTreePropertyToStore(prop));
    });
    return result;
  }

  protected getTreePropertyToStore(property: string): any {
    let result: any = {};
    return result;
  }
}


