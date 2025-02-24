import { Observable } from "rxjs";
import { BaseResponse } from "../interfaces/base-response.interface";
import { BaseService } from "./base-service.class";
import { Injector } from "@angular/core";

export abstract class BaseDataService<T> extends BaseService<BaseResponse> {

  constructor(protected injector: Injector) {
    super(injector);
  }
  abstract query(...args:  [any, ...any[]]): Observable<T>;
  abstract queryById(...args:  [any, ...any[]]): Observable<T>;
  abstract advancedQuery(...args:  [any, ...any[]]): Observable<T>;
  abstract insert(...args:  [any, ...any[]]): Observable<T>;
  abstract update(...args:  [any, ...any[]]): Observable<T>;
  abstract delete(...args:  [any, ...any[]]): Observable<T>;
}
