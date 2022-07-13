export class OTableExportConfiguration {
  columns: Array<any>;
  columnNames: { [columnId: string]: string; };
  sqlTypes: { [columnId: string]: number; };
  service: string;
  serviceType: string;
  data?: any[];
  filter?: object;
  mode: string;
  entity: string;
  visibleButtons: string;
  options?: any;
}
