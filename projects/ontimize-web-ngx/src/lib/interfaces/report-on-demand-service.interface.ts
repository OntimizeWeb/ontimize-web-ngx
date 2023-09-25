import type { OTableComponent } from "../components/table/o-table.component";

export interface IReportService {
  openReportOnDemand(table: OTableComponent): void;
}
