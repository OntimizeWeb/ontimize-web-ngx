import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JSONAPIServiceResponse } from './jsonapi-service-response.class';
import { IServiceResponseAdapter } from '../../interfaces/service-response-adapter.interface';


@Injectable()
export class JSONAPIServiceResponseAdapter implements IServiceResponseAdapter<JSONAPIServiceResponse> {
  context: any;

  adapt(res: HttpResponse<any>): JSONAPIServiceResponse {
    return new JSONAPIServiceResponse(
      res.status,
      res.statusText,
      res.headers,
      res.ok,
      res.body,
      this.context
    );
  }
  setContext(context: any) {
    this.context = context;
  }
}
