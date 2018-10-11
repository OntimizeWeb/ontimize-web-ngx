import { Injector, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import { IPermissionsService } from '../../utils';
import { LoginService } from '../../services';
import { AppConfig, Config, OntimizeEEPermissionsConfig } from '../../config/app-config';
import { Codes, Util } from '../../utils';

@Injectable()
export class OntimizeEEPermissionsService implements IPermissionsService {
  public static DEFAULT_PERMISSIONS_PATH = '/loadPermissions';
  public static PERMISSIONS_KEY = 'permission';

  public path: string = '';

  protected httpClient: HttpClient;
  protected _sessionid: number = -1;
  protected _user: string;
  protected _urlBase: string;
  protected _appConfig: Config;
  protected _config: AppConfig;

  constructor(protected injector: Injector) {
    this.httpClient = this.injector.get(HttpClient);
    this._config = this.injector.get(AppConfig);
    this._appConfig = this._config.getConfiguration();
  }

  getDefaultServiceConfiguration(permissionsConfig: OntimizeEEPermissionsConfig): any {
    const serviceName: string = permissionsConfig ? permissionsConfig.service : undefined;

    let loginService = this.injector.get(LoginService);
    let configuration = this._config.getServiceConfiguration();

    let servConfig = {};
    if (serviceName && configuration.hasOwnProperty(serviceName)) {
      servConfig = configuration[serviceName];
    }
    servConfig[Codes.SESSION_KEY] = loginService.getSessionInfo();
    return servConfig;
  }

  configureService(permissionsConfig: OntimizeEEPermissionsConfig): void {
    const config = this.getDefaultServiceConfiguration(permissionsConfig);
    this._urlBase = config.urlBase ? config.urlBase : this._appConfig['apiEndpoint'];
    this._sessionid = config.session ? config.session.id : -1;
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
          let response = res.data;
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
    return dataObservable.share();
  }

  protected buildHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': 'Bearer ' + this._sessionid
    });
  }

}
