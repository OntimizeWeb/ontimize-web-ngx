import { Subscriber } from 'rxjs';
import { HttpRequestOptions } from './http-request-options.type';
import { HttpErrorResponse } from '@angular/common/http';

export type ServiceRequestParam<T> = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  url: string,
  body?: any,
  options?: HttpRequestOptions,
  successCallback?: (resp: T, observer: Subscriber<T>) => void,
  errorCallBack?: (resp: HttpErrorResponse, observer: Subscriber<T>) => void
};
