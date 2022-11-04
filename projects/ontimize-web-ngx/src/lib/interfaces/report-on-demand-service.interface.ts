import { OTableComponent } from "../components";

export interface IReportService {
  openReportOnDemand(table: OTableComponent): void;
}
