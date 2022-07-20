import { OFilterBuilderValues } from '../o-filter-builder-values.type';
import { OColumnSearchable } from './o-column-searchable.type';
import { OColumnValueFilter } from './o-column-value-filter.type';

export type OTableFiltersStatus = {
  name: string;
  description: string;
  'stored-filter': OTableStoredFilter;
};

export type OTableStoredFilter = {
  'column-value-filters': OColumnValueFilter[];
  'oColumns': OColumnSearchable[];
  'filter-case-sensitive': boolean;
  'filter': string;
  'filter-builder-values': OFilterBuilderValues[];
}

export type OTableConfigurationStatus = {
  name: string;
  description: string;
  'stored-configuration': any;
  'stored-properties': any[];
};
