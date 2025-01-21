import { Injectable } from '@angular/core';
import { PaginationContext } from '../interfaces/pagination-context.interface';

@Injectable()
export class PaginationContextService {
  private context: PaginationContext | null = null;

  setContext(context: PaginationContext): void {
    this.context = context;
  }

  getContext(): PaginationContext | null {
    return this.context;
  }

  clearContext(): void {
    this.context = null;
  }
}
