import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscriber } from 'rxjs';
import { share } from 'rxjs/operators';

import { AppConfig } from '../../config/app-config';
import { IAuthService } from '../../interfaces/auth-service.interface';
import { Config } from '../../types/config.type';
import { OntimizeRequestParam } from '../../types/ontimize-request-param.type';
import { OntimizeServiceResponse } from '../../types/ontimize-service-response.type';
import { Codes } from '../../util/codes';
import { ServiceUtils } from '../../util/service.utils';
import { LoginStorageService } from '../login-storage.service';
import { OntimizeServiceResponseParser } from '../parser/o-service-response.parser';

export class OntimizeBaseService implements IAuthService {

  public kv = {};
  public av: string[] = [];
  public sqltypes = {};
  public pagesize: number = 10;
  public offset: number = 0;
  public orderby: Array<object> = [];
  public totalsize: number = -1;

  protected httpClient: HttpClient;
  protected router: Router;
  protected sessionid: string;
  protected urlBase: string;
  protected appConfig: Config;
  protected config: AppConfig;
  protected startSessionPath: string;
  protected responseParser: OntimizeServiceResponseParser;
  protected loginStorageService: LoginStorageService;

  constructor(protected injector: Injector) {
    this.httpClient = this.injector.get(HttpClient);
    this.router = this.injector.get(Router);
    this.config = this.injector.get(AppConfig);
    this.appConfig = this.config.getConfiguration();
    this.responseParser = this.injector.get(OntimizeServiceResponseParser);
    this.loginStorageService = this.injector.get(LoginStorageService);
  }

  public configureService(config: any): void {
    this.urlBase = config.urlBase ? config.urlBase : this.appConfig.apiEndpoint;
    this.sessionid = config.session ? config.session.id : -1;
  }

  public getDefaultServiceConfiguration(serviceName?: string) {
    const configuration = this.config.getServiceConfiguration();
    let servConfig = {};
    if (serviceName && configuration.hasOwnProperty(serviceName)) {
      servConfig = configuration[serviceName];
    }
    servConfig[Codes.SESSION_KEY] = this.loginStorageService.getSessionInfo();
    return servConfig;
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

  public doRequest(param: OntimizeRequestParam): Observable<OntimizeServiceResponse> {

    const dataObservable: Observable<OntimizeServiceResponse> = new Observable((observer: Subscriber<OntimizeServiceResponse>) => {
      const options = param.options || {
        headers: this.buildHeaders()
      };
      let requestObs: Observable<OntimizeServiceResponse>;
      switch (param.method) {
        case 'PUT':
          requestObs = this.httpClient.put<OntimizeServiceResponse>(param.url, param.body, options);
          break;
        case 'DELETE':
          const deleteOptions = {
            headers: options.headers,
            body: param.body
          };
          requestObs = this.httpClient.delete<OntimizeServiceResponse>(param.url, deleteOptions);
          break;
        case 'POST':
        default:
          requestObs = this.httpClient.post<OntimizeServiceResponse>(param.url, param.body, options);
          break;
      }

      requestObs.subscribe(resp => {
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
  protected parseSuccessfulResponse(resp: OntimizeServiceResponse, observer: Subscriber<OntimizeServiceResponse>) {
    this.responseParser.parseSuccessfulResponse(resp, observer, this);
  }

  protected parseSuccessfulQueryResponse(resp: OntimizeServiceResponse, observer: Subscriber<OntimizeServiceResponse>) {
    this.parseSuccessfulResponse(resp, observer);
  }

  protected parseSuccessfulAdvancedQueryResponse(resp: OntimizeServiceResponse, observer: Subscriber<OntimizeServiceResponse>) {
    this.parseSuccessfulResponse(resp, observer);
  }

  protected parseSuccessfulInsertResponse(resp: OntimizeServiceResponse, observer: Subscriber<OntimizeServiceResponse>) {
    this.parseSuccessfulResponse(resp, observer);
  }

  protected parseSuccessfulUpdateResponse(resp: OntimizeServiceResponse, observer: Subscriber<OntimizeServiceResponse>) {
    this.parseSuccessfulResponse(resp, observer);
  }

  protected parseSuccessfulDeleteResponse(resp: OntimizeServiceResponse, observer: Subscriber<OntimizeServiceResponse>) {
    this.parseSuccessfulResponse(resp, observer);
  }

  /*
   * Unsuccessful response parsers, there is one parser for each CRUD method which calls to the common parser.
   * User can overwrite the chosen methods parsers or the common parser
   */
  protected parseUnsuccessfulResponse(error: any, observer: Subscriber<OntimizeServiceResponse>) {
    this.responseParser.parseUnsuccessfulResponse(error, observer, this);
  }

  protected parseUnsuccessfulQueryResponse(resp: OntimizeServiceResponse, observer: Subscriber<OntimizeServiceResponse>) {
    this.parseUnsuccessfulResponse(resp, observer);
  }

  protected parseUnsuccessfulAdvancedQueryResponse(resp: OntimizeServiceResponse, observer: Subscriber<OntimizeServiceResponse>) {
    this.parseUnsuccessfulResponse(resp, observer);
  }

  protected parseUnsuccessfulInsertResponse(resp: OntimizeServiceResponse, observer: Subscriber<OntimizeServiceResponse>) {
    this.parseUnsuccessfulResponse(resp, observer);
  }

  protected parseUnsuccessfulUpdateResponse(resp: OntimizeServiceResponse, observer: Subscriber<OntimizeServiceResponse>) {
    this.parseUnsuccessfulResponse(resp, observer);
  }

  protected parseUnsuccessfulDeleteResponse(resp: OntimizeServiceResponse, observer: Subscriber<OntimizeServiceResponse>) {
    this.parseUnsuccessfulResponse(resp, observer);
  }

}
