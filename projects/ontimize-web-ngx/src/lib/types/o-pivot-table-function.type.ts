import { OColumn } from "../components/table/column/o-column.class";


export type OPivotTableFunction = {
  column: OColumn,
  type: 'SUM' | 'AVERAGE' | 'MIN' | 'MAX' | 'TOTAL';
}
