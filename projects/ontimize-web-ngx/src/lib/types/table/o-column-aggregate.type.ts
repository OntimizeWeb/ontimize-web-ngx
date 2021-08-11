import { AggregateFunction } from '../aggregate-function.type';

export type OColumnAggregate = {
  title?: string;
  attr?: string;
  operator?: string | AggregateFunction;
};
