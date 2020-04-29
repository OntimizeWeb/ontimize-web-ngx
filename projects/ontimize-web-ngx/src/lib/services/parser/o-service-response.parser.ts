import { Injectable, Injector } from '@angular/core';
import { Subscriber } from 'rxjs';

import { IAuthService } from '../../interfaces/auth-service.interface';
import { OntimizeServiceResponse } from '../../types/ontimize-service-response.type';
import { Codes } from '../../util/codes';

@Injectable({
  providedIn: 'root'
})
export class OntimizeServiceResponseParser {

  constructor(
    protected injector: Injector
  ) { }

  parseSuccessfulResponse(resp: OntimizeServiceResponse, subscriber: Subscriber<OntimizeServiceResponse>, service: IAuthService) {
    if (resp && resp.code === Codes.ONTIMIZE_UNAUTHORIZED_CODE) {
      service.redirectLogin(true);
    } else if (resp && resp.code === Codes.ONTIMIZE_FAILED_CODE) {
      subscriber.error(resp.message);
    } else if (resp && resp.code === Codes.ONTIMIZE_SUCCESSFUL_CODE) {
      subscriber.next(resp);
    } else {
      // Unknow state -> error
      subscriber.error('Service unavailable');
    }
  }

  parseUnsuccessfulResponse(error, subscriber: Subscriber<OntimizeServiceResponse>, service: IAuthService) {
    if (error.status !== 500 && (error.status === 401 || error.status === 0) && !error.ok) {
      service.redirectLogin(true);
    } else {
      subscriber.error(error);
    }
  }

}
