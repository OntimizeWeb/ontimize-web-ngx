import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';

import { IDataService } from '../../interfaces/data-service.interface';
import { Util } from '../../util/util';
import { OntimizeBaseService } from './ontimize-base-service.class';
import { ServiceResponse } from '../../interfaces';

@Injectable()
export class OntimizeService extends OntimizeBaseService implements IDataService {

  public entity: string = '';

  protected user: string;

  public configureService(config: any): void {
    super.configureService(config);
    this._startSessionPath = this._appConfig.startSessionPath ? this._appConfig.startSessionPath : '/startsession';
    this.user = config.session ? config.session.user : '';
    if (config.entity !== undefined) {
      this.entity = config.entity;
    }
    // TODO init other params like 'kv', 'av', etc.
  }

  public startsession(user: string, password: string): Observable<string | number> {
    const encodedPassword = encodeURIComponent(password);
    const url = this.urlBase + this._startSessionPath + '?user=' + user + '&password=' + encodedPassword;
    const dataObservable: Observable<string | number> = new Observable(_startSessionObserver => {
      this.httpClient.get(url).subscribe((resp: number) => {
        if (resp >= 0) {
          _startSessionObserver.next(resp);
        } else {
          // Invalid sessionId...
          _startSessionObserver.error('Invalid user or password');
        }
      }, error => _startSessionObserver.error(error));
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

  public hassession(user: string, sessionId: number): Observable<boolean> {
    const dataObservable: Observable<any> = new Observable(observer => {
      const url = this.urlBase + '/hassession?user=' + user + '&sessionid=' + sessionId;
      this.httpClient.get(url).subscribe(resp => {
        observer.next(resp);
      }, error => observer.error(error));
    });
    return dataObservable.pipe(share());
  }

  public query(kv?: object, av?: Array<string>, entity?: string, sqltypes?: object): Observable<any> {
    entity = (Util.isDefined(entity)) ? entity : this.entity;
    // TODO improve this -> merge between global conf and specific params of method calling
    kv = (Util.isDefined(kv)) ? kv : this.kv;
    av = (Util.isDefined(av)) ? av : this.av;
    sqltypes = (Util.isDefined(sqltypes)) ? sqltypes : this.sqltypes;

    const url = `${this.urlBase}/query`;

    const body = JSON.stringify({
      user: this.user,
      sessionid: this.authService.getSessionInfo().id,
      type: 1,
      entity: entity,
      kv: kv,
      av: av,
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

  queryById(kv?: object, av?: string[], entity?: string, sqltypes?: object): Observable<ServiceResponse> {
    return this.query(kv, av, entity, sqltypes);
  }

  public advancedQuery(kv?: object, av?: Array<string>, entity?: string, sqltypes?: object,
    offset?: number, pagesize?: number, orderby?: Array<object>): Observable<any> {

    entity = (Util.isDefined(entity)) ? entity : this.entity;
    // TODO improve this -> merge between global conf and specific params of method calling
    kv = (Util.isDefined(kv)) ? kv : this.kv;
    av = (Util.isDefined(av)) ? av : this.av;
    sqltypes = (Util.isDefined(sqltypes)) ? sqltypes : this.sqltypes;
    orderby = (Util.isDefined(orderby)) ? orderby : this.orderby;
    offset = (Util.isDefined(offset)) ? offset : this.offset;
    pagesize = (Util.isDefined(pagesize)) ? pagesize : this.pagesize;

    const url = `${this.urlBase}/advancedquery`;

    const body = JSON.stringify({
      user: this.user,
      sessionid: this.authService.getSessionInfo().id,
      type: 1,
      entity: entity,
      kv: kv,
      av: av,
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

  public insert(av: object = {}, entity?: string, sqltypes?: object): Observable<any> {
    entity = (Util.isDefined(entity)) ? entity : this.entity;
    av = (Util.isDefined(av)) ? av : this.av;
    sqltypes = (Util.isDefined(sqltypes)) ? sqltypes : this.sqltypes;

    const url = `${this.urlBase}/insert`;

    const body = JSON.stringify({
      user: this.user,
      sessionid: this.authService.getSessionInfo().id,
      entity: entity,
      av: av,
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


  public update(kv: object = {}, av: object = {}, entity?: string, sqltypes?: object): Observable<any> {
    entity = (Util.isDefined(entity)) ? entity : this.entity;
    kv = (Util.isDefined(kv)) ? kv : this.kv;
    av = (Util.isDefined(av)) ? av : this.av;
    sqltypes = (Util.isDefined(sqltypes)) ? sqltypes : this.sqltypes;

    const url = `${this.urlBase}/update`;

    const body = JSON.stringify({
      user: this.user,
      sessionid: this.authService.getSessionInfo().id,
      entity: entity,
      kv: kv,
      av: av,
      sqltypes: sqltypes
    });

    return this.doRequest({
      method: 'POST',
      url: url,
      body: body,
      successCallback: this.parseSuccessfulUpdateResponse,
      errorCallBack: this.parseUnsuccessfulUpdateResponse
    });
  }

  public delete(kv: object = {}, entity?: string, sqltypes?: object): Observable<any> {
    entity = (Util.isDefined(entity)) ? entity : this.entity;
    kv = (Util.isDefined(kv)) ? kv : this.kv;
    sqltypes = (Util.isDefined(sqltypes)) ? sqltypes : this.sqltypes;

    const url = `${this.urlBase}/delete`;

    const body = JSON.stringify({
      user: this.user,
      sessionid: this.authService.getSessionInfo().id,
      entity: entity,
      kv: kv,
      sqltypes: sqltypes
    });

    return this.doRequest({
      method: 'POST',
      url: url,
      body: body,
      successCallback: this.parseSuccessfulDeleteResponse,
      errorCallBack: this.parseUnsuccessfulDeleteResponse
    });
  }

}
