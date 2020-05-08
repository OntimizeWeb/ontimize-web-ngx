import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscriber } from 'rxjs';
import { map, share } from 'rxjs/operators';

import { AppConfig } from '../config/app-config';
import { IAuthService } from '../interfaces/auth-service.interface';
import { ServiceResponseAdapter } from '../interfaces/service-response-adapter.interface';
import { ServiceResponse } from '../interfaces/service-response.interface';
import { Config } from '../types/config.type';
import { ServiceRequestParam } from '../types/service-request-param.type';
import { Codes } from '../util/codes';
import { ServiceUtils } from '../util/service.utils';
import { BaseServiceResponse } from './base-service-response.class';
import { LoginStorageService } from './login-storage.service';
import { OntimizeServiceResponseAdapter } from './ontimize/ontimize-service-response.adapter';
import { OntimizeServiceResponseParser } from './parser/o-service-response.parser';

export class BaseService implements IAuthService {

  public kv = {};
  public av: string[] = [];
  public sqltypes = {};
  public pagesize: number = 10;
  public offset: number = 0;
  public orderby: Array<object> = [];
  public totalsize: number = -1;

  protected httpClient: HttpClient;
  protected router: Router;
  protected _sessionid: string;
  protected _urlBase: string;
  protected _appConfig: Config;
  protected _config: AppConfig;
  protected _startSessionPath: string;
  protected responseParser: OntimizeServiceResponseParser;
  protected loginStorageService: LoginStorageService;
  protected adapter: ServiceResponseAdapter<BaseServiceResponse>;

  constructor(protected injector: Injector) {
    this.httpClient = this.injector.get(HttpClient);
    this.router = this.injector.get(Router);
    this._config = this.injector.get(AppConfig);
    this._appConfig = this._config.getConfiguration();
    this.responseParser = this.injector.get(OntimizeServiceResponseParser);
    this.loginStorageService = this.injector.get(LoginStorageService);
    this.configureAdapter();
  }

  public configureAdapter() {
    this.adapter = this.injector.get(OntimizeServiceResponseAdapter);
  }

  public configureService(config: any): void {
    this._urlBase = config.urlBase ? config.urlBase : this._appConfig.apiEndpoint;
    this._sessionid = config.session ? config.session.id : -1;
  }

  public getDefaultServiceConfiguration(serviceName?: string): any {
    const configuration = this._config.getServiceConfiguration();
    let servConfig = {};
    if (serviceName && configuration.hasOwnProperty(serviceName)) {
      servConfig = configuration[serviceName];
    }
    servConfig[Codes.SESSION_KEY] = this.loginStorageService.getSessionInfo();
    return servConfig;
  }

  public get urlBase(): string {
    return this._urlBase;
  }

  public set urlBase(value: string) {
    this._urlBase = value;
  }

  public startsession(user: string, password: string): Observable<any> {
    return null;
  }

  public endsession(user: string, sessionId: number): Observable<any> {
    return null;
  }

  public hassession(user: string, sessionId: string | number): Observable<boolean> {
    return null;
  }

  public redirectLogin(sessionExpired: boolean = false) {
    if (sessionExpired) {
      this.loginStorageService.sessionExpired();
    }
    ServiceUtils.redirectLogin(this.router, sessionExpired);
  }

  public doRequest(param: ServiceRequestParam): Observable<ServiceResponse> {

    const dataObservable: Observable<ServiceResponse> = new Observable((observer: Subscriber<ServiceResponse>) => {
      const options = param.options || {
        headers: this.buildHeaders()
      };
      options.observe = 'response';
      let requestObs: Observable<ServiceResponse>;
      switch (param.method) {
        case 'GET':
          requestObs = this.httpClient.get<ServiceResponse>(param.url, options);
          break;
        case 'PUT':
          requestObs = this.httpClient.put<ServiceResponse>(param.url, param.body, options);
          break;
        case 'DELETE':
          const deleteOptions = {
            headers: options.headers,
            body: param.body
          };
          requestObs = this.httpClient.delete<ServiceResponse>(param.url, deleteOptions);
          break;
        case 'POST':
        default:
          requestObs = this.httpClient.post<ServiceResponse>(param.url, param.body, options);
          break;
      }

      requestObs.pipe(
        map((data: any) => this.adapter.adapt(data))
      ).subscribe(resp => {
        (param.successCallback || this.parseSuccessfulResponse).bind(this)(resp, observer);
      }, error => {
        (param.errorCallBack || this.parseUnsuccessfulResponse).bind(this)(error, observer);
      }, () => observer.complete());
    });
    return dataObservable.pipe(share());
  }

  protected buildHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json;charset=UTF-8'
    });
  }

  /*
   * Successful response parsers, there is one parser for each CRUD method which calls to the common parser.
   * User can overwrite the chosen methods parsers or the common parser
   */
  protected parseSuccessfulResponse(resp: ServiceResponse, observer: Subscriber<ServiceResponse>) {
    this.responseParser.parseSuccessfulResponse(resp, observer, this);
  }

  protected parseSuccessfulQueryResponse(resp: ServiceResponse, observer: Subscriber<ServiceResponse>) {
    this.parseSuccessfulResponse(resp, observer);
  }

  protected parseSuccessfulAdvancedQueryResponse(resp: ServiceResponse, observer: Subscriber<ServiceResponse>) {
    this.parseSuccessfulResponse(resp, observer);
  }

  protected parseSuccessfulInsertResponse(resp: ServiceResponse, observer: Subscriber<ServiceResponse>) {
    this.parseSuccessfulResponse(resp, observer);
  }

  protected parseSuccessfulUpdateResponse(resp: ServiceResponse, observer: Subscriber<ServiceResponse>) {
    this.parseSuccessfulResponse(resp, observer);
  }

  protected parseSuccessfulDeleteResponse(resp: ServiceResponse, observer: Subscriber<ServiceResponse>) {
    this.parseSuccessfulResponse(resp, observer);
  }

  /*
   * Unsuccessful response parsers, there is one parser for each CRUD method which calls to the common parser.
   * User can overwrite the chosen methods parsers or the common parser
   */
  protected parseUnsuccessfulResponse(error: any, observer: Subscriber<ServiceResponse>) {
    this.responseParser.parseUnsuccessfulResponse(error, observer, this);
  }

  protected parseUnsuccessfulQueryResponse(resp: ServiceResponse, observer: Subscriber<ServiceResponse>) {
    this.parseUnsuccessfulResponse(resp, observer);
  }

  protected parseUnsuccessfulAdvancedQueryResponse(resp: ServiceResponse, observer: Subscriber<ServiceResponse>) {
    this.parseUnsuccessfulResponse(resp, observer);
  }

  protected parseUnsuccessfulInsertResponse(resp: ServiceResponse, observer: Subscriber<ServiceResponse>) {
    this.parseUnsuccessfulResponse(resp, observer);
  }

  protected parseUnsuccessfulUpdateResponse(resp: ServiceResponse, observer: Subscriber<ServiceResponse>) {
    this.parseUnsuccessfulResponse(resp, observer);
  }

  protected parseUnsuccessfulDeleteResponse(resp: ServiceResponse, observer: Subscriber<ServiceResponse>) {
    this.parseUnsuccessfulResponse(resp, observer);
  }

}
