import { Injectable, Injector } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Util } from '../util/util';

@Injectable({
  providedIn: 'root'
})
export class IconService {
  public static DEFAULT_ICON_POSITION = 'left';
  public static DEFAULT_ICON_KEY = 'icon';

  protected _iconPosition: string;
  protected _iconKey: string;

  constructor(protected injector: Injector, private _sanitizer: DomSanitizer) {
    this._iconPosition = IconService.DEFAULT_ICON_POSITION;
    this._iconKey = IconService.DEFAULT_ICON_KEY;
  }

  get iconPosition(): string {
    return this._iconPosition;
  }

  set iconPosition(value: string) {
    this._iconPosition = value;
  }

  get iconKey(): string {
    return this._iconKey;
  }

  set iconKey(value: string) {
    this._iconKey = value;
  }

  getIconValue(value: any, args: any) {
    let iconPosition = args ? args.iconPosition : undefined;
    if (!Util.isDefined(iconPosition)) {
      iconPosition = this._iconPosition;
    }
    let iconValue = value;
    let icon = "<mat-icon class='mat-24 mat-icon notranslate material-icons mat-icon-no-color' role='img' aria-hidden='true'>" + args.icon + "</mat-icon>";
    switch (iconPosition) {
      case 'left':
        iconValue = icon + iconValue;
        break;
      case 'right':
        iconValue = iconValue + icon;
        break;
    }
    return this._sanitizer.bypassSecurityTrustHtml(iconValue);
  }

}
