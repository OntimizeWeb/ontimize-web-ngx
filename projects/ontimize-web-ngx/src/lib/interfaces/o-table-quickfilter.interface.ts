import { Expression } from '../types/expression.type';

export interface OTableQuickfilter {
  filter: any;
  filterExpression: Expression;
  setValue: (value: any, trigger?: boolean) => void;
  value: string;
}
