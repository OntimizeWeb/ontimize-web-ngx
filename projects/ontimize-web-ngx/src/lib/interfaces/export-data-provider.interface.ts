import { OTableComponent } from "../components";
import { OTableExportData, OTableExportData3X } from "../types/table/o-table-export-data.type";

export interface IExportDataProvider {
  table: OTableComponent;
  entity: string;
  initializeProvider(table: OTableComponent): void;
  getExportConfiguration(): OTableExportData3X | OTableExportData;
}