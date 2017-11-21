import { Injectable, Injector } from '@angular/core';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';

import { OTranslateService } from '../services';

@Injectable()
export class SnackBarService {

  protected static DEFAULT_DURATION: number = 2000;

  protected mdSnackBar: MdSnackBar;

  protected translateService: OTranslateService;

  constructor(
    protected injector: Injector
  ) {
    this.mdSnackBar = this.injector.get(MdSnackBar);
    this.translateService = this.injector.get(OTranslateService);
  }

  public open(message: string, action?: string, milliseconds?: number): void {
    message = this.translateService.get(message);
    action = action ? this.translateService.get(action) : void 0;
    let config: MdSnackBarConfig = {};
    config.duration = milliseconds ? milliseconds : action ? null : SnackBarService.DEFAULT_DURATION;
    this.mdSnackBar.open(message, action, config);
  }

}
