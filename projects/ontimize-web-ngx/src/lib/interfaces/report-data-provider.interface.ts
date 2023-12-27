import { OTableComponent } from "../components";

export interface IReportDataProvider {
  table: OTableComponent;
  entity: string;
  getReportConfiguration(param?: any): any;
}
