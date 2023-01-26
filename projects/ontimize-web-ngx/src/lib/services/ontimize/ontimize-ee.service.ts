import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';

import { IDataService } from '../../interfaces/data-service.interface';
import { ServiceResponse } from '../../interfaces/service-response.interface';
import { Util } from '../../util/util';
import { OntimizeBaseService } from './ontimize-base-service.class';

@Injectable()
export class OntimizeEEService extends OntimizeBaseService implements IDataService {

  public path: string = '';

  public configureService(config: any): void {
    super.configureService(config);
    this._startSessionPath = this._appConfig.startSessionPath ? this._appConfig.startSessionPath : '/users/login';
    this.path = config.path;
    // TODO init other params
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

  public endsession(user: string, sessionId: any): Observable<number> {
    const dataObservable: Observable<any> = new Observable(observer => {
      setTimeout(() => {
        observer.next(0);
      }, 0);
    });
    return dataObservable.pipe(share());
  }

  public hassession(user: string, sessionId: any): Observable<boolean> {
    const dataObservable: Observable<any> = new Observable(observer => {
      observer.next(true);
    });
    return dataObservable.pipe(share());
  }

  public query(kv?: object, av?: Array<string>, entity?: string, sqltypes?: object): Observable<ServiceResponse> {
    // TODO improve this -> merge between global conf and specific params of method calling
    kv = (Util.isDefined(kv)) ? kv : this.kv;
    av = (Util.isDefined(av)) ? av : this.av;
    sqltypes = (Util.isDefined(sqltypes)) ? sqltypes : this.sqltypes;

    const url = `${this.urlBase}${this.path}/${entity}/search`;

    const body = JSON.stringify({
      filter: kv,
      columns: av,
      sqltypes: sqltypes
    });

    return this.doRequest({
      method: 'POST',
      url: url,
      body: body,
      successCallback: this.parseSuccessfulQueryResponse,
      errorCallBack: this.parseUnsuccessfulQueryResponse
    });
  }

  public advancedQuery(kv?: object, av?: Array<string>, entity?: string, sqltypes?: object,
    offset?: number, pagesize?: number, orderby?: Array<object>): Observable<ServiceResponse> {

    // TODO improve this -> merge between global conf and specific params of method calling
    kv = (Util.isDefined(kv)) ? kv : this.kv;
    av = (Util.isDefined(av)) ? av : this.av;
    sqltypes = (Util.isDefined(sqltypes)) ? sqltypes : this.sqltypes;
    orderby = (Util.isDefined(orderby)) ? orderby : this.orderby;
    offset = (Util.isDefined(offset)) ? offset : this.offset;
    pagesize = (Util.isDefined(pagesize)) ? pagesize : this.pagesize;

    const url = `${this.urlBase}${this.path}/${entity}/advancedsearch`;

    const body = JSON.stringify({
      filter: kv,
      columns: av,
      sqltypes: sqltypes,
      offset: offset,
      pageSize: pagesize,
      orderBy: orderby
    });

    return this.doRequest({
      method: 'POST',
      url: url,
      body: body,
      successCallback: this.parseSuccessfulAdvancedQueryResponse,
      errorCallBack: this.parseUnsuccessfulAdvancedQueryResponse
    });
  }

  public insert(av: object = {}, entity: string, sqltypes?: object): Observable<ServiceResponse> {

    const url = `${this.urlBase}${this.path}/${entity}`;

    const body = JSON.stringify({
      data: av,
      sqltypes: sqltypes
    });

    return this.doRequest({
      method: 'POST',
      url: url,
      body: body,
      successCallback: this.parseSuccessfulInsertResponse,
      errorCallBack: this.parseUnsuccessfulInsertResponse
    });
  }

  public update(kv: object = {}, av: object = {}, entity?: string, sqltypes?: object): Observable<ServiceResponse> {

    const url = `${this.urlBase}${this.path}/${entity}`;

    const body = JSON.stringify({
      filter: kv,
      data: av,
      sqltypes: sqltypes
    });

    return this.doRequest({
      method: 'PUT',
      url: url,
      body: body,
      successCallback: this.parseSuccessfulUpdateResponse,
      errorCallBack: this.parseUnsuccessfulUpdateResponse
    });
  }

  public delete(kv: object = {}, entity?: string, sqltypes?: object): Observable<ServiceResponse> {

    const url = `${this.urlBase}${this.path}/${entity}`;

    const body = JSON.stringify({
      filter: kv,
      sqltypes: sqltypes
    });

    return this.doRequest({
      method: 'DELETE',
      url: url,
      body: body,
      successCallback: this.parseSuccessfulDeleteResponse,
      errorCallBack: this.parseUnsuccessfulDeleteResponse
    });
  }

  protected buildHeaders(): HttpHeaders {
    let headers = super.buildHeaders();
    const sessionId = this.authService.getSessionInfo().id;
    if (Util.isDefined(sessionId)) {
      headers = headers.append('Authorization', 'Bearer ' + sessionId);
    }
    return headers;
  }

}
