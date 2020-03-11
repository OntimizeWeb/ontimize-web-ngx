import {
  OperatorFunction,
  OTableColumnCalculatedComponent,
} from '../components/table/column/calculated/o-table-column-calculated.component';
import { OBaseTableCellRenderer } from '../components/table/column/cell-renderer/o-base-table-cell-renderer.class';
import { OTableColumnComponent } from '../components/table/column/o-table-column.component';
import { OTableComponent } from '../components/table/o-table.component';
import { Expression } from '../types/expression.type';
import { OColumnAggregate } from '../types/o-column-aggregate.type';
import { OColumnTooltip } from '../types/o-column-tooltip.type';

export interface OColumn {
  attr: string;
  name: string;
  title: string;
  type: string;
  sqlType: number;
  className: string;
  orderable: boolean;
  searchable: boolean;
  searching: boolean;
  visible: boolean;
  renderer: OBaseTableCellRenderer;
  editor: any;
  editing: boolean;
  width: string;
  minWidth: string;
  maxWidth: string;
  aggregate: OColumnAggregate;
  calculate: string | OperatorFunction;
  definition: OTableColumnComponent;
  tooltip: OColumnTooltip;
  resizable: boolean;
  DOMWidth: number;
  setDefaultProperties: (table: OTableComponent) => void;
  setColumnProperties: (column: OTableColumnComponent | OTableColumnCalculatedComponent | any) => void;
  filterExpressionFunction: (columnAttr: string, quickFilter?: string) => Expression;
  getMinWidthValue: () => any;
  getMaxWidthValue: () => any;
  getRenderWidth: () => any;
  getWidthToStore: () => any;
  setWidth: (val: number) => void;
  getTitleAlignClass: () => string;
  getFilterValue: (cellValue: any, rowValue?: any) => any[];
  useCustomFilterFunction: () => boolean;
  useQuickfilterFunction: () => boolean;
}
