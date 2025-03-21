import { Observable } from "rxjs";
import { BaseService } from "./base-service.class";
import { Injector } from "@angular/core";
import { ServiceResponse } from "../interfaces/service-response.interface";
import { PaginationContext } from "../interfaces/pagination-context.interface";

export abstract class BaseDataService<T> extends BaseService<ServiceResponse> {

  constructor(protected injector: Injector) {
    super(injector);
  }
  abstract query(...args:  [any, ...any[]]): Observable<T>;
  abstract queryById(...args:  [any, ...any[]]): Observable<T>;
  abstract advancedQuery(...args:  [any, ...any[]]): Observable<T>;
  abstract insert(...args:  [any, ...any[]]): Observable<T>;
  abstract update(...args:  [any, ...any[]]): Observable<T>;
  abstract delete(...args: [any, ...any[]]): Observable<T>;

  public clientErrorFallback(errorCode: number) {
    if (errorCode === 401) {
      this.authService.logout();
    }
  }

  setPaginationContext(context: PaginationContext): void {
    super.setPaginationContext(context);
    if (this.adapter) {
      this.adapter.context = context;
    }
  }
}
