import { OFilterBuilderStatus, OFilterBuilderValues } from '../../types/o-filter-builder-values.type';
import { Util } from '../../util/util';
import { DefaultComponentStateClass } from './o-component-state.class';

export class OFilterBuilderComponentStateClass extends DefaultComponentStateClass {

  // stored filters builder values
  filterBuilderValues: OFilterBuilderValues[];

  get storedFilterBuilders(): OFilterBuilderStatus[] {
    return this['stored-filter-builders'] || [];
  }

  set storedFilterBuilders(value: OFilterBuilderStatus[]) {
    this['stored-filter-builders'] = value;
  }

  addStoredFilter(filter: OFilterBuilderStatus) {
    if (!Util.isDefined(this['stored-filter-builders'])) {
      this['stored-filter-builders'] = [];
    }
    this.storedFilterBuilders.push(filter);
  }

  deleteStoredFilter(filterName: string) {
    const index = this.storedFilterBuilders.findIndex((item: OFilterBuilderStatus) => item.name === filterName);
    if (index >= 0) {
      this.storedFilterBuilders.splice(index, 1);
    }
  }
  applyFilter(filterName: string) {
    const filter = this.getStoredFilter(filterName);
    if (filter) {
      this.filterBuilderValues = filter;
    }
  }

  getStoredFilter(filterName: string): OFilterBuilderValues[] {
    let result = [];
    const filter = this.storedFilterBuilders.find((item: OFilterBuilderStatus) => item.name === filterName);
    if (Util.isDefined(filter)) {
      result = filter['filter-builder-values'];
    }
    return result;
  }

}
