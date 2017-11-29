import { Component, Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdButtonModule, MdIconModule, MdSnackBarModule, MdSnackBarRef } from '@angular/material';

import { OSharedModule } from '../../shared';
import { OTranslateModule } from '../../pipes/o-translate.pipe';

export type OSnackBarIconPosition = 'left' | 'right';

@Component({
  selector: 'o-snackbar',
  templateUrl: 'o-snackbar.component.html',
  styleUrls: ['o-snackbar.component.scss']
})
export class OSnackBarComponent {

  message: string;
  action: string;
  icon: string;
  iconPosition: OSnackBarIconPosition = 'left';

  protected snackBarRef: MdSnackBarRef<OSnackBarComponent>;

  constructor(
    protected injector: Injector
  ) {
    this.snackBarRef = this.injector.get(MdSnackBarRef);
  }

  open(message: string, action?: string, icon?: string, iconPosition?: OSnackBarIconPosition): void {
    this.message = message;
    if (action) {
      this.action = action;
    }
    if (icon) {
      this.icon = icon;
    }
    if (iconPosition) {
      this.iconPosition = iconPosition;
    }
  }

  onAction(e: Event): void {
    this.snackBarRef.closeWithAction();
  }

}

@NgModule({
  declarations: [OSnackBarComponent],
  imports: [CommonModule, MdButtonModule, MdIconModule, MdSnackBarModule, OSharedModule, OTranslateModule],
  exports: [OSnackBarComponent, CommonModule, MdButtonModule, MdSnackBarModule],
})
export class OSnackBarModule {
}
