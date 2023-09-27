import { ComponentType } from '@angular/cdk/overlay';
import { Inject, Injectable, Injector, forwardRef } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { OSnackBarBase } from '../shared/components/snackbar/o-snackbar-base.class';
import { type OSnackBarConfig } from '../shared/components/snackbar/o-snackbar.component';
@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  protected static DEFAULT_DURATION: number = 2000;
  protected static DEFAULT_CONTAINER_CLASS: string = 'o-snackbar-container';

  protected matSnackBar: MatSnackBar;
  protected snackBarRef: MatSnackBarRef<OSnackBarBase>;

  constructor(
    protected injector: Injector,
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
      //TODO It has been typed with the component type because it needed the component but adding it produces a circular dependency
      self.snackBarRef = self.matSnackBar.openFromComponent(OSnackBarBase as ComponentType<OSnackBarBase>, matConfig);

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
