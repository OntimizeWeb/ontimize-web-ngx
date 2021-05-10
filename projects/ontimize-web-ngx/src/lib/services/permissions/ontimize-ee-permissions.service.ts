import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';

import { AppConfig } from '../../config/app-config';
import { IPermissionsService } from '../../interfaces/permissions-service.interface';
import { Config } from '../../types/config.type';
import { OntimizeEEPermissionsConfig } from '../../types/ontimize-ee-permissions-config.type';
import { Codes } from '../../util/codes';
import { Util } from '../../util/util';
import { AuthService } from '../auth.service';

@Injectable()
export class OntimizeEEPermissionsService implements IPermissionsService {

  public static DEFAULT_PERMISSIONS_PATH = '/loadPermissions';
  public static PERMISSIONS_KEY = 'permission';

  public path: string = '';

  protected httpClient: HttpClient;
  protected _user: string;
  protected _urlBase: string;
  protected _appConfig: Config;
  protected _config: AppConfig;

  protected authService: AuthService;

  constructor(protected injector: Injector) {
    this.httpClient = this.injector.get(HttpClient);
    this._config = this.injector.get(AppConfig);
    this._appConfig = this._config.getConfiguration();
    this.authService = this.injector.get(AuthService);
  }

  getDefaultServiceConfiguration(permissionsConfig: OntimizeEEPermissionsConfig): any {
    const serviceName: string = permissionsConfig ? permissionsConfig.service : undefined;

    const authService = this.injector.get(AuthService);
    const configuration = this._config.getServiceConfiguration();

    let servConfig = {};
    if (serviceName && configuration.hasOwnProperty(serviceName)) {
      servConfig = configuration[serviceName];
    }
    servConfig[Codes.SESSION_KEY] = authService.getSessionInfo();
    return servConfig;
  }

  configureService(permissionsConfig: OntimizeEEPermissionsConfig): void {
    const config = this.getDefaultServiceConfiguration(permissionsConfig);
    this._urlBase = config.urlBase ? config.urlBase : this._appConfig.apiEndpoint;
    this._user = config.session ? config.session.user : '';
    this.path = config.path ? config.path : OntimizeEEPermissionsService.DEFAULT_PERMISSIONS_PATH;
  }

  loadPermissions(): Observable<any> {
    const url = this._urlBase + this.path;
    const options = {
      headers: this.buildHeaders()
    };
    const self = this;
    const dataObservable: Observable<any> = new Observable(_innerObserver => {
      self.httpClient.get(url, options).subscribe((res: any) => {
        let permissions = {};
        if ((res.code === Codes.ONTIMIZE_SUCCESSFUL_CODE) && Util.isDefined(res.data)) {
          const response = res.data;
          if ((response.length === 1) && Util.isObject(response[0])) {
            try {
              permissions = JSON.parse(response[0][OntimizeEEPermissionsService.PERMISSIONS_KEY]);
            } catch (e) {
              console.warn('[OntimizeEEPermissionsService: permissions parsing failed]');
            }
          }
        }
        _innerObserver.next(permissions);

      }, error => {
        _innerObserver.error(error);
      }, () => _innerObserver.complete());
    });
    return dataObservable.pipe(share());
  }

  protected buildHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json;charset=UTF-8'
    });
    const sessionId = this.authService.getSessionInfo().id;
    if (Util.isDefined(sessionId)) {
      headers = headers.append('Authorization', 'Bearer ' + sessionId);
    }
    return headers;
  }

}
