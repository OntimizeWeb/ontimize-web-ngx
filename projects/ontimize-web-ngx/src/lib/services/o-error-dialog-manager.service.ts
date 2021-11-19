import { Injectable } from '@angular/core';
import { Util } from '../util/util';
import { DialogService } from './dialog.service';


@Injectable({
  providedIn: 'root'
})
export class OErrorDialogManager {

  protected errorDialogSubscription: Promise<boolean>;

  constructor(protected dialogService: DialogService) { }

  protected restart() {
    this.errorDialogSubscription = null;
  }

  public openErrorDialog(err?:any): Promise<boolean> {
    if (!Util.isDefined(this.errorDialogSubscription)) {
      this.errorDialogSubscription = new Promise((resolve) => {
        const errorMsg = (err && typeof err !== 'object') ? err : 'MESSAGES.ERROR_QUERY';
        this.dialogService.alert('ERROR', errorMsg).then(res => {
          this.restart();
          resolve(res);
        });
      });
    }
    return this.errorDialogSubscription;
  }
}
