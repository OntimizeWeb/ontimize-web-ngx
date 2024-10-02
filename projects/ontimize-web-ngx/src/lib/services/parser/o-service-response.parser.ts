import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Subscriber } from 'rxjs';

import { AppConfig } from '../../config/app-config';
import { BaseResponse } from '../../interfaces/base-response.interface';
import { Util } from '../../util/util';
import { BaseService } from '../base-service.class';
import { NameConvention } from '../name-convention/name-convention.service';


@Injectable({
  providedIn: 'root'
})
export class OntimizeServiceResponseParser<T extends BaseResponse> {
  appConfig: AppConfig;
  nameConvention: NameConvention;


  constructor(
    protected injector: Injector
  ) {
    this.appConfig = this.injector.get(AppConfig);
    this.nameConvention = this.injector.get(NameConvention);
  }

  parseSuccessfulResponse(resp: T, subscriber: Subscriber<T>, service: BaseService<T>) {
    if (resp && resp.isUnauthorized()) {
      service.clientErrorFallback(401);
    } else if (resp && resp.isFailed()) {
      subscriber.error(resp.message);
    } else if (resp && resp.isSuccessful()) {
      resp.data = this.parseData(resp.data);
      subscriber.next(resp);
    } else {
      // Unknow state -> error
      subscriber.error('Service unavailable');
    }
  }

  parseData(data: any) {

    if (Util.isArray(data)) {
      data = data.map(element => {
        return this.nameConvention.parseDataToNameConvention(element);
      });
    } else if (Util.isObject(data)) {
      return this.nameConvention.parseDataToNameConvention(data);
    }

    return data;
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
