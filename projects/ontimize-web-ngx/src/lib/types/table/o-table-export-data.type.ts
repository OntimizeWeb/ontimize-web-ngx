export type OTableExportData = {
  queryParam: OTableExportQueryParam;
  service: string;
  path: string;
  dao: string;
  offset?: number;
  pageSize?: number;
  advQuery: boolean;
  excelColumns: { [columnId: string]: string; };
  columnTitles: { [columnId: string]: string; };
  columnTypes?: { cellNumber?: string, styleId?: string };
  styles: { styleId?: string, style?: OTableExportColumnStyle };
  columnStyles: { columnId?: string, styleId?: string };
  rowStyles?: { rowId?: string, styleId?: string };
  cellStyles?: { cellNumber?: string, styleId?: string };
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