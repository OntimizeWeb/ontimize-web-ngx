import { Injectable, Injector } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';

import { ODialogComponent } from '../shared/components/dialog/o-dialog.component';
import { ODialogConfig } from '../shared/components/dialog/o-dialog.config';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  protected ng2Dialog: MatDialog;
  dialogRef: MatDialogRef<ODialogComponent>;

  constructor(protected injector: Injector) {
    this.ng2Dialog = this.injector.get(MatDialog);
  }

  public get dialog(): ODialogComponent {
    if (this.dialogRef) {
      return this.dialogRef.componentInstance;
    }
    return undefined;
  }

  public alert(title: string, message: string, config?: ODialogConfig): Promise<any> {
    const self = this;
    const observable = new Observable(observer => {
      self.openDialog(observer);
      self.dialogRef.componentInstance.alert(title, message, config);
    });
    return observable.toPromise();
  }

  public info(title: string, message: string, config?: ODialogConfig): Promise<any> {
    const self = this;
    const observable = new Observable(observer => {
      self.openDialog(observer);
      self.dialogRef.componentInstance.info(title, message, config);
    });
    return observable.toPromise();
  }

  public warn(title: string, message: string, config?: ODialogConfig): Promise<any> {
    const self = this;
    const observable = new Observable(observer => {
      self.openDialog(observer);
      self.dialogRef.componentInstance.warn(title, message, config);
    });
    return observable.toPromise();
  }

  public error(title: string, message: string, config?: ODialogConfig): Promise<any> {
    const self = this;
    const observable = new Observable(observer => {
      self.openDialog(observer);
      self.dialogRef.componentInstance.error(title, message, config);
    });
    return observable.toPromise();
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
    this.dialogRef = this.ng2Dialog.open(ODialogComponent, cfg);
    this.dialogRef.afterClosed().subscribe(result => {
      result = result === undefined ? false : result;
      observer.next(result);
      observer.complete();
      this.dialogRef = null;
    });
  }

}
