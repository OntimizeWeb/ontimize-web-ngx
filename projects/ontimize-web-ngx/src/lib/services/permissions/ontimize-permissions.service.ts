import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';

import { IPermissionsService } from '../../interfaces/permissions-service.interface';
import { OntimizePermissionsConfig } from '../../types/ontimize-permissions-config.type';
import { Codes } from '../../util/codes';
import { Util } from '../../util/util';
import { OntimizeBasePermissionsService } from './ontimize-base-permissions-service.class';

@Injectable()
export class OntimizePermissionsService extends OntimizeBasePermissionsService implements IPermissionsService {

  public entity: string = '';
  public keyColumn: string;
  public valueColumn: string;

  protected _user: string;
  protected _urlBase: string;

  constructor(protected injector: Injector) {
    super(injector);
  }

  getDefaultServiceConfiguration(): any {
    const servConfig = {};
    servConfig[Codes.SESSION_KEY] = this.authService.getSessionInfo();
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

}
