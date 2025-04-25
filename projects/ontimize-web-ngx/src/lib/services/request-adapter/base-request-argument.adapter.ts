import { Observable } from "rxjs";
import { ServiceResponse } from "../../interfaces/service-response.interface";

export class BaseRequestArgument {

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
