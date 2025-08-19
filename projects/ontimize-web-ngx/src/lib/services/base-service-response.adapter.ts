import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IServiceResponseAdapter } from '../interfaces/service-response-adapter.interface';
import { BaseServiceResponse } from './base-service-response.class';


@Injectable()
export class BaseServiceResponseAdapter implements IServiceResponseAdapter<BaseServiceResponse> {

  adapt(res: HttpResponse<any>):any {
    return res;
  }

  adaptError?(error: HttpErrorResponse) {
    return error;
  }

  context:any;

}
