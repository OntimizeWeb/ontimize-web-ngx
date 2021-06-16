import { OTableComponentStateClass } from '../../services/state/o-table-component-state.class';

export type OTableConfiguration = {
  name?: string;
  description?: string;
  'stored-configuration'?: OTableComponentStateClass;
  'stored-properties'?: string[];
};
