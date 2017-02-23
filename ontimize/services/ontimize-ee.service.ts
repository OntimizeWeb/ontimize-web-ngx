import {Injector, Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, RequestMethod} from '@angular/http';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

import {IAuthService, IDataService} from '../interfaces';
import {LoginService, SERVICE_CONFIG} from '../services';
import {APP_CONFIG, Config} from '../config/app-config';


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
  protected _appConfig:Config;


  constructor( protected injector: Injector) {

    this.http = this.injector.get(Http);
    this._appConfig = this.injector.get(APP_CONFIG);
  }

  public getDefaultServiceConfiguration(serviceName?: string) {
    let loginService = this.injector.get(LoginService);
    let configuration = this.injector.get(SERVICE_CONFIG);

    let servConfig = {};
    if (serviceName && configuration.hasOwnProperty(serviceName)) {
      servConfig = configuration[serviceName];
    }
    servConfig['session'] = loginService.getSessionInfo();
    return servConfig;
  }

  public configureService(config: any): void {
    this._urlBase = config.urlBase ? config.urlBase : this._appConfig['apiEndpoint'] ;
    this._sessionid = config.session ? config.session.id : -1;
    this.path = config.path;
    //TODO init other params
  }

  public get urlBase(): string {
    return this._urlBase;
  }

  public set urlBase(value: string) {
    this._urlBase = value;
  }

  public startsession(user: string, password: string) {

    var url = this.urlBase + '/users/login';

    var headers: Headers = new Headers();
    let authorization = 'Basic ' + btoa(user + ':' + password);
    headers.append('Authorization', authorization);
    var options = new RequestOptions({
      headers: headers
    });

    var body = JSON.stringify({});

    let _startSessionObserver: any;
    let startSessionObservable = new Observable(observer =>
      _startSessionObserver = observer).share();

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
    let closeSessionObservable = new Observable(observer =>
      _closeSessionObserver = observer).share();

    return closeSessionObservable;
  }

  public hassession(user: string, sessionId: any): Observable<any> {
    let _observer: any;
    let observable = new Observable(observer =>
      _observer = observer).share();

    return observable;
  }

  public query(kv?: Object, av?: Array<string>, entity?: string, sqltypes?: Object): Observable<any> {

    //TODO improve this -> merge between global conf and specific params of method calling
    kv = (this.isNullOrUndef(kv)) ? this.kv : kv;
    av = (this.isNullOrUndef(av)) ? this.av : av;
    sqltypes = (this.isNullOrUndef(sqltypes)) ? this.sqltypes : sqltypes;

    var url = this._urlBase + this.path +'/'+ entity + '/search';

    var headers: Headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json;charset=UTF-8');

    let authorizationToken = 'Bearer '+ this._sessionid;
    headers.append('Authorization', authorizationToken);

    var body = JSON.stringify({
      filter: kv,
      columns: av,
      sqltypes: sqltypes
    });

    let _innerObserver: any;
    let dataObservable = new Observable(observer =>
        _innerObserver = observer).share();

    var self = this;
    this.http
      .post(url, body, { headers: headers })
      .map(response => response.json())
      .subscribe(resp => {
        if (resp && resp.code === 3) {
          self.redirectLogin(true);
        } else if (resp.code === 1) {
          _innerObserver.error(resp.message);
        } else if (resp.code === 0) {
          _innerObserver.next(resp);
        } else {
          //Unknow state -> error
          _innerObserver.error('Service unavailable');
        }
      }, error => {
        if (error.status === 401) {
          self.redirectLogin(true);
        } else {
          _innerObserver.error(error);
        }
      },
      () => _innerObserver.complete());

    return dataObservable;
  }

  public advancedQuery(kv?: Object, av?: Array<string>, entity?: string, sqltypes?: Object,
    offset?: number, pagesize?: number, orderby?: Array<Object>): Observable<any> {

    // entity = (this.isNullOrUndef(entity)) ? this.entity : entity;

    //TODO improve this -> merge between global conf and specific params of method calling
    /*TODO implements paginable services....
    kv = (this.isNullOrUndef(kv)) ? this.kv : kv;
    av = (this.isNullOrUndef(av)) ? this.av : av;
    sqltypes = (this.isNullOrUndef(sqltypes)) ? this.sqltypes : sqltypes;
    if (offset) {
      this.offset = offset;
    }
    if (pagesize) {
      this.pagesize = pagesize;
    }
    if (orderby) {
      this.orderby = orderby;
    }

    var url = this._urlBase + '/advancedquery';

    var headers: Headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json;charset=UTF-8');

    var params = JSON.stringify({
      sessionid: this._sessionid,
      type: 1,
      entity: entity,
      kv: kv,
      av: av,
      sqltypes: sqltypes,
      offset: this.offset,
      pageSize: this.pagesize,
      orderBy: this.orderby
    });

    var self = this;
    this._http
      .post(url, params, { headers: headers })
      .map(response => response.json())
      .subscribe(resp => {
        if (resp && resp.code === 3) {
          self.redirectLogin(true);
        } else if (resp.code === 1) {
          this._innerObserver.error(resp.message);
        } else if (resp.code === 0) {
          self._dataStore = resp;
          self._innerObserver.next(self._dataStore);
        } else {
          //Unknow state -> error
          this._innerObserver.error('Service unavailable');
        }
      }, error => this._innerObserver.error(error),
      () => this._innerObserver.complete());
      */
    let _innerObserver: any;
    let dataObservable = new Observable(observer =>
        _innerObserver = observer).share();

    return dataObservable;
  }

  public insert(av: Object = {}, entity: string, sqltypes?: Object): Observable<any> {

    var url = this._urlBase + this.path +'/'+ entity;

    var headers: Headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json;charset=UTF-8');

    let authorizationToken = 'Bearer '+ this._sessionid;
    headers.append('Authorization', authorizationToken);

    var body = JSON.stringify({
      data: av,
      sqltypes : sqltypes
    });

    let _innerObserver: any;
    let dataObservable = new Observable(observer =>
        _innerObserver = observer).share();

    var self = this;
    this.http
      .post(url, body, { headers: headers })
      .map(response => response.json())
      .subscribe(resp => {
        if (resp.code === 3) {
          self.redirectLogin(true);
        } else if (resp.code === 1) {
          _innerObserver.error(resp.message);
        } else if (resp.code === 0) {
          _innerObserver.next(resp);
        } else {
          //Unknow state -> error
          _innerObserver.error('Service unavailable');
        }
      },  error => {
        if (error.status === 401) {
          self.redirectLogin(true);
        } else {
          _innerObserver.error(error);
        }
      },
      () => _innerObserver.complete());

    return dataObservable;
  }

  public update(kv: Object = {}, av: Object = {}, entity?: string, sqltypes?: Object): Observable<any> {

    var url = this._urlBase + this.path +'/'+ entity;

    var headers: Headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json;charset=UTF-8');

    let authorizationToken = 'Bearer '+ this._sessionid;
    headers.append('Authorization', authorizationToken);

    var body = JSON.stringify({
      filter: kv,
      data: av,
      sqltypes: sqltypes
    });

    let _innerObserver: any;
    let dataObservable = new Observable(observer =>
        _innerObserver = observer).share();

    var self = this;
    this.http
      .put(url, body, { headers: headers })
      .map(response => response.json())
      .subscribe(resp => {
        if (resp && resp.code === 3) {
          self.redirectLogin(true);
        } else if (resp.code === 1) {
          _innerObserver.error(resp.message);
        } else if (resp.code === 0) {
          _innerObserver.next(resp);
        } else {
          //Unknow state -> error
          _innerObserver.error('Service unavailable');
        }
      },  error => {
        if (error.status === 401) {
          self.redirectLogin(true);
        } else {
          _innerObserver.error(error);
        }
      },
      () => _innerObserver.complete());

    return dataObservable;
  }

  public delete(kv: Object = {}, entity?: string, sqltypes?: Object): Observable<any> {

    var url = this._urlBase + this.path +'/'+ entity;

    var headers: Headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json;charset=UTF-8');

    let authorizationToken = 'Bearer '+ this._sessionid;
    headers.append('Authorization', authorizationToken);

    var body = JSON.stringify({
      filter: kv,
      sqltypes: sqltypes
    });

    let options = new RequestOptions({
      method : RequestMethod.Delete,
      headers : headers,
      body : body
    });

    let _innerObserver: any;
    let dataObservable = new Observable(observer =>
        _innerObserver = observer).share();

    var self = this;
    this.http
      .request(url, options)
      .map(response => response.json())
      .subscribe(resp => {
        if (resp && resp.code === 3) {
          self.redirectLogin(true);
        } else if (resp.code === 1) {
          _innerObserver.error(resp.message);
        } else if (resp.code === 0) {
          _innerObserver.next(resp);
        } else {
          //Unknow state -> error
          _innerObserver.error('Service unavailable');
        }
      },  error => {
        if (error.status === 401) {
          self.redirectLogin(true);
        } else {
          _innerObserver.error(error);
        }
      },
      () => _innerObserver.complete());

    return dataObservable;
  }

  protected redirectLogin(sessionExpired: boolean = false) {
    let router = this.injector.get(Router);
    router.navigate(['/login', { 'session-expired': sessionExpired }]);
  }

  protected isNullOrUndef(arg: any): boolean {
    if (arg === null || arg === undefined) {
      return true;
    }
    return false;
  }

}
