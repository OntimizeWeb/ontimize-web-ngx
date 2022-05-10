import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector, Type } from '@angular/core';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';

import { AppConfig } from '../../config/app-config';
import { IPermissionsService } from '../../interfaces/permissions-service.interface';
import { Config } from '../../types/config.type';
import { OntimizePermissionsConfig } from '../../types/ontimize-permissions-config.type';
import { Codes } from '../../util/codes';
import { Util } from '../../util/util';
import { AuthService } from '../auth.service';

@Injectable()
export class OntimizePermissionsService implements IPermissionsService {

  public entity: string = '';
  public keyColumn: string;
  public valueColumn: string;

  protected httpClient: HttpClient;
  protected _user: string;
  protected _urlBase: string;
  protected _appConfig: Config;
  protected _config: AppConfig;

  protected authService: AuthService;

  constructor(protected injector: Injector) {
    this.httpClient = this.injector.get<HttpClient>(HttpClient as Type<HttpClient>);
    this._config = this.injector.get<AppConfig>(AppConfig as Type<AppConfig>);
    this._appConfig = this._config.getConfiguration();
    this.authService = this.injector.get<AuthService>(AuthService as Type<AuthService>);
  }

  getDefaultServiceConfiguration(): any {
    const authService = this.injector.get<AuthService>(AuthService as Type<AuthService>);
    const servConfig = {};
    servConfig[Codes.SESSION_KEY] = authService.getSessionInfo();
    return servConfig;
  }

  configureService(permissionsConfig: OntimizePermissionsConfig): void {
    const config = this.getDefaultServiceConfiguration();
    this._urlBase = config.urlBase ? config.urlBase : this._appConfig.apiEndpoint;
    this._user = config.session ? config.session.user : '';

    if (Util.isDefined(permissionsConfig)) {
      if (permissionsConfig.entity !== undefined) {
        this.entity = permissionsConfig.entity;
      }
      if (permissionsConfig.keyColumn !== undefined) {
        this.keyColumn = permissionsConfig.keyColumn;
      }
      if (permissionsConfig.valueColumn !== undefined) {
        this.valueColumn = permissionsConfig.valueColumn;
      }
    }
  }

  loadPermissions(): Observable<any> {
    const kv: object = {};
    kv[this.keyColumn] = this._user;

    const av = [this.valueColumn];

    const url = this._urlBase + '/query';
    const options = {
      headers: this.buildHeaders()
    };
    const body = JSON.stringify({
      user: this._user,
      sessionid: this.authService.getSessionInfo().id,
      type: 1,
      entity: this.entity,
      kv: kv,
      av: av
    });
    const self = this;
    const dataObservable: Observable<any> = new Observable(_innerObserver => {
      self.httpClient.post(url, body, options).subscribe((res: any) => {
        let permissions = {};
        if ((res.code === Codes.ONTIMIZE_SUCCESSFUL_CODE) && Util.isDefined(res.data)) {
          const response = res.data;
          if ((response.length === 1) && Util.isObject(response[0])) {
            const permissionsResp = response[0];
            try {
              permissions = permissionsResp.hasOwnProperty(self.valueColumn) ? JSON.parse(permissionsResp[self.valueColumn]) : {};
            } catch (e) {
              console.warn('[OntimizePermissionsService: permissions parsing failed]');
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
    return new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json;charset=UTF-8'
    });
  }

}
