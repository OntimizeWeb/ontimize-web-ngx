import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';

import { RestResponse } from '../../interfaces/rest-response.interface';
import { BaseService } from '../base-service.class';

@Injectable()
export class RestService extends BaseService<RestResponse>  {
  public path: string = '';
  protected _startSessionPath: string;

  constructor(protected injector: Injector) {
    super(injector);
  }

  public configureService(config: any): void {
    super.configureService(config);
    this._startSessionPath = this._appConfig.startSessionPath ? this._appConfig.startSessionPath : '/users/login';
    this.path = config.path;
    // TODO init other params
  }

  query(queryParams: object): Observable<RestResponse> {
    queryParams
    const url = `${this.urlBase}${this.path}/${JSON.stringify(queryParams)}`;

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
