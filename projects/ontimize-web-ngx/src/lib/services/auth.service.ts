import { Injectable, Injector } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { type ODialogConfig } from '../shared';
import { ODialogInternalComponent } from '../shared/components/dialog/o-dialog-internal.component';
import { SessionInfo } from '../types/session-info.type';

@Injectable()
export abstract class AuthService {

  public onLogin: Subject<any> = new Subject();
  public onLogout: Subject<any> = new Subject();
  protected ng2Dialog: MatDialog;
  dialogRef: MatDialogRef<ODialogInternalComponent>;

  constructor(protected injector: Injector) {
    this.ng2Dialog = injector.get(MatDialog);
  }

  public abstract login(user: string, password: string): Observable<any>;
  public abstract logout(): Observable<any>;
  public abstract clearSessionData(): void;
  public abstract isLoggedIn(): boolean;
  public abstract getSessionInfo(): SessionInfo;

  public logoutWithConfirmation(): void {
    this.confirm('CONFIRM', 'MESSAGES.CONFIRM_LOGOUT').then(res => {
      if (res) {
        this.logout();
      }
    });
  }
  public confirm(title: string, message: string, config?: ODialogConfig): Promise<any> {
    const self = this;
    const observable = new Observable(observer => {
      self.openDialog(observer);
      self.dialogRef.componentInstance.confirm(title, message, config);
    });
    return observable.toPromise();
  }

  protected openDialog(observer) {
    const cfg: MatDialogConfig = {
      role: 'alertdialog',
      disableClose: true,
      panelClass: ['o-dialog-class', 'o-dialog-service']
    };
    //TODO It has been typed with the component type because it needed the component but adding it produces a circular dependency
    this.dialogRef = this.ng2Dialog.open(ODialogInternalComponent, cfg);
    this.dialogRef.afterClosed().subscribe(result => {
      result = result === undefined ? false : result;
      observer.next(result);
      observer.complete();
      this.dialogRef = null;
    });
  }
  public alert(title: string, message: string, config?: ODialogConfig): Promise<any> {
    const self = this;
    const observable = new Observable(observer => {
      self.openDialog(observer);
      self.dialogRef.componentInstance.alert(title, message, config);
    });
    return observable.toPromise();
  }

}