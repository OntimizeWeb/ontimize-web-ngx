import { Injectable } from '@angular/core';
import { PaginationContext } from '../interfaces/pagination-context.interface';
import { Codes } from '../util/codes';

@Injectable()
export class PaginationContextService {
  private context: PaginationContext;

  constructor() {
    this.context = { pageNumber: 0, totalSize: 0, offset: 0, pageSize: Codes.DEFAULT_QUERY_ROWS };
  }

  setContext(context: PaginationContext): void {
    this.context = context;
  }

  getContext(): PaginationContext | null {
    return this.context;
  }

  reinitializeContext(pageSize?: number): void {
   this.setContext({ pageNumber: 0, pageSize: pageSize ?? Codes.DEFAULT_QUERY_ROWS, offset: 0, totalSize: 0 });
  }
}
