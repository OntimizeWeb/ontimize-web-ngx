import { Injector, Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

import { LoginService } from '../services';
import {
  AppConfig,
  Config
} from '../config/app-config';

import { IAuthService, IDataService } from '../util/util';

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

  protected http: Http;
  protected _sessionid: number = -1;
  protected _user: string;
  protected _urlBase: string;
  protected _appConfig: Config;
  protected _config: AppConfig;
  protected _startSessionPath: string;

  constructor(protected injector: Injector) {
    this.http = this.injector.get(Http);
    this._config = this.injector.get(AppConfig);
    this._appConfig = this._config.getConfiguration();
  }

  public getDefaultServiceConfiguration(serviceName?: string): Object {
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

    var url = this._urlBase + this._startSessionPath + '?user=' + user + '&password=' + password;

    /* TODO
     var headers: Headers = new Headers();
        headers.append('Access-Control-Allow-Origin', '*');
      var params = JSON.stringify({});

        var options = new RequestOptions({
          url: url,
          method: RequestMethod.Get,
          search: params,
          headers: headers,
          body: params
        });*/

    let _startSessionObserver: any;
    let startSessionObservable = new Observable(observer =>
      _startSessionObserver = observer).share();

    this.http
      .get(url)
      .map((res: any) => res.json())
      .subscribe(resp => {
        if (resp >= 0) {
          _startSessionObserver.next(resp);
        } else {
          //Invalid sessionId...
          _startSessionObserver.error('Invalid user or password');
        }

      }, error => _startSessionObserver.error(error));

    return startSessionObservable;
  }

  public endsession(user: string, sessionId: number): Observable<any> {

    var url = this._urlBase + '/endsession?user=' + user + '&sessionid=' + sessionId;

    let _closeSessionObserver: any;
    let closeSessionObservable = new Observable(observer =>
      _closeSessionObserver = observer).share();

    this.http
      .get(url)
      .map((res: any) => res.json())
      .subscribe(resp => {
        _closeSessionObserver.next(resp);
      }, error => _closeSessionObserver.error(error));

    return closeSessionObservable;
  }

  public hassession(user: string, sessionId: number): Observable<any> {

    var url = this._urlBase + '/hassession?user=' + user + '&sessionid=' + sessionId;
    let _innerObserver: any;
    let dataObservable = new Observable(observer =>
      _innerObserver = observer).share();

    this.http
      .get(url)
      .map((res: any) => res.json())
      .subscribe(resp => {
        _innerObserver.next(resp);
      }, error => _innerObserver.error(error));
    return dataObservable;
  }

  public query(kv?: Object, av?: Array<string>, entity?: string, sqltypes?: Object): Observable<any> {
    entity = (this.isNullOrUndef(entity)) ? this.entity : entity;

    //TODO improve this -> merge between global conf and specific params of method calling
    kv = (this.isNullOrUndef(kv)) ? this.kv : kv;
    av = (this.isNullOrUndef(av)) ? this.av : av;
    sqltypes = (this.isNullOrUndef(sqltypes)) ? this.sqltypes : sqltypes;

    var url = this._urlBase + '/query';

    var headers: Headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json;charset=UTF-8');

    var params = JSON.stringify({
      user: this._user,
      sessionid: this._sessionid,
      type: 1,
      entity: entity,
      kv: kv,
      av: av,
      sqltypes: sqltypes
    });

    var self = this;
    let _innerObserver: any;
    let dataObservable = new Observable(observer =>
      _innerObserver = observer).share();

    this.http
      .post(url, params, { headers: headers })
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
      }, error => _innerObserver.error(error),
      () => _innerObserver.complete());

    return dataObservable;
  }

  public advancedQuery(kv?: Object, av?: Array<string>, entity?: string, sqltypes?: Object,
    offset?: number, pagesize?: number, orderby?: Array<Object>): Observable<any> {
    entity = (this.isNullOrUndef(entity)) ? this.entity : entity;

    //TODO improve this -> merge between global conf and specific params of method calling
    kv = (this.isNullOrUndef(kv)) ? this.kv : kv;
    av = (this.isNullOrUndef(av)) ? this.av : av;
    sqltypes = (this.isNullOrUndef(sqltypes)) ? this.sqltypes : sqltypes;
    if (!this.isNullOrUndef(offset)) {
      this.offset = offset;
    }
    if (!this.isNullOrUndef(pagesize)) {
      this.pagesize = pagesize;
    }
    if (!this.isNullOrUndef(orderby)) {
      this.orderby = orderby;
    }

    var url = this._urlBase + '/advancedquery';

    var headers: Headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json;charset=UTF-8');

    var params = JSON.stringify({
      user: this._user,
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
    let _innerObserver: any;
    let dataObservable = new Observable(observer => _innerObserver = observer).share();

    this.http
      .post(url, params, { headers: headers })
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
      }, error => _innerObserver.error(error),
      () => _innerObserver.complete());

    return dataObservable;
  }

  public insert(av: Object = {}, entity?: string, sqltypes?: Object): Observable<any> {
    entity = (this.isNullOrUndef(entity)) ? this.entity : entity;

    av = (this.isNullOrUndef(av)) ? this.av : av;
    sqltypes = (this.isNullOrUndef(sqltypes)) ? this.sqltypes : sqltypes;

    var url = this._urlBase + '/insert';

    var headers: Headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json;charset=UTF-8');

    var params = JSON.stringify({
      user: this._user,
      sessionid: this._sessionid,
      entity: entity,
      av: av,
      sqltypes: sqltypes
    });

    var self = this;
    let _innerObserver: any;
    let dataObservable = new Observable(observer =>
      _innerObserver = observer).share();

    this.http
      .post(url, params, { headers: headers })
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
      }, error => _innerObserver.error(error),
      () => _innerObserver.complete());

    return dataObservable;
  }

  public update(kv: Object = {}, av: Object = {}, entity?: string, sqltypes?: Object): Observable<any> {
    entity = (this.isNullOrUndef(entity)) ? this.entity : entity;

    kv = (this.isNullOrUndef(kv)) ? this.kv : kv;
    av = (this.isNullOrUndef(av)) ? this.av : av;
    sqltypes = (this.isNullOrUndef(sqltypes)) ? this.sqltypes : sqltypes;

    var url = this._urlBase + '/update';

    var headers: Headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json;charset=UTF-8');

    var params = JSON.stringify({
      user: this._user,
      sessionid: this._sessionid,
      entity: entity,
      kv: kv,
      av: av,
      sqltypes: sqltypes
    });

    var self = this;
    let _innerObserver: any;
    let dataObservable = new Observable(observer =>
      _innerObserver = observer).share();

    this.http
      .post(url, params, { headers: headers })
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
      }, error => _innerObserver.error(error),
      () => _innerObserver.complete());

    return dataObservable;
  }

  public delete(kv: Object = {}, entity?: string, sqltypes?: Object): Observable<any> {
    entity = (this.isNullOrUndef(entity)) ? this.entity : entity;

    kv = (this.isNullOrUndef(kv)) ? this.kv : kv;
    sqltypes = (this.isNullOrUndef(sqltypes)) ? this.sqltypes : sqltypes;

    var url = this._urlBase + '/delete';

    var headers: Headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json;charset=UTF-8');

    var params = JSON.stringify({
      user: this._user,
      sessionid: this._sessionid,
      entity: entity,
      kv: kv,
      sqltypes: sqltypes
    });

    var self = this;
    let _innerObserver: any;
    let dataObservable = new Observable(observer =>
      _innerObserver = observer).share();

    this.http
      .post(url, params, { headers: headers })
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
      }, error => _innerObserver.error(error),
      () => _innerObserver.complete());

    return dataObservable;
  }

  protected redirectLogin(sessionExpired: boolean = false) {
    let router = this.injector.get(Router);
    router.navigate(['/login'], {
      queryParams: { 'isdetail': 'true' }
    });
  }

  protected isNullOrUndef(arg: any): boolean {
    if (arg === null || arg === undefined) {
      return true;
    }
    return false;
  }

}
