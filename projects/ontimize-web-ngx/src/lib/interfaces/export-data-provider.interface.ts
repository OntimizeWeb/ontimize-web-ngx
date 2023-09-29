import { OTableBase } from "../components/table/o-table-base.class";

export interface IExportDataProvider {
  table: OTableBase;
  entity: string;
  initializeProvider(table: OTableBase): void;
  getExportConfiguration(param?: any): any;
}