import { Injectable, Injector } from '@angular/core';
import { Subscriber } from 'rxjs';

import { IAuthService } from '../../interfaces/auth-service.interface';
import { ServiceResponse } from '../../interfaces/service-response.interface';

@Injectable({
  providedIn: 'root'
})
export class OntimizeServiceResponseParser {

  constructor(
    protected injector: Injector
  ) { }

  parseSuccessfulResponse(resp: ServiceResponse, subscriber: Subscriber<ServiceResponse>, service: IAuthService) {
    if (resp && resp.isUnauthorized()) {
      service.redirectLogin(true);
    } else if (resp && resp.isFailed()) {
      subscriber.error(resp.message);
    } else if (resp && resp.isSuccessful()) {
      subscriber.next(resp);
    } else {
      // Unknow state -> error
      subscriber.error('Service unavailable');
    }
  }

  parseUnsuccessfulResponse(error, subscriber: Subscriber<ServiceResponse>, service: IAuthService) {
    if (error.status !== 500 && (error.status === 401 || error.status === 0) && !error.ok) {
      service.redirectLogin(true);
    } else {
      subscriber.error(error);
    }
  }

}
