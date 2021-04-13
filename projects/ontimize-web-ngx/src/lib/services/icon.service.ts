import { Injectable, Injector } from '@angular/core';

import { Util } from '../util/util';

@Injectable({
  providedIn: 'root'
})
export class IconService {
  public static DEFAULT_ICON_POSITION = 'left';

  protected _iconPosition: string;

  constructor(protected injector: Injector) {
    this._iconPosition = IconService.DEFAULT_ICON_POSITION;
  }

  get iconPosition(): string {
    return this._iconPosition;
  }

  set iconPosition(value: string) {
    this._iconPosition = value;
  }

  getIconValue(value: any, args: any) {
    let iconPosition = args ? args.iconPosition : undefined;
    let icon = '';
    if (!Util.isDefined(iconPosition)) {
      iconPosition = this._iconPosition;
    }
    let iconValue = value;
    icon = "<mat-icon>"+args.key+"</mat-icon>";
    switch (iconPosition) {
      case 'left':
        iconValue = icon + iconValue;
        break;
      case 'right':
        iconValue = iconValue + icon;
        break;
    }
    return iconValue;
  }

}
