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
    if (context !== null && context !== undefined) {
      this.context = context;
    }
  }

  getContext(): PaginationContext | null {
    return this.context;
  }

  /**
   * Reset the component to its initial state, just before making any REST requests.
   * @param [pageSize]
   */
  reinitializeContext(pageSize?: number): void {
    this.setContext({ pageNumber: 0, pageSize: pageSize ?? Codes.DEFAULT_QUERY_ROWS, offset: 0, totalSize: 0 });
  }
}
