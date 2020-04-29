import { Subscriber } from 'rxjs';

import { HttpRequestOptions } from './http-request-options.type';
import { OntimizeServiceResponse } from './ontimize-service-response.type';

export type OntimizeRequestParam = {
  method: 'POST' | 'PUT' | 'DELETE',
  url: string,
  body: any,
  options?: HttpRequestOptions,
  successCallback?: (resp: OntimizeServiceResponse, observer: Subscriber<OntimizeServiceResponse>) => void,
  errorCallBack?: (resp: OntimizeServiceResponse, observer: Subscriber<OntimizeServiceResponse>) => void
};
