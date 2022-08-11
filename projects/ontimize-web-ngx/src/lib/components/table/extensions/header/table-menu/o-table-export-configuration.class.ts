export class OTableExportConfiguration {
  columns: Array<any>;
  columnNames: { [columnId: string]: string; };
  sqlTypes: { [columnId: string]: number; };
  service: string;
  serviceType: string;
  filter?: object;
  entity: string;
  visibleButtons: string;
  options?: any;
  advQuery: boolean = false;
  offset?: number = -1;
  pageSize?: number = 25;
}

export type OTableExportQueryParam = {
  columns: string[],
  sqltypes: { [key: string]: number; };
}

export type OTableExportColumnStyle = {
  dataFormatString?: string;
  alignment?: string;
  verticalAlignment?: string;
  fillBackgroundColor?: string;
  width?: number;

}