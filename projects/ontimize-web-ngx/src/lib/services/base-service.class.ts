import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injector, Type } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscriber } from 'rxjs';
import { map, share } from 'rxjs/operators';

import { AppConfig } from '../config/app-config';
import { IServiceResponseAdapter } from '../interfaces/service-response-adapter.interface';
import { Config } from '../types/config.type';
import { ServiceRequestParam } from '../types/service-request-param.type';
import { Util } from '../util/util';
import { Codes } from '../util/codes';
import { AuthService } from './auth.service';
import { BaseServiceResponse } from './base-service-response.class';
import { LoginStorageService } from './login-storage.service';
import { OntimizeServiceResponseAdapter } from './ontimize/ontimize-service-response.adapter';
import { OntimizeServiceResponseParser } from './parser/o-service-response.parser';
import { HttpRequestOptions } from '../types/http-request-options.type';
import { BaseResponse } from '../interfaces/base-response.interface';


export class BaseService<T extends BaseResponse> {

  protected httpClient: HttpClient;
  protected router: Router;

  protected _urlBase: string;
  protected _appConfig: Config;
  protected _config: AppConfig;
  protected responseParser: OntimizeServiceResponseParser<T>;
  protected authService: AuthService;
  protected adapter: IServiceResponseAdapter<BaseServiceResponse>;
  protected loginStorageService: LoginStorageService;
  protected context: any;

  constructor(protected injector: Injector) {
    this.httpClient = this.injector.get<HttpClient>(HttpClient as Type<HttpClient>);
    this.router = this.injector.get<Router>(Router as Type<Router>);
    this._config = this.injector.get<AppConfig>(AppConfig as Type<AppConfig>);
    this._appConfig = this._config.getConfiguration();
    this.responseParser = this.injector.get<OntimizeServiceResponseParser<T>>(OntimizeServiceResponseParser as Type<OntimizeServiceResponseParser<T>>);
    this.authService = this.injector.get<AuthService>(AuthService as Type<AuthService>);
    this.loginStorageService = this.injector.get<LoginStorageService>(LoginStorageService)
  }

  public configureResponseAdapter() {
    this.adapter = this.injector.get(OntimizeServiceResponseAdapter);
    this.adapter.setContext(this.context);
  }


  public configureService(config: any): void {
    this._urlBase = config.urlBase ? config.urlBase : this._appConfig.apiEndpoint;
    this.context = config.context;
    this.configureResponseAdapter();
  }

  public getDefaultServiceConfiguration(serviceName?: string): any {
    const configuration = this._config.getServiceConfiguration();
    let servConfig = {};
    if (serviceName && configuration.hasOwnProperty(serviceName)) {
      servConfig = configuration[serviceName];
    }
    servConfig[Codes.SESSION_KEY] = this.authService.getSessionInfo();
    return servConfig;
  }

  public get urlBase(): string {
    return this._urlBase;
  }

  public set urlBase(value: string) {
    this._urlBase = value;
  }

  public doRequest(param: ServiceRequestParam<T>): Observable<T> {

    const dataObservable: Observable<T> = new Observable((observer: Subscriber<T>) => {
      const options = param.options || {
        headers: this.buildHeaders()
      };
      options.observe = 'response';
      let requestObs: Observable<T>;
      switch (param.method) {
        case 'GET':
          requestObs = this.httpClient.get<T>(param.url, options);
          break;
        case 'PUT':
          requestObs = this.httpClient.put<T>(param.url, param.body, options);
          break;
        case 'DELETE':
          const deleteOptions: HttpRequestOptions = {
            headers: options.headers,
            body: param.body
          };
          deleteOptions.observe = 'response';
          requestObs = this.httpClient.delete<T>(param.url, deleteOptions);
          break;
        case 'PATCH':
          requestObs = this.httpClient.patch<T>(param.url, param.body, options);
          break;
        case 'POST':
        default:
          requestObs = this.httpClient.post<T>(param.url, param.body, options);
          break;
      }

      requestObs.pipe(
        map((data: any) => {
          this.refreshAuthToken(data);
          return this.adapter.adapt(data);
        })
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

  public clientErrorFallback(errorCode: number) {

  }

  public serverErrorFallback(errorCode: number) {

  }

  /*
   * Successful response parsers, there is one parser for each CRUD method which calls to the common parser.
   * User can overwrite the chosen methods parsers or the common parser
   */
  protected parseSuccessfulResponse(resp: T, observer: Subscriber<T>) {
    this.responseParser.parseSuccessfulResponse(resp, observer, this);
  }

  protected parseSuccessfulQueryResponse(resp: T, observer: Subscriber<T>) {
    this.parseSuccessfulResponse(resp, observer);
  }

  protected parseSuccessfulAdvancedQueryResponse(resp: T, observer: Subscriber<T>) {
    this.parseSuccessfulResponse(resp, observer);
  }

  protected parseSuccessfulInsertResponse(resp: T, observer: Subscriber<T>) {
    this.parseSuccessfulResponse(resp, observer);
  }

  protected parseSuccessfulUpdateResponse(resp: T, observer: Subscriber<T>) {
    this.parseSuccessfulResponse(resp, observer);
  }

  protected parseSuccessfulDeleteResponse(resp: T, observer: Subscriber<T>) {
    this.parseSuccessfulResponse(resp, observer);
  }

  /*
   * Unsuccessful response parsers, there is one parser for each CRUD method which calls to the common parser.
   * User can overwrite the chosen methods parsers or the common parser
   */
  protected parseUnsuccessfulResponse(error: any, observer: Subscriber<T>) {
    this.responseParser.parseUnsuccessfulResponse(error, observer, this);
  }

  protected parseUnsuccessfulQueryResponse(resp: T, observer: Subscriber<T>) {
    this.parseUnsuccessfulResponse(resp, observer);
  }

  protected parseUnsuccessfulAdvancedQueryResponse(resp: T, observer: Subscriber<T>) {
    this.parseUnsuccessfulResponse(resp, observer);
  }

  protected parseUnsuccessfulInsertResponse(resp: T, observer: Subscriber<T>) {
    this.parseUnsuccessfulResponse(resp, observer);
  }

  protected parseUnsuccessfulUpdateResponse(resp: T, observer: Subscriber<T>) {
    this.parseUnsuccessfulResponse(resp, observer);
  }

  protected parseUnsuccessfulDeleteResponse(resp: T, observer: Subscriber<T>) {
    this.parseUnsuccessfulResponse(resp, observer);
  }

  protected refreshAuthToken(res: HttpResponse<any>) {
    const authToken = res.headers.get('X-Auth-Token');
    if (Util.isDefined(authToken)) {
      this.loginStorageService.updateSessionId(authToken);
    }
  }

}
