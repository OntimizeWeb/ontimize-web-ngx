import { Injectable, Injector } from '@angular/core';
import { Subscriber } from 'rxjs';

import { BaseService } from '../base-service.class';
import { BaseResponse } from '../../interfaces/base-response.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { AppConfig } from '../../config/app-config';
import { Util } from '../../util';
import { NameConvention } from '../../util/name-convention.utils';

@Injectable({
  providedIn: 'root'
})
export class OntimizeServiceResponseParser<T extends BaseResponse> {
  appConfig: AppConfig;
  nameConvention: string;

  constructor(
    protected injector: Injector
  ) {
    this.appConfig = this.injector.get(AppConfig);
    this.nameConvention = this.appConfig.getNameConvention();
  }

  parseSuccessfulResponse(resp: T, subscriber: Subscriber<T>, service: BaseService<T>) {
    if (resp && resp.isUnauthorized()) {
      service.clientErrorFallback(401);
    } else if (resp && resp.isFailed()) {
      subscriber.error(resp.message);
    } else if (resp && resp.isSuccessful()) {
      if (this.nameConvention !== 'database') {
        resp.data = this.parseData(resp.data);
      }
      subscriber.next(resp);
    } else {
      // Unknow state -> error
      subscriber.error('Service unavailable');
    }
  }

  parseData(data: any) {
    let nameConvention = this.appConfig.getNameConvention();

    if (nameConvention === 'lower') {
      nameConvention = 'upper'
    } else if (nameConvention === 'upper') {
      nameConvention = 'lower';
    }

    if (Util.isArray(data)) {
      data = data.map(element => {
        return NameConvention.parseDataToNameConvention(nameConvention, element);
      });
    } else if (Util.isObject(data)) {
      return NameConvention.parseDataToNameConvention(nameConvention, data);
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
