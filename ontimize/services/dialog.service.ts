import { Injectable } from '@angular/core';
import { MdDialog } from '../components/material/ng2-material/index';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import { ODialogComponent } from '../components';

@Injectable()
export class DialogService {

  protected _dialog: ODialogComponent;

  public get dialog () : ODialogComponent {
    return this._dialog;
  }

  public set dialog (value : ODialogComponent) {
    this._dialog = value;
  }

  public alert(title : string, message : string, okButtonText? : string) : Promise<any> {
    let observable = Observable.create(
      observer => {
        if (typeof(this._dialog) !== 'undefined') {
          this._dialog.alert(title, message, okButtonText)
            .then(
              (dialog: MdDialog) => {
                dialog.onClose.subscribe(res => {
                  observer.next(res);
                  observer.complete();
                });
              }
            );
        } else {
          observer.error('[DialogService.alert]: Error, dialog service not initialized.');
        }
      }
    );
    return observable.toPromise();
  }

  public confirm (title : string, message : string, okButtonText? : string, cancelButtonText? : string) : Promise<any> {
    let observable = Observable.create(
      observer => {
        if (typeof(this._dialog) !== 'undefined') {
          this._dialog.confirm(title, message, okButtonText, cancelButtonText)
            .then(
              (dialog: MdDialog) => {
                dialog.onClose.subscribe(res => {
                  observer.next(res);
                  observer.complete();
                });
              }
            );
        } else {
          observer.error('[DialogService.confirm]: Error, dialog service not initialized.');
        }
      }
    );
    return observable.toPromise();
  }


}
