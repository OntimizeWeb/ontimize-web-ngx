import { Injector } from '@angular/core';
import { Observable } from 'rxjs';

import { IAuthService } from '../../interfaces/auth-service.interface';
import { ServiceUtils } from '../../util/service.utils';
import { BaseService } from '../base-service.class';

export class OntimizeBaseService extends BaseService implements IAuthService {

  protected _sessionid: string;
  protected _startSessionPath: string;

  public kv = {};
  public av: string[] = [];
  public sqltypes = {};
  public pagesize: number = 10;
  public offset: number = 0;
  public orderby: Array<object> = [];
  public totalsize: number = -1;

  constructor(protected injector: Injector) {
    super(injector);
  }

  public configureService(config: any): void {
    super.configureService(config);
    this._sessionid = config.session ? config.session.id : -1;
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

  public clientErrorFallback(errorCode: number) {
    if (errorCode === 401) {
      this.redirectLogin(true);
    }
  }
}
