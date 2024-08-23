import { HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, share } from 'rxjs';

import { AppConfig } from '../../config/app-config';
import { IAuthService } from '../../interfaces/auth-service.interface';
import { JSONAPIResponse } from '../../interfaces/jsonapi-response.interface';
import { JSONAPIQueryParameter } from '../../types/json-query-parameter.type';
import { NameConvention } from '../../util/name-convention.utils';
import { Util } from '../../util/util';
import { BaseService } from '../base-service.class';


@Injectable()
export class JSONAPIService extends BaseService<JSONAPIResponse> implements IAuthService {
  public path: string = '';
  protected _startSessionPath: string;
  protected config: AppConfig;
  protected nameConvention: string;

  constructor(protected injector: Injector) {
    super(injector);
    this.config = this.injector.get(AppConfig);
    this.nameConvention = this._appConfig.nameConvention;
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
      this.httpClient.post(url, null, options).subscribe(
        {
          next: (resp: any) => {
            if (Util.isDefined(resp) && Util.isDefined(resp.headers) && Util.isDefined(resp.headers.get('X-Auth-Token'))) {
              observer.next(resp.headers.get('X-Auth-Token'));
            } else {
              // Invalid sessionId ...
              observer.error('Invalid user or password');
            }
          }
          , error: (error) => observer.error(error)
        });
    });
    return dataObservable.pipe(share());
  }

  public endsession(user: string, sessionId: number): Observable<number> {
    const url = this.urlBase + '/endsession?user=' + user + '&sessionid=' + sessionId;
    const dataObservable: Observable<any> = new Observable(_closeSessionObserver => {
      this.httpClient.get(url).subscribe(
        {
          next: (resp) => {
            _closeSessionObserver.next(resp);
          }, error: (error) => {
            if (error.status === 401 || error.status === 0 || !error.ok) {
              _closeSessionObserver.next(0);
            } else {
              _closeSessionObserver.error(error);
            }
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
    this.context = config.context;
    // TODO init other params
  }

  query(queryParams: JSONAPIQueryParameter): Observable<JSONAPIResponse> {
    queryParams = this.parseNameConventionQueryParams(queryParams);
    queryParams = Util.objectToQueryString(queryParams);

    const queryParamsString = Util.isDefined(queryParams) ? '?' + queryParams : '';

    const url = `${this.urlBase}${this.path}${queryParamsString}`;

    return this.doRequest({
      method: 'GET',
      url: url,
      successCallback: this.parseSuccessfulQueryResponse,
      errorCallBack: this.parseUnsuccessfulQueryResponse
    });
  }

  advancedQuery(queryParams: JSONAPIQueryParameter): Observable<JSONAPIResponse> {
    return this.query(queryParams);
  }

  queryById(queryParams: JSONAPIQueryParameter): Observable<JSONAPIResponse> {

    queryParams = this.parseNameConventionQueryParams(queryParams);

    const id = Object.values(queryParams.filter)[0];

    const url = `${this.urlBase}${this.path}/${id}?${Util.objectToQueryString(queryParams)}`;

    return this.doRequest({
      method: 'GET',
      url: url,
      successCallback: this.parseSuccessfulQueryResponse,
      errorCallBack: this.parseUnsuccessfulQueryResponse,
    });
  }

  protected parseNameConventionQueryParams(queryParams: JSONAPIQueryParameter): JSONAPIQueryParameter {
    if (Util.isDefined(queryParams.fields)) {
      const keyFields = Object.keys(queryParams.fields)[0];
      queryParams.fields[keyFields] = NameConvention.parseColumnsToNameConvention(this.nameConvention, this._appConfig.serviceType, queryParams.fields);
    }
    if (Util.isDefined(queryParams.sort)) {
      queryParams.sort = NameConvention.parseColumnsToNameConvention(this.nameConvention, this._appConfig.serviceType, queryParams.sort);
    }

    if (Util.isDefined(queryParams.filter)) {
      let filters = {};
      for (const filter in queryParams.filter) {
        Object.assign(filters, NameConvention.parseDataToNameConvention(this.nameConvention, { [filter]: queryParams.filter[filter] }));
      }
      queryParams.filter = filters;
    }

    return queryParams;
  }

  insert(av: object, entity: string): Observable<JSONAPIResponse> {
    const url = `${this.urlBase}${this.path}`;

    av = NameConvention.parseDataToNameConvention(this.nameConvention, av);

    let attributes = { attributes: av, type: entity };
    const body = JSON.stringify({
      data: attributes
    });

    return this.doRequest({
      method: 'POST',
      url: url,
      body: body,
      successCallback: this.parseSuccessfulInsertResponse,
      errorCallBack: this.parseUnsuccessfulInsertResponse
    });
  }

  update(kv: object, av: object, entity?: string): Observable<JSONAPIResponse> {
    const id = Object.values(kv)[0];
    const url = `${this.urlBase}${this.path}/${id}`;

    av = NameConvention.parseDataToNameConvention(this.nameConvention, av);

    let attributes = { ...{ attributes: av }, ...{ id: id }, ...{ type: entity } };

    const body = JSON.stringify({
      data: attributes
    });

    return this.doRequest({
      method: 'PATCH',
      url: url,
      body: body,
      successCallback: this.parseSuccessfulUpdateResponse,
      errorCallBack: this.parseUnsuccessfulUpdateResponse
    });
  }

  delete(kv: object = {}): Observable<JSONAPIResponse> {
    const id = Object.values(kv)[0];
    const url = `${this.urlBase}${this.path}/${id}`;

    return this.doRequest({
      method: 'DELETE',
      url: url,
      successCallback: this.parseSuccessfulDeleteResponse,
      errorCallBack: this.parseUnsuccessfulDeleteResponse
    });
  }

  /**
  * Gets standart entity
  * @param entity
  * @returns  return the first chart of the entity in uppercase
  */

  getStandartEntity(entity: string) {
    return entity.charAt(0).toUpperCase() + entity.slice(1);
  }
}
