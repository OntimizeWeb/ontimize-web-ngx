import { Injectable, Injector } from '@angular/core';
import { MdSnackBar, MdSnackBarRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { OSnackBarComponent, OSnackBarIconPosition } from '../components/snackbar/o-snackbar.component';

@Injectable()
export class SnackBarService {

  protected static DEFAULT_DURATION: number = 2000;

  protected mdSnackBar: MdSnackBar;
  protected snackBarRef: MdSnackBarRef<OSnackBarComponent>;

  constructor(
    protected injector: Injector
  ) {
    this.mdSnackBar = this.injector.get(MdSnackBar);
  }

  public open(message: string, action?: string, milliseconds?: number, icon?: string, iconPosition?: OSnackBarIconPosition): Promise<any> {
    var self = this;
    let observable: Observable<any> = Observable.create(
      observer => {
        self.snackBarRef = self.mdSnackBar.openFromComponent(OSnackBarComponent, {
          duration: milliseconds ? milliseconds : SnackBarService.DEFAULT_DURATION
        });
        self.snackBarRef.onAction().subscribe((arg) => {
          observer.next(arg);
        });
        self.snackBarRef.afterDismissed().subscribe(() => {
          observer.complete();
          self.snackBarRef = null;
        });

        self.snackBarRef.instance.open(message, action, icon, iconPosition);
      }
    );
    return observable.toPromise();
  }

}
