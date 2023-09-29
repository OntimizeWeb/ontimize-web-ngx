import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import type { ODialogConfig } from '../shared';
import { ODialogInternalComponent } from '../shared/components/dialog/o-dialog-internal.component';
import { Util } from '../util/util';


@Injectable({
  providedIn: 'root'
})
export class OErrorDialogManager {

  protected errorDialogSubscription: Promise<boolean>;
  protected ng2Dialog: MatDialog;
  dialogRef: MatDialogRef<ODialogInternalComponent>;
  constructor() { }

  protected restart() {
    this.errorDialogSubscription = null;
  }

  public openErrorDialog(err?: any): Promise<boolean> {
    if (!Util.isDefined(this.errorDialogSubscription)) {
      this.errorDialogSubscription = new Promise((resolve) => {
        const errorMsg = (err && typeof err !== 'object') ? err : 'MESSAGES.ERROR_QUERY';
        this.alert('ERROR', errorMsg).then(res => {
          this.restart();
          resolve(res);
        });
      });
    }
    return this.errorDialogSubscription;
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