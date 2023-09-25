import { Injectable, Injector } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { OSafePipe } from '../pipes/o-safe.pipe';
import { Util } from '../util/util';

@Injectable({
  providedIn: 'root'
})
export class IconService {
  public static DEFAULT_ICON_POSITION = 'left';

  protected _iconPosition: string;
  protected oSafePipe: OSafePipe;

  constructor(protected injector: Injector) {
    this._iconPosition = IconService.DEFAULT_ICON_POSITION;
    this.oSafePipe = new OSafePipe(this.injector)
  }

  get iconPosition(): string {
    return this._iconPosition;
  }

  set iconPosition(value: string) {
    this._iconPosition = value;
  }

  getIconValue(value: any, args: any): SafeHtml {
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
    return this.oSafePipe.transform(iconValue, 'html');
  }

}
