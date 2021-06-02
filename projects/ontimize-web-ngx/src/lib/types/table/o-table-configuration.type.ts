import { TableLocalStorage } from './o-table-state.type';

export type OTableConfiguration = {
  name?: string;
  description?: string;
  'stored-configuration'?: TableLocalStorage;
  'stored-properties'?: string[];
};
