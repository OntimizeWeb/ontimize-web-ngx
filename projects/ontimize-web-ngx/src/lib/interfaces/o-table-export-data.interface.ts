import { QueryParameter } from "../types/query-parameter.type";

export interface OTableExportData {
  data: any;
  columns: string[];
  columnNames: object;
  sqlTypes: { [columnId: string]: string; };
  filter: object
}

export interface OTableExportData3X {
  type: string;
  queryParam: QueryParameter;
  service?: string;
  path: string;
  dao: string;
  advQuery: boolean
}

export interface OTableExcelExportData3X extends OTableExportData3X {
  excelColumns: { [columnId: string]: string; };
  columnTitles: { [columnId: string]: string; };
  columnTypes: { cellNumber?: string, styleId?: string };
  styles: { styleId?: string, style?: OTableExportColumnStyle };
  columnStyles: { columnId?: string, styleId?: string };
  rowStyles: { rowId?: string, styleId?: string };
  cellStyles: { cellNumber?: string, styleId?: string };
}


export interface OTableExportColumnStyle {
  dataFormatString?: string;
  alignment?: string;
  verticalAlignment?: string;
  fillBackgroundColor?: string;
  width?: number;
}