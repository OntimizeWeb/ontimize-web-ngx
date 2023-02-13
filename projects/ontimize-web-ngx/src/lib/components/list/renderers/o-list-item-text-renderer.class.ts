import { ElementRef, EventEmitter, Injector, Renderer2 } from '@angular/core';

import { Util } from '../../../util/util';
import { OListItemComponent } from '../list-item/o-list-item.component';

export const DEFAULT_INPUTS_O_TEXT_RENDERER = [
  'title',
  'primaryText : primary-text',
  'secondaryText : secondary-text',
  'icon'
];

export const DEFAULT_OUTPUTS_O_TEXT_RENDERER = [
  'onIconClick : icon-action'
];

export class OListItemTextRenderer {

  /* inputs variables */
  protected _title: string;
  protected _primaryText: string;
  protected _secondaryText: string;
  protected _icon: string;

  onIconClick: EventEmitter<object> = new EventEmitter<object>();

  constructor(
    public elRef: ElementRef,
    protected _renderer: Renderer2,
    protected _injector: Injector,
    protected _listItem: OListItemComponent
  ) { }

  modifyMatListItemElement() {
    if (this.elRef.nativeElement && this.elRef.nativeElement.parentElement) {
      const listItem = this.elRef.nativeElement.parentElement.parentElement;
      if (listItem && listItem.nodeName === 'MAT-LIST-ITEM') {
        let linesNo = 3;
        if (this.title === undefined) {
          linesNo--;
        }
        if (this.primaryText === undefined) {
          linesNo--;
        }
        if (this.secondaryText === undefined) {
          linesNo--;
        }
        listItem.classList.add('mat-' + linesNo + '-line');
        listItem.querySelector('.mat-list-text').remove();
      }
    }
  }

  onActionIconClick(e?: Event) {
    if (Util.isDefined(e)) {
      e.stopPropagation();
    }
    this.onIconClick.emit(e);
  }

  get title(): string {
    return this._title;
  }

  set title(val: string) {
    this._title = val;
  }

  get primaryText(): string {
    return this._primaryText;
  }

  set primaryText(val: string) {
    this._primaryText = val;
  }

  get secondaryText(): string {
    return this._secondaryText;
  }

  set secondaryText(val: string) {
    this._secondaryText = val;
  }

  get icon(): string {
    return this._icon;
  }

  set icon(val: string) {
    this._icon = val;
  }

}
