import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injector, Type } from '@angular/core';

import { AppConfig } from '../../config/app-config';
import { Config } from '../../types/config.type';
import { OntimizeEEPermissionsConfig } from '../../types/ontimize-ee-permissions-config.type';
import { OntimizePermissionsConfig } from '../../types/ontimize-permissions-config.type';
import { AuthService } from '../auth.service';

export class OntimizeBasePermissionsService {
  protected httpClient: HttpClient;
  protected _appConfig: Config;
  protected _config: AppConfig;
  protected authService: AuthService;

  constructor(protected injector: Injector) {
    this.httpClient = this.injector.get<HttpClient>(HttpClient as Type<HttpClient>);
    this._config = this.injector.get<AppConfig>(AppConfig as Type<AppConfig>);
    this._appConfig = this._config.getConfiguration();
    this.authService = this.injector.get<AuthService>(AuthService as Type<AuthService>);
  }

  getDefaultServiceConfiguration(permissionsConfig:OntimizeEEPermissionsConfig|OntimizePermissionsConfig): any {
  }

  configureService(permissionsConfig: any): void {
  }

  loadPermissions() {
  }

  protected buildHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json;charset=UTF-8'
    });
  }

}
