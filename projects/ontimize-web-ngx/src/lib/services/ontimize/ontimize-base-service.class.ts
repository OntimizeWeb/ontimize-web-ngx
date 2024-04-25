import { Injector, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IAuthService } from '../../interfaces/auth-service.interface';
import { BaseService } from '../base-service.class';
import { ServiceResponse } from '../../interfaces/service-response.interface';

@Injectable()
export class OntimizeBaseService extends BaseService<ServiceResponse> implements IAuthService {

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

  public clientErrorFallback(errorCode: number) {
    if (errorCode === 401) {
      this.authService.logout();
    }
  }

}
