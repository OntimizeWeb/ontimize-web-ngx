import { Directive, Injector } from '@angular/core';
import { Router } from '@angular/router';

import { BooleanInputConverter } from '../../../decorators';
import { DialogService } from '../../../services';

export const DEFAULT_INPUTS_O_USER_INFO_MENU_ITEM = [
  'name',
  'route',
  'icon',
  'action',
  'confirm',
  'confirmText: confirm-text',
  'tooltip',
  'class'
];


@Directive({
  selector: 'o-user-info-configuration-item',
  inputs: DEFAULT_INPUTS_O_USER_INFO_MENU_ITEM
})

export class OUserInfoConfigurationItemDirective {

  @BooleanInputConverter()
  toolTip: boolean = false;

  @BooleanInputConverter()
  confirm: boolean = false;

  public action: () => void;
  public route: string;
  public confirmText;
  protected router: Router;
  protected dialogService: DialogService;

  constructor(public injector: Injector) {
    this.router = this.injector.get(Router);
    this.dialogService = this.injector.get(DialogService);
  }

  triggerOnClick(e: Event) {
    if (this.route) {
      this.navigate();
    } else {
      this.executeItemAction();
    }
  }

  navigate() {
    if (this.router.url !== this.route) {
      this.router.navigate([this.route]);
    }
  }

  executeItemAction() {
    if (this.confirm) {
      this.dialogService.confirm('CONFIRM', this.confirmText || 'MESSAGES.CONFIRM_ACTION').then(result => result ? this.action() : null);
    } else {
      this.action();
    }
  }


}