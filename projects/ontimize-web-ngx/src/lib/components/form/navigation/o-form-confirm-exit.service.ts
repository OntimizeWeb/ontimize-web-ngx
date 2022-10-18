import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DialogService } from '../../../services/dialog.service';
import { Util } from '../../../util/util';
import { OFormComponent } from '../o-form.component';

@Injectable({
  providedIn: 'root'
})
export class OFormConfirmExitService {

  protected confirmDialogSubscription: Promise<boolean>;

  constructor(protected dialogService: DialogService) { }

  subscribeToDiscardChanges(form: OFormComponent, ignoreAttrs: string[] = []): Promise<boolean> {
    let subscription: Promise<boolean>;
    if (form.isInitialStateChanged(ignoreAttrs) && this.mustShowConfirmationInForm(form)) {
      subscription = this.getConfirmDialogSubscription(form);
    } else {
      const observable = new Observable<boolean>(observer => {
        observer.next(true);
        observer.complete();
      });
      subscription = observable.toPromise();
    }
    return subscription;
  }

  protected mustShowConfirmationInForm(form: OFormComponent): boolean {
    return form.isInInsertMode() || form.isInUpdateMode();
  }

  protected restart() {
    this.confirmDialogSubscription = null;
  }

  protected getConfirmDialogSubscription(form: OFormComponent): Promise<boolean> {
    if (!Util.isDefined(this.confirmDialogSubscription)) {
      this.confirmDialogSubscription = new Promise((resolve) => {
        this.dialogService.confirm(
          form.messageService.getDiscardChangesConfirmationDialogTitle(),
          form.messageService.getDiscardChangesConfirmationMessage()).then((res) => {
            this.restart();
            resolve(res);
          })
      });
    }
    return this.confirmDialogSubscription;
  }
}

