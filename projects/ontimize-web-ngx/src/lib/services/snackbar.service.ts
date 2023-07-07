import { Injectable, Injector } from '@angular/core';
import { MatLegacySnackBar as MatSnackBar, MatLegacySnackBarConfig as MatSnackBarConfig, MatLegacySnackBarRef as MatSnackBarRef } from '@angular/material/legacy-snack-bar';
import { Observable } from 'rxjs';

import { OSnackBarComponent, OSnackBarConfig } from '../shared/components/snackbar/o-snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  protected static DEFAULT_DURATION: number = 2000;
  protected static DEFAULT_CONTAINER_CLASS: string = 'o-snackbar-container';

  protected matSnackBar: MatSnackBar;
  protected snackBarRef: MatSnackBarRef<OSnackBarComponent>;

  constructor(
    protected injector: Injector
  ) {
    this.matSnackBar = this.injector.get(MatSnackBar);
  }

  public open(message: string, config?: OSnackBarConfig): Promise<any> {
    const self = this;
    const observable: Observable<any> = new Observable(observer => {
      const containerClasses: string[] = [SnackBarService.DEFAULT_CONTAINER_CLASS];
      if (config && config.cssClass) {
        containerClasses.push(config.cssClass);
      }

      const matConfig: MatSnackBarConfig = {
        duration: config && config.milliseconds ? config.milliseconds : SnackBarService.DEFAULT_DURATION,
        panelClass: containerClasses
      };
      self.snackBarRef = self.matSnackBar.openFromComponent(OSnackBarComponent, matConfig);

      self.snackBarRef.onAction().subscribe(arg => {
        observer.next(arg);
      });

      self.snackBarRef.afterDismissed().subscribe(() => {
        observer.complete();
        self.snackBarRef = null;
      });

      self.snackBarRef.instance.open(message, config);
    });
    return observable.toPromise();
  }

}
