import { HttpHeaders } from '@angular/common/http';
import { inject, Injectable, Injector } from '@angular/core';
import { Observable, share } from 'rxjs';

import { AppConfig } from '../../config/app-config';
import { IAuthService } from '../../interfaces/auth-service.interface';
import { JSONAPIResponse } from '../../interfaces/jsonapi-response.interface';
import { JSONAPIQueryParameter } from '../../types/json-query-parameter.type';
import { Util } from '../../util/util';
import { BaseDataService } from '../base-data-service.class';
import { O_JSON_API_CONFIG } from '../../injection-tokens';
import { IJsonApiConfig } from '../../interfaces/jsonapi-config.interface';

@Injectable()
export class JSONAPIService extends BaseDataService<JSONAPIResponse> implements IAuthService {
  protected _startSessionPath: string;
  protected config: AppConfig;
  protected readonly DEFAULT_DELIMITER = '_';
  delimiter: string;


  constructor(protected injector: Injector) {
    super(injector);
    this.config = this.injector.get(AppConfig);
    const jsonApiConfig = this.injector.get<IJsonApiConfig>(O_JSON_API_CONFIG);
    this.delimiter = jsonApiConfig?.multipleKeyDelimiter || this.DEFAULT_DELIMITER;
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
    this.delimiter = this.getValidDelimiter(config.multipleKeyDelimiter ?? this.delimiter);
  }


  protected getValidDelimiter(delimiter?: string): string {

    if (!delimiter || !/^[_-]$/.test(delimiter)) {
      console.warn(`Delimiter '${delimiter}' is not valid for URL, defaulting to '${this.DEFAULT_DELIMITER}'.`);
      return this.DEFAULT_DELIMITER
    }
    return delimiter;
  }

  query(queryParams: JSONAPIQueryParameter): Observable<JSONAPIResponse> {
    queryParams = this.parseNameConventionQueryParams(queryParams);
    const queryParamsToString = Util.objectToQueryString(queryParams);

    const queryParamsString = Util.isDefined(queryParams) ? '?' + queryParamsToString : '';

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

    const serializedId = this.serializeCompositeKey(queryParams.filter);
    const url = `${this.urlBase}${this.path}/${serializedId}`;

    return this.doRequest({
      method: 'GET',
      url: url,
      successCallback: this.parseSuccessfulQueryResponse,
      errorCallBack: this.parseUnsuccessfulQueryResponse,
    });
  }


  protected serializeCompositeKey(keyObj: string | object): string {
    if (keyObj == null) {
      console.warn('JSONAPI Service: Key object is null or undefined.');
      return '';
    }

    if (typeof keyObj === 'string') {
      if (keyObj.trim() === '') {
        console.warn('JSONAPI Service: Key string is empty.');
      }
      return keyObj;
    }

    const values = Object.values(keyObj);

    if (values.length === 0) {
      console.warn('JSONAPI Service: Key object has no properties.');
      return '';
    }

    for (const val of values) {
      if (val == null) {
        console.warn('JSONAPI Service: Key object contains null or undefined value.');
      }
    }


    return Object.values(keyObj).join(this.delimiter);
  }

  protected parseNameConventionQueryParams(queryParams: JSONAPIQueryParameter): JSONAPIQueryParameter {
    if (Util.isDefined(queryParams.fields)) {
      const entity = Object.keys(queryParams.fields)[0];
      const fields = Object.values(queryParams.fields)[0];
      queryParams.fields[entity] = this.nameConvention.parseColumnsToNameConventionForJSONAPI(fields);
    }
    if (Util.isDefined(queryParams.sort)) {
      queryParams.sort = this.nameConvention.parseColumnsToNameConventionForJSONAPI(queryParams.sort);
    }

    if (Util.isDefined(queryParams.filter)) {
      const filter = this.nameConvention.parseFilterToNameConvention(queryParams.filter);
      queryParams.filter = { ...filter };
    }

    return queryParams;
  }

  insert(attributes: object, type: string): Observable<JSONAPIResponse> {
    const url = `${this.urlBase}${this.path}`;

    attributes = this.nameConvention.parseDataToNameConvention(attributes);

    let data = { attributes: attributes, type: type };
    const body = JSON.stringify({
      data: data
    });

    return this.doRequest({
      method: 'POST',
      url: url,
      body: body,
      successCallback: this.parseSuccessfulInsertResponse,
      errorCallBack: this.parseUnsuccessfulInsertResponse
    });
  }

  update(id: string | object, attributes: object, type: string): Observable<JSONAPIResponse> {

    const serializedId = this.serializeCompositeKey(id);
    const url = `${this.urlBase}${this.path}/${serializedId}`;


    attributes = this.nameConvention.parseDataToNameConvention(attributes);

    let data = { ...{ attributes: attributes }, ...{ id: serializedId }, ...{ type: type } };

    const body = JSON.stringify({
      data: data
    });

    return this.doRequest({
      method: 'PATCH',
      url: url,
      body: body,
      successCallback: this.parseSuccessfulUpdateResponse,
      errorCallBack: this.parseUnsuccessfulUpdateResponse
    });
  }

  delete(id: object): Observable<JSONAPIResponse> {
    const serializedId = this.serializeCompositeKey(id);
    const url = `${this.urlBase}${this.path}/${serializedId}`;

    return this.doRequest({
      method: 'DELETE',
      url: url,
      successCallback: this.parseSuccessfulDeleteResponse,
      errorCallBack: this.parseUnsuccessfulDeleteResponse
    });
  }
}
