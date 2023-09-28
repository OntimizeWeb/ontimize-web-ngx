import { Injectable, Injector } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import type { ODialogConfig } from '../shared/components/dialog/o-dialog.config';
import { ODialogBase } from '../shared/components/dialog/o-dialog-base.class';
import { ComponentType } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  protected ng2Dialog: MatDialog;
  dialogRef: MatDialogRef<ODialogBase>;

  constructor(protected injector: Injector) {
    this.ng2Dialog = this.injector.get(MatDialog);
  }

  public get dialog(): ODialogBase {
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
    //TODO It has been typed with the component type because it needed the component but adding it produces a circular dependency
    this.dialogRef = this.ng2Dialog.open(ODialogBase as ComponentType<ODialogBase>, cfg);
    this.dialogRef.afterClosed().subscribe(result => {
      result = result === undefined ? false : result;
      observer.next(result);
      observer.complete();
      this.dialogRef = null;
    });
  }

}
