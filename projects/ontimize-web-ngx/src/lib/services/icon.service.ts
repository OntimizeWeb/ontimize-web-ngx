import { Injectable, Injector } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Util } from '../util/util';

@Injectable({
  providedIn: 'root'
})
export class IconService {
  public static DEFAULT_ICON_POSITION = 'left';
  public static DEFAULT_ICON_TYPE = 'basic';
  public static DEFAULT_ICON_COLUMN = 'icon';

  protected _iconPosition: string;
  protected _iconType: string;
  protected _iconColumn: string;

  constructor(protected injector: Injector, private _sanitizer: DomSanitizer) {
    this._iconPosition = IconService.DEFAULT_ICON_POSITION;
    this._iconType = IconService.DEFAULT_ICON_TYPE;
    this._iconColumn = IconService.DEFAULT_ICON_COLUMN;
  }

  get iconPosition(): string {
    return this._iconPosition;
  }

  set iconPosition(value: string) {
    this._iconPosition = value;
  }

  get iconType(): string {
    return this._iconType;
  }

  set iconType(value: string) {
    this._iconType = value;
  }

  get iconColumn(): string {
    return this._iconColumn;
  }

  set iconColumn(value: string) {
    this._iconColumn = value;
  }

  getIconValue(value: any, args: any) {
    let iconPosition = args ? args.iconPosition : undefined;
    let iconType = args ? args.iconType : undefined;
    if (!Util.isDefined(iconPosition)) {
      iconPosition = this._iconPosition;
    }
    if (!Util.isDefined(iconType)) {
      iconType = this._iconType;
    }
    let iconValue = value;
    let icon: string;
    if(Util.isDefined(iconType) && iconType == "svg") {
      icon = "<mat-icon svgIcon='" + args.icon + "' aria-hidden='false' aria-label='" + iconValue + "'>";
    } else {
      icon = "<mat-icon class='mat-24 mat-icon notranslate material-icons mat-icon-no-color' role='img' aria-hidden='true'>" + args.icon + "</mat-icon>";
    }
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
