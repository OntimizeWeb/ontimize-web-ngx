import { Injector, Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

import { LoginService } from '../services';
import { AppConfig, Config } from '../config/app-config';
import { IAuthService, IDataService, Util } from '../util/util';
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

  protected http: Http;
  protected _sessionid: string;
  protected _urlBase: string;
  protected _appConfig: Config;
  protected _config: AppConfig;
  protected _startSessionPath: string;
  protected responseParser: OntimizeServiceResponseParser;

  constructor(protected injector: Injector) {
    this.http = this.injector.get(Http);
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
    servConfig['session'] = loginService.getSessionInfo();
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
    const headers: Headers = new Headers();
    const authorization = 'Basic ' + btoa(user + ':' + password);
    headers.append('Authorization', authorization);
    const options = new RequestOptions({
      headers: headers
    });

    const body = JSON.stringify({});

    let _startSessionObserver: any;
    const startSessionObservable = new Observable(observer => _startSessionObserver = observer).share();

    this.http
      .post(url, body, options)
      .map((res: any) => res.headers.get('X-Auth-Token'))
      .subscribe(resp => {
        if (resp !== undefined) {
          _startSessionObserver.next(resp);
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

    const headers: Headers = this.buildHeaders();

    const body = JSON.stringify({
      filter: kv,
      columns: av,
      sqltypes: sqltypes
    });

    let _innerObserver: any;
    const dataObservable = new Observable(observer => _innerObserver = observer).share();

    const self = this;
    this.http
      .post(url, body, { headers: headers })
      .map(response => response.json())
      .subscribe(resp => {
        self.responseParser.parseSuccessfulResponse(resp, _innerObserver, this);
      }, error => {
        self.responseParser.parseUnsuccessfulResponse(error, _innerObserver, this);
      },
      () => _innerObserver.complete());

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

    const headers: Headers = this.buildHeaders();

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
    this.http
      .post(url, body, { headers: headers })
      .map(response => response.json())
      .subscribe(resp => {
        self.responseParser.parseSuccessfulResponse(resp, _innerObserver, this);
      }, error => {
        self.responseParser.parseUnsuccessfulResponse(error, _innerObserver, this);
      },
      () => _innerObserver.complete());
    return dataObservable;
  }

  public insert(av: Object = {}, entity: string, sqltypes?: Object): Observable<any> {

    const url = this._urlBase + this.path + '/' + entity;

    const headers: Headers = this.buildHeaders();

    const body = JSON.stringify({
      data: av,
      sqltypes: sqltypes
    });

    let _innerObserver: any;
    const dataObservable = new Observable(observer => _innerObserver = observer).share();

    const self = this;
    this.http
      .post(url, body, { headers: headers })
      .map(response => response.json())
      .subscribe(resp => {
        self.responseParser.parseSuccessfulResponse(resp, _innerObserver, this);
      }, error => {
        self.responseParser.parseUnsuccessfulResponse(error, _innerObserver, this);
      },
      () => _innerObserver.complete());
    return dataObservable;
  }

  public update(kv: Object = {}, av: Object = {}, entity?: string, sqltypes?: Object): Observable<any> {

    const url = this._urlBase + this.path + '/' + entity;

    const headers: Headers = this.buildHeaders();

    const body = JSON.stringify({
      filter: kv,
      data: av,
      sqltypes: sqltypes
    });

    let _innerObserver: any;
    const dataObservable = new Observable(observer => _innerObserver = observer).share();

    const self = this;
    this.http
      .put(url, body, { headers: headers })
      .map(response => response.json())
      .subscribe(resp => {
        self.responseParser.parseSuccessfulResponse(resp, _innerObserver, this);
      }, error => {
        self.responseParser.parseUnsuccessfulResponse(error, _innerObserver, this);
      },
      () => _innerObserver.complete());

    return dataObservable;
  }

  public delete(kv: Object = {}, entity?: string, sqltypes?: Object): Observable<any> {

    const url = this._urlBase + this.path + '/' + entity;

    const headers: Headers = this.buildHeaders();

    const body = JSON.stringify({
      filter: kv,
      sqltypes: sqltypes
    });

    const options = new RequestOptions({
      method: RequestMethod.Delete,
      headers: headers,
      body: body
    });

    let _innerObserver: any;
    const dataObservable = new Observable(observer => _innerObserver = observer).share();

    const self = this;
    this.http
      .request(url, options)
      .map(response => response.json())
      .subscribe(resp => {
        self.responseParser.parseSuccessfulResponse(resp, _innerObserver, this);
      }, error => {
        self.responseParser.parseUnsuccessfulResponse(error, _innerObserver, this);
      },
      () => _innerObserver.complete());
    return dataObservable;
  }

  redirectLogin(sessionExpired: boolean = false) {
    let router = this.injector.get(Router);
    router.navigate(['/login', { 'session-expired': sessionExpired }]);
  }

  protected buildHeaders(): Headers {
    const headers: Headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json;charset=UTF-8');

    const authorizationToken = 'Bearer ' + this._sessionid;
    headers.append('Authorization', authorizationToken);

    return headers;
  }

}
