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
export class OntimizeEEService implements IAuthService, IDataService {

  public path: string = '';
  public kv: Object = {};
  public av: Array<string> = [];
  public sqltypes: Object = {};
  public pagesize: number = 10;
  public offset: number = 0;
  public orderby: Array<Object> = [];
  public totalsize: number = -1;

  protected httpClient: HttpClient;
  protected _sessionid: string;
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

  public getDefaultServiceConfiguration(serviceName?: string) {
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
    this.path = config.path;
    this._startSessionPath = this._appConfig['startSessionPath'] ? this._appConfig['startSessionPath'] : '/users/login';
    //TODO init other params
  }

  public get urlBase(): string {
    return this._urlBase;
  }

  public set urlBase(value: string) {
    this._urlBase = value;
  }

  public startsession(user: string, password: string) {
    const url = this.urlBase + this._startSessionPath;
    const options: any = {
      headers: new HttpHeaders({
        'Authorization': 'Basic ' + btoa(user + ':' + password)
      }),
      'observe': 'response'
    };
    let _startSessionObserver: any;
    const startSessionObservable = new Observable(observer => _startSessionObserver = observer).share();

    this.httpClient.post(url, null, options).subscribe((resp: any) => {
      if (Util.isDefined(resp) && Util.isDefined(resp.headers) && Util.isDefined(resp.headers.get('X-Auth-Token'))) {
        _startSessionObserver.next(resp.headers.get('X-Auth-Token'));
      } else {
        // Invalid sessionId...
        _startSessionObserver.error('Invalid user or password');
      }
    }, error => _startSessionObserver.error(error));
    return startSessionObservable;
  }

  public endsession(user: string, sessionId: any): Observable<any> {
    let _closeSessionObserver: any;
    const closeSessionObservable = new Observable(observer => _closeSessionObserver = observer).share();
    setTimeout(() => {
      _closeSessionObserver.next(0);
    }, 0);
    return closeSessionObservable;
  }

  public hassession(user: string, sessionId: any): Observable<any> {
    let _observer: any;
    const observable = new Observable(observer => _observer = observer).share();
    return observable;
  }

  public query(kv?: Object, av?: Array<string>, entity?: string, sqltypes?: Object): Observable<any> {
    //TODO improve this -> merge between global conf and specific params of method calling
    kv = (Util.isDefined(kv)) ? kv : this.kv;
    av = (Util.isDefined(av)) ? av : this.av;
    sqltypes = (Util.isDefined(sqltypes)) ? sqltypes : this.sqltypes;

    const url = this._urlBase + this.path + '/' + entity + '/search';
    const options = {
      headers: this.buildHeaders()
    };
    const body = JSON.stringify({
      filter: kv,
      columns: av,
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

  public advancedQuery(kv?: Object, av?: Array<string>, entity?: string, sqltypes?: Object,
    offset?: number, pagesize?: number, orderby?: Array<Object>): Observable<any> {

    //TODO improve this -> merge between global conf and specific params of method calling
    kv = (Util.isDefined(kv)) ? kv : this.kv;
    av = (Util.isDefined(av)) ? av : this.av;
    sqltypes = (Util.isDefined(sqltypes)) ? sqltypes : this.sqltypes;
    orderby = (Util.isDefined(orderby)) ? orderby : this.orderby;

    offset = (Util.isDefined(offset)) ? offset : this.offset;
    pagesize = (Util.isDefined(pagesize)) ? pagesize : this.pagesize;

    const url = this._urlBase + this.path + '/' + entity + '/advancedsearch';
    const options = {
      headers: this.buildHeaders()
    };
    const body = JSON.stringify({
      filter: kv,
      columns: av,
      sqltypes: sqltypes,
      offset: offset,
      pageSize: pagesize,
      orderBy: orderby
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

  public insert(av: Object = {}, entity: string, sqltypes?: Object): Observable<any> {
    const url = this._urlBase + this.path + '/' + entity;
    const options = {
      headers: this.buildHeaders()
    };
    const body = JSON.stringify({
      data: av,
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
    const url = this._urlBase + this.path + '/' + entity;
    const options = {
      headers: this.buildHeaders()
    };
    const body = JSON.stringify({
      filter: kv,
      data: av,
      sqltypes: sqltypes
    });

    let _innerObserver: any;
    const dataObservable = new Observable(observer => _innerObserver = observer).share();
    const self = this;
    this.httpClient.put(url, body, options).subscribe(resp => {
      self.parseSuccessfulResponse(resp, _innerObserver);
    }, error => {
      self.parseUnsuccessfulResponse(error, _innerObserver);
    }, () => _innerObserver.complete());
    return dataObservable;
  }

  public delete(kv: Object = {}, entity?: string, sqltypes?: Object): Observable<any> {
    const url = this._urlBase + this.path + '/' + entity;
    const headers: HttpHeaders = this.buildHeaders();
    const options: any = {
      headers: headers,
      body: JSON.stringify({
        filter: kv,
        sqltypes: sqltypes
      })
    };
    let _innerObserver: any;
    const dataObservable = new Observable(observer => _innerObserver = observer).share();
    const self = this;
    this.httpClient.delete(url, options).subscribe(resp => {
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
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': 'Bearer ' + this._sessionid
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
