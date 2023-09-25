import type { OTableComponent } from "../components/table/o-table.component";

export interface IExportDataProvider {
  table: OTableComponent;
  entity: string;
  initializeProvider(table: OTableComponent): void;
  getExportConfiguration(param?: any): any;
}