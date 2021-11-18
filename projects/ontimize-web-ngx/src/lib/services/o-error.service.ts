import { Injectable } from '@angular/core';
import { Util } from '../util/util';
import { DialogService } from './dialog.service';


@Injectable({
  providedIn: 'root'
})
export class OErrorService {

  protected errorDialogSubscription: Promise<boolean>;

  constructor(protected dialogService: DialogService) { }

  protected restart() {
    this.errorDialogSubscription = null;
  }

  public getErrorDialogSubscription(): Promise<boolean> {
    if (!Util.isDefined(this.errorDialogSubscription)) {
      this.errorDialogSubscription = new Promise((resolve) => {
        this.dialogService.alert('ERROR', 'MESSAGES.ERROR_QUERY');
        this.restart();

      });
    }
    return this.errorDialogSubscription;
  }
}