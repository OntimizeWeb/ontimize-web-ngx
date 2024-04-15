import { Observable } from "rxjs";
import { ServiceResponse } from "../../interfaces/service-response.interface";

export class BaseQueryArgument {

  request(method: string, service: any, queryArguments: any) {
    return (service[method].apply(service, queryArguments) as Observable<ServiceResponse>);
  }

  parseQueryParameters(args: any) :any { }

}
