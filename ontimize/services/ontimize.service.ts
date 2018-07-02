import { Injector, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

import { LoginService } from '../services';
import { AppConfig, Config } from '../config/app-config';
import { IAuthService, IDataService, Util, Codes, ServiceUtils } from '../utils';
import { OntimizeServiceResponseParser } from './parser/o-service-response.parser';

@Injectable()
export class OntimizeService implements IAuthService, IDataService {

  public entity: string = '';
  public kv: Object = {};
  public av: Array<string> = [];
  public sqltypes: Object = {};
  public pagesize: number = 10;
  public offset: number = 0;
  public orderby: Array<Object> = [];
  public totalsize: number = -1;

  protected httpClient: HttpClient;
  protected _sessionid: number = -1;
  protected _user: string;
  protected _urlBase: string;
  protected _appConfig: Config;
  protected _config: AppConfig;
  protected _startSessionPath: string;
  protected responseParser: OntimizeServiceResponseParser;

  constructor(protected injector: Injector) {
    this.httpClient = this.injector.get(HttpClient);
    this._config = this.injector.get(AppConfig);
    this._appConfig = this._config.getConfiguration();
    this.responseParser = this.injector.get(OntimizeServiceResponseParser);
  }

  public getDefaultServiceConfiguration(serviceName?: string): Object {
    let loginService = this.injector.get(LoginService);
    let configuration = this._config.getServiceConfiguration();

    let servConfig = {};
    if (serviceName && configuration.hasOwnProperty(serviceName)) {
      servConfig = configuration[serviceName];
    }
    servConfig[Codes.SESSION_KEY] = loginService.getSessionInfo();
    return servConfig;
  }

  public configureService(config: any): void {
    this._urlBase = config.urlBase ? config.urlBase : this._appConfig['apiEndpoint'];
    this._sessionid = config.session ? config.session.id : -1;
    this._user = config.session ? config.session.user : '';
    this._startSessionPath = this._appConfig['startSessionPath'] ? this._appConfig['startSessionPath'] : '/startsession';

    if (config.entity !== undefined) {
      this.entity = config.entity;
    }
    //TODO init other params like 'kv', 'av', etc.
  }

  public get urlBase(): string {
    return this._urlBase;
  }

  public set urlBase(value: string) {
    this._urlBase = value;
  }

  public startsession(user: string, password: string): Observable<any> {
    const url = this._urlBase + this._startSessionPath + '?user=' + user + '&password=' + password;
    let _startSessionObserver: any;
    const dataObservable = new Observable(observer => _startSessionObserver = observer).share();

    this.httpClient.get(url).subscribe(resp => {
      if (resp >= 0) {
        _startSessionObserver.next(resp);
      } else {
        //Invalid sessionId...
        _startSessionObserver.error('Invalid user or password');
      }

    }, error => _startSessionObserver.error(error));

    return dataObservable;
  }

  public endsession(user: string, sessionId: number): Observable<any> {
    const url = this._urlBase + '/endsession?user=' + user + '&sessionid=' + sessionId;

    let _closeSessionObserver: any;
    const dataObservable = new Observable(observer => _closeSessionObserver = observer).share();

    this.httpClient.get(url).subscribe(resp => {
      _closeSessionObserver.next(resp);
    }, error => {
      if (error.status === 401 || error.status === 0 || !error.ok) {
        _closeSessionObserver.next(0);
      } else {
        _closeSessionObserver.error(error);
      }
    });
    return dataObservable;
  }

  public hassession(user: string, sessionId: number): Observable<any> {
    const url = this._urlBase + '/hassession?user=' + user + '&sessionid=' + sessionId;
    let _innerObserver: any;
    const dataObservable = new Observable(observer => _innerObserver = observer).share();
    this.httpClient.get(url).subscribe(resp => {
      _innerObserver.next(resp);
    }, error => _innerObserver.error(error));
    return dataObservable;
  }

  public query(kv?: Object, av?: Array<string>, entity?: string, sqltypes?: Object): Observable<any> {
    entity = (Util.isDefined(entity)) ? entity : this.entity;
    //TODO improve this -> merge between global conf and specific params of method calling
    kv = (Util.isDefined(kv)) ? kv : this.kv;
    av = (Util.isDefined(av)) ? av : this.av;
    sqltypes = (Util.isDefined(sqltypes)) ? sqltypes : this.sqltypes;

    const url = this._urlBase + '/query';
    const options = {
      headers: this.buildHeaders()
    };
    const body = JSON.stringify({
      user: this._user,
      sessionid: this._sessionid,
      type: 1,
      entity: entity,
      kv: kv,
      av: av,
      sqltypes: sqltypes
    });

    const self = this;
    let _innerObserver: any;
    const dataObservable = new Observable(observer => _innerObserver = observer).share();

    this.httpClient.post(url, body, options).subscribe(resp => {
      self.parseSuccessfulResponse(resp, _innerObserver);
    }, error => {
      self.parseUnsuccessfulResponse(error, _innerObserver);
    }, () => _innerObserver.complete());
    return dataObservable;
  }

  public advancedQuery(kv?: Object, av?: Array<string>, entity?: string, sqltypes?: Object,
    offset?: number, pagesize?: number, orderby?: Array<Object>): Observable<any> {

    entity = (Util.isDefined(entity)) ? entity : this.entity;
    //TODO improve this -> merge between global conf and specific params of method calling
    kv = (Util.isDefined(kv)) ? kv : this.kv;
    av = (Util.isDefined(av)) ? av : this.av;
    sqltypes = (Util.isDefined(sqltypes)) ? sqltypes : this.sqltypes;
    orderby = (Util.isDefined(orderby)) ? orderby : this.orderby;
    offset = (Util.isDefined(offset)) ? offset : this.offset;
    pagesize = (Util.isDefined(pagesize)) ? pagesize : this.pagesize;

    const url = this._urlBase + '/advancedquery';
    const options = {
      headers: this.buildHeaders()
    };
    const body = JSON.stringify({
      user: this._user,
      sessionid: this._sessionid,
      type: 1,
      entity: entity,
      kv: kv,
      av: av,
      sqltypes: sqltypes,
      offset: offset,
      pageSize: pagesize,
      orderBy: orderby
    });

    const self = this;
    let _innerObserver: any;
    const dataObservable = new Observable(observer => _innerObserver = observer).share();

    this.httpClient.post(url, body, options).subscribe(resp => {
      self.parseSuccessfulResponse(resp, _innerObserver);
    }, error => {
      self.parseUnsuccessfulResponse(error, _innerObserver);
    }, () => _innerObserver.complete());
    return dataObservable;
  }

  public insert(av: Object = {}, entity?: string, sqltypes?: Object): Observable<any> {
    entity = (Util.isDefined(entity)) ? entity : this.entity;
    av = (Util.isDefined(av)) ? av : this.av;
    sqltypes = (Util.isDefined(sqltypes)) ? sqltypes : this.sqltypes;

    const url = this._urlBase + '/insert';
    const options = {
      headers: this.buildHeaders()
    };
    const body = JSON.stringify({
      user: this._user,
      sessionid: this._sessionid,
      entity: entity,
      av: av,
      sqltypes: sqltypes
    });
    let _innerObserver: any;
    const dataObservable = new Observable(observer => _innerObserver = observer).share();

    const self = this;
    this.httpClient.post(url, body, options).subscribe(resp => {
      self.parseSuccessfulResponse(resp, _innerObserver);
    }, error => {
      self.parseUnsuccessfulResponse(error, _innerObserver);
    }, () => _innerObserver.complete());
    return dataObservable;
  }

  public update(kv: Object = {}, av: Object = {}, entity?: string, sqltypes?: Object): Observable<any> {
    entity = (Util.isDefined(entity)) ? entity : this.entity;
    kv = (Util.isDefined(kv)) ? kv : this.kv;
    av = (Util.isDefined(av)) ? av : this.av;
    sqltypes = (Util.isDefined(sqltypes)) ? sqltypes : this.sqltypes;

    const url = this._urlBase + '/update';
    const options = {
      headers: this.buildHeaders()
    };
    const body = JSON.stringify({
      user: this._user,
      sessionid: this._sessionid,
      entity: entity,
      kv: kv,
      av: av,
      sqltypes: sqltypes
    });

    const self = this;
    let _innerObserver: any;
    const dataObservable = new Observable(observer => _innerObserver = observer).share();

    this.httpClient.post(url, body, options).subscribe(resp => {
      self.parseSuccessfulResponse(resp, _innerObserver);
    }, error => {
      self.parseUnsuccessfulResponse(error, _innerObserver);
    }, () => _innerObserver.complete());
    return dataObservable;
  }

  public delete(kv: Object = {}, entity?: string, sqltypes?: Object): Observable<any> {
    entity = (Util.isDefined(entity)) ? entity : this.entity;
    kv = (Util.isDefined(kv)) ? kv : this.kv;
    sqltypes = (Util.isDefined(sqltypes)) ? sqltypes : this.sqltypes;

    const url = this._urlBase + '/delete';
    const options = {
      headers: this.buildHeaders()
    };
    const body = JSON.stringify({
      user: this._user,
      sessionid: this._sessionid,
      entity: entity,
      kv: kv,
      sqltypes: sqltypes
    });

    const self = this;
    let _innerObserver: any;
    const dataObservable = new Observable(observer => _innerObserver = observer).share();

    this.httpClient.post(url, body, options).subscribe(resp => {
      self.parseSuccessfulResponse(resp, _innerObserver);
    }, error => {
      self.parseUnsuccessfulResponse(error, _innerObserver);
    }, () => _innerObserver.complete());
    return dataObservable;
  }

  redirectLogin(sessionExpired: boolean = false) {
    let router = this.injector.get(Router);
    ServiceUtils.redirectLogin(router, sessionExpired);
  }

  protected buildHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json;charset=UTF-8'
    });
  }

  isNullOrUndef(value: any): boolean {
    return !Util.isDefined(value);
  }

  protected parseSuccessfulResponse(resp: any, _innerObserver: any) {
    this.responseParser.parseSuccessfulResponse(resp, _innerObserver, this);
  }

  protected parseUnsuccessfulResponse(error: any, _innerObserver: any) {
    this.responseParser.parseUnsuccessfulResponse(error, _innerObserver, this);
  }
}
