import { Observable } from "rxjs";
import { ServiceResponse } from "../../interfaces/service-response.interface";
import { PaginationContextService } from "../pagination-context.service";

export class BaseRequestArgument {
  protected paginationContextService: PaginationContextService;

  setPaginationContextService(service: PaginationContextService): void {
    this.paginationContextService = service;
  }

  request(method: string, service: any, queryArguments: any) {
    return (service[method](...queryArguments) as Observable<ServiceResponse>);
  }

  parseQueryParameters(args: any) :any {
    return args;
  }
  getIdFromFilter(filter: any): any {
    return filter;
  }

}
