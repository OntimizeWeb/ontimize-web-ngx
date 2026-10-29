import { Component, Injector, forwardRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarRef } from '@angular/material/snack-bar';

import { OTranslatePipe } from '../../../pipes/o-translate.pipe';
import { OSnackBarBase } from './o-snackbar-base.class';

export declare type OSnackBarIconPosition = 'left' | 'right';

/**
 * Configuration for showing a SnackBar with the SnackBar service.
 */
export class OSnackBarConfig {
  /** Text shown in the action button. */
  public action?: string;
  /** Time the SnackBar is shown. */
  public milliseconds?: number;
  /** Material icon shown in the SnackBar. */
  public icon?: string;
  /** Position where the icon is shown. Default left. */
  public iconPosition?: OSnackBarIconPosition;
  /** CSS class to be added to the snack bar container */
  public cssClass?: string;
}

@Component({
  standalone: true,
  imports: [MatButtonModule, MatIconModule, OTranslatePipe],
  selector: 'o-snackbar',
  templateUrl: 'o-snackbar.component.html',
  styleUrls: ['o-snackbar.component.scss'],
  host: {
    '[class.o-snackbar]': 'true'
  },
  providers: [
    { provide: OSnackBarBase, useExisting: forwardRef(() => OSnackBarComponent) }

  ]
})
export class OSnackBarComponent {

  public message: string;
  public action: string;
  public icon: string;
  public iconPosition: OSnackBarIconPosition = 'left';

  protected snackBarRef: MatSnackBarRef<{}>;

  constructor(
    protected injector: Injector
  ) {
    this.snackBarRef = this.injector.get(MatSnackBarRef);
  }

  public open(message: string, config?: OSnackBarConfig): void {
    this.message = message;
    if (config) {
      if (config.action) {
        this.action = config.action;
      }
      if (config.icon) {
        this.icon = config.icon;
      }
      if (config.iconPosition) {
        this.iconPosition = config.iconPosition;
      }
    }
  }

  public onAction(): void {
    this.snackBarRef.dismissWithAction();
  }

}
