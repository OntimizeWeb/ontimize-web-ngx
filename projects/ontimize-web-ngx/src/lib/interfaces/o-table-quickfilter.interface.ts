import { IExpression } from '../util/filter-expression.utils';

export interface OTableQuickfilter {
  filterExpression: IExpression;
  setValue: (value: any, trigger?: boolean) => void;
  value: string;
}
