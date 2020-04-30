import { Subscriber } from 'rxjs';

import { ServiceResponse } from '../interfaces/service-response.interface';
import { HttpRequestOptions } from './http-request-options.type';

export type OntimizeRequestParam = {
  method: 'POST' | 'PUT' | 'DELETE',
  url: string,
  body: any,
  options?: HttpRequestOptions,
  successCallback?: (resp: ServiceResponse, observer: Subscriber<ServiceResponse>) => void,
  errorCallBack?: (resp: ServiceResponse, observer: Subscriber<ServiceResponse>) => void
};
