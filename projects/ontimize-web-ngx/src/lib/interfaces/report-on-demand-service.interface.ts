import { OTableBase } from "../components/table/o-table-base.class";

export interface IReportService {
  openReportOnDemand(table: OTableBase): void;
}
