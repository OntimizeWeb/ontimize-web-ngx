import { IExpression } from '../util/filter-expression.utils';

export type QuickFilterFunction = (filter: string) => IExpression | object;
