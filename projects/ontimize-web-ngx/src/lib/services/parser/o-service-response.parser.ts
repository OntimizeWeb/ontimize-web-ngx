import { Injectable, Injector } from '@angular/core';
import { Subscriber } from 'rxjs';

import { BaseService } from '../base-service.class';
import { BaseResponse } from '../../interfaces/base-response.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OntimizeServiceResponseParser<T extends BaseResponse> {

  constructor(
    protected injector: Injector
  ) { }

  parseSuccessfulResponse(resp: T, subscriber: Subscriber<T>, service: BaseService<T>) {
    if (resp && resp.isUnauthorized()) {
      service.clientErrorFallback(401);
    } else if (resp && resp.isFailed()) {
      subscriber.error(resp.message);
    } else if (resp && resp.isSuccessful()) {
      subscriber.next(resp);
    } else {
      // Unknow state -> error
      subscriber.error('Service unavailable');
    }
  }

  parseUnsuccessfulResponse(error: HttpErrorResponse, subscriber: Subscriber<T>, service: BaseService<T>) {
    if (error) {
      switch (error.status) {
        case 401:
        case 403:
        case 404:
        case 405:
          service.clientErrorFallback(error.status);
          break;
        case 500:
        case 501:
        case 502:
        case 503:
        case 504:
        default:
          subscriber.error(error);
          service.serverErrorFallback(error.status);
          break;
      }
    } else {
      subscriber.error(error);
    }
  }

}
