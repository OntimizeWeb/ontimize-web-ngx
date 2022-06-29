import { OTableComponent } from "../components";

export interface IReportService {
  openReportOnDemand(table: OTableComponent): void;
  openFillReport(reportId: string, parametersValues: object, filter: object): void
}
