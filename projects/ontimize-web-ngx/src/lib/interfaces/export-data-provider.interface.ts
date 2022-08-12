import { OTableComponent } from "../components";

export interface IExportDataProvider {
  table: OTableComponent;
  entity: string;
  initializeProvider(table: OTableComponent): void;
  getExportConfiguration(): any;
}