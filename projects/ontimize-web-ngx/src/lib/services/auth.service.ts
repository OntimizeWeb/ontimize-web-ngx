import { Injectable, Injector } from '@angular/core';
import { Observable, Subject } from 'rxjs';


import { DialogService } from './dialog.service';
import { SessionInfo } from '../types/session-info.type';

@Injectable()
export abstract class AuthService {

  public onLogin: Subject<any> = new Subject();
  public onLogout: Subject<any> = new Subject();

  protected dialogService: DialogService;

  constructor(protected injector: Injector) {
    this.dialogService = injector.get(DialogService);
  }

  public abstract login(user: string, password: string): Observable<any>;
  public abstract logout(): Observable<any>;
  public abstract clearSessionData(): void;
  public abstract isLoggedIn(): boolean;
  public abstract getSessionInfo(): SessionInfo;

  public logoutWithConfirmation(): void {
    this.dialogService.confirm('CONFIRM', 'MESSAGES.CONFIRM_LOGOUT').then(res => {
      if (res) {
        this.logout();
      }
    });
  }

}
