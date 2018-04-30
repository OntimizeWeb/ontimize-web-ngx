import { Injectable, Injector } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { OSnackBarComponent, OSnackBarConfig } from '../components/snackbar/o-snackbar.component';

@Injectable()
export class SnackBarService {

  protected static DEFAULT_DURATION: number = 2000;

  protected matSnackBar: MatSnackBar;
  protected snackBarRef: MatSnackBarRef<OSnackBarComponent>;

  constructor(
    protected injector: Injector
  ) {
    this.matSnackBar = this.injector.get(MatSnackBar);
  }

  public open(message: string, config?: OSnackBarConfig): Promise<any> {
    var self = this;
    let observable: Observable<any> = Observable.create(
      observer => {
        self.snackBarRef = self.matSnackBar.openFromComponent(OSnackBarComponent, {
          duration: config && config.milliseconds ? config.milliseconds : SnackBarService.DEFAULT_DURATION
        });
        self.snackBarRef.onAction().subscribe((arg) => {
          observer.next(arg);
        });
        self.snackBarRef.afterDismissed().subscribe(() => {
          observer.complete();
          self.snackBarRef = null;
        });

        self.snackBarRef.instance.open(message, config);
      }
    );
    return observable.toPromise();
  }

}
