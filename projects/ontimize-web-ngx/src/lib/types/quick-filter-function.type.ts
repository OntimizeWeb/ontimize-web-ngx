import { Expression } from './expression.type';

export type QuickFilterFunction = (filter: string) => Expression | object;
