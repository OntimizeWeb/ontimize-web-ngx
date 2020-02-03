import { Injectable } from '@angular/core';
import { ConnectionBackend, Headers, Http, RequestOptions, RequestOptionsArgs, Response } from '@angular/http';
import { Observable } from 'rxjs';


const mergeAuthToken = (options: RequestOptionsArgs) => {
  let newOptions = new RequestOptions({}).merge(options);
  let newHeaders = new Headers(newOptions.headers);
  /*newHeaders.set('X-AUTH-TOKEN', localStorage.getItem('jwt'));
  newHeaders.set('Accept', 'application/json');
  newHeaders.set('Content-Type', 'application/json');
  */
  newHeaders.set('Access-Control-Allow-Origin', '*');
  newHeaders.set('Accept', 'application/json');
  newHeaders.set('Content-Type', 'application/json;charset=UTF-8');
  newOptions.headers = newHeaders;
  return newOptions;
};

@Injectable()
export class OHttp extends Http {

  constructor(_backend: ConnectionBackend, _defaultOptions: RequestOptions) {
    super(_backend, _defaultOptions);
  }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return super.get(url, mergeAuthToken(options));
  }

  post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    return super.post(url, body, mergeAuthToken(options));
  }

  put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    return super.put(url, body, mergeAuthToken(options));
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return super.delete(url, mergeAuthToken(options));
  }

  patch(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    return super.patch(url, body, mergeAuthToken(options));
  }

  head(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return super.head(url, mergeAuthToken(options));
  }

}
