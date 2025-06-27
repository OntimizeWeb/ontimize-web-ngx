import { Expression } from "../expression.type";

export enum ColumnValueFilterOperator { IN, LESS_EQUAL, MORE_EQUAL, BETWEEN, EQUAL }

export type OColumnValueFilter = {
  attr: string;
  operator: ColumnValueFilterOperator;
  values: any;
  availableValues?: any[];
  filterValuesInData?: 'current-page' | 'all-data';
  filterExpresion? :Expression
};
