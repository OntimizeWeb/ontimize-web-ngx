import { OFilterBuilderValues } from '../../types/o-filter-builder-values.type';
import { OTableFiltersStatus, OTableStoredFilter } from '../../types/table/o-table-filter-status.type';
import { Util } from '../../util';
import { DefaultComponentStateClass } from './o-component-state.class';

export class OFilterBuilderComponentStateClass extends DefaultComponentStateClass {

  // stored filters builder values
  filterBuilderValues: OFilterBuilderValues[];

  get storedFilters(): OTableFiltersStatus[] {
    return this['stored-filters'] || [];
  }

  set storedFilters(value: OTableFiltersStatus[]) {
    this['stored-filters'] = value;
  }

  addStoredFilter(filter: OTableFiltersStatus) {
    if (!Util.isDefined(this['stored-filters'])) {
      this['stored-filters'] = [];
    }
    this.storedFilters.push(filter);
  }

  deleteStoredFilter(filterName: string) {
    const index = this.storedFilters.findIndex((item: OTableFiltersStatus) => item.name === filterName);
    if (index >= 0) {
      this.storedFilters.splice(index, 1);
    }
  }
  applyFilter(filterName: string) {
    const filter = this.getStoredFilter(filterName);
    if (filter) {
      this.filterBuilderValues = filter['filter-builder-values'];
    }
  }

  getStoredFilter(filterName: string): OTableStoredFilter {
    let result: OTableStoredFilter;
    const filter = this.storedFilters.find((item: OTableFiltersStatus) => item.name === filterName);
    if (filter) {
      result = filter['stored-filter'];
    }
    return result;
  }

}
