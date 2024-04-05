import { Injectable, Injector } from '@angular/core';
import { Observable, share } from 'rxjs';

import { RestResponse } from '../../interfaces/rest-response.interface';
import { BaseService } from '../base-service.class';
import { Util } from '../../util/util';
import { OQueryParams } from '../../types/query-params.type';
import { IAuthService } from '../../interfaces/auth-service.interface';
import { HttpHeaders } from '@angular/common/http';


@Injectable()
export class RestService extends BaseService<RestResponse> implements IAuthService {
  public path: string = '';
  protected _startSessionPath: string;

  constructor(protected injector: Injector) {
    super(injector);
  }
  public startsession(user: string, password: string): Observable<string | number> {
    const url = this.urlBase + this._startSessionPath;
    const options: any = {
      headers: new HttpHeaders({
        Authorization: 'Basic ' + btoa(user + ':' + password)
      }),
      observe: 'response'
    };
    const dataObservable: Observable<string | number> = new Observable(observer => {
      this.httpClient.post(url, null, options).subscribe((resp: any) => {
        if (Util.isDefined(resp) && Util.isDefined(resp.headers) && Util.isDefined(resp.headers.get('X-Auth-Token'))) {
          observer.next(resp.headers.get('X-Auth-Token'));
        } else {
          // Invalid sessionId ...
          observer.error('Invalid user or password');
        }
      }, error => observer.error(error));
    });
    return dataObservable.pipe(share());
  }

  public endsession(user: string, sessionId: number): Observable<number> {
    const url = this.urlBase + '/endsession?user=' + user + '&sessionid=' + sessionId;
    const dataObservable: Observable<any> = new Observable(_closeSessionObserver => {
      this.httpClient.get(url).subscribe(resp => {
        _closeSessionObserver.next(resp);
      }, error => {
        if (error.status === 401 || error.status === 0 || !error.ok) {
          _closeSessionObserver.next(0);
        } else {
          _closeSessionObserver.error(error);
        }
      });
    });
    return dataObservable.pipe(share());
  }

  protected buildHeaders(): HttpHeaders {
    let headers = super.buildHeaders();
    const sessionId = this.authService.getSessionInfo().id;
    if (Util.isDefined(sessionId)) {
      headers = headers.append('Authorization', 'Bearer ' + sessionId);
    }
    return headers;
  }

  public hassession(user: string, sessionId: any): Observable<boolean> {
    const dataObservable: Observable<any> = new Observable(observer => {
      observer.next(true);
    });
    return dataObservable.pipe(share());
  }

  public configureService(config: any): void {
    super.configureService(config);
    this._startSessionPath = this._appConfig.startSessionPath ? this._appConfig.startSessionPath : '/auth/login';
    this.path = config.path;
    // TODO init other params
  }

  query(queryParams: OQueryParams): Observable<RestResponse> {

    const url = `${this.urlBase}${this.path}?${Util.objectToQueryString(queryParams)}`;

    return this.doRequest({
      method: 'GET',
      url: url,
      successCallback: this.parseSuccessfulInsertResponse,
      errorCallBack: this.parseUnsuccessfulInsertResponse
    });
  }

  // advancedQuery(queryParams: any): Observable<RestResponse> {

  //   const url = `${this.urlBase}${this.path}/${entity}`;


  //   return this.doRequest({
  //     method: 'GET',
  //     url: url,
  //     successCallback: this.parseSuccessfulInsertResponse,
  //     errorCallBack: this.parseUnsuccessfulInsertResponse
  //   });

  // }

  insert(av: object): Observable<RestResponse> {
    const url = `${this.urlBase}${this.path}`;
    const body = JSON.stringify({
      data: av
    });

    return this.doRequest({
      method: 'POST',
      url: url,
      body: body,
      successCallback: this.parseSuccessfulInsertResponse,
      errorCallBack: this.parseUnsuccessfulInsertResponse
    });
  }

  update(kv: object, av: object, entity?: string, sqltypes?: object): Observable<RestResponse> {
    const url = `${this.urlBase}${this.path}/${entity}`;

    const body = JSON.stringify({
      data: av
    });

    return this.doRequest({
      method: 'PUT',
      url: url,
      body: body,
      successCallback: this.parseSuccessfulUpdateResponse,
      errorCallBack: this.parseUnsuccessfulUpdateResponse
    });
  }

  delete(kv: object = {}, entity?: string): Observable<RestResponse>{
    let urlQuery = '';
    Object.keys(kv).forEach(key => urlQuery = key + '=' + kv[key]);
    const url = `${this.urlBase}${this.path}/${entity}?urlQuery`;

    return this.doRequest({
      method: 'DELETE',
      url: url,
      successCallback: this.parseSuccessfulDeleteResponse,
      errorCallBack: this.parseUnsuccessfulDeleteResponse
    });
  }

}
