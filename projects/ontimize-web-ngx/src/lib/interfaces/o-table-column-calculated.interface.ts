import { OperatorFunction } from '../types/operation-function.type';
import { OTableColumn } from './o-table-column.interface';

export interface OTableColumnCalculated extends OTableColumn {
  operation: string;
  functionOperation: OperatorFunction;
}
