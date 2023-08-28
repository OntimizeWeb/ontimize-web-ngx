import { AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Inject, Injector, Optional, Renderer2, ViewEncapsulation } from '@angular/core';

import { InputConverter } from '../../../../decorators/input-converter';
import { Util } from '../../../../util/util';
import { OListItemComponent } from '../../list-item/o-list-item.component';
import { OListItemCardRenderer } from '../o-list-item-card-renderer.class';

export const DEFAULT_INPUTS_O_LIST_ITEM_CARD_IMAGE = [
  'content',
  'avatar',
  'icon',
  'collapsible',
  'collapsed'
];

export const DEFAULT_OUTPUTS_O_LIST_ITEM_CARD_IMAGE = [
  'onIconClick : icon-action'
];

@Component({
  selector: 'o-list-item-card-image',
  templateUrl: './o-list-item-card-image.component.html',
  styleUrls: ['./o-list-item-card-image.component.scss'],
  inputs: DEFAULT_INPUTS_O_LIST_ITEM_CARD_IMAGE,
  outputs: DEFAULT_OUTPUTS_O_LIST_ITEM_CARD_IMAGE,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-custom-list-item]': 'true',
    '[class.o-list-item-card-image]': 'true'
  }
})
export class OListItemCardImageComponent extends OListItemCardRenderer implements AfterViewInit {

  protected _content: string;
  protected _avatar: string;
  protected _icon: string;
  @InputConverter()
  protected _collapsible: boolean = false;
  @InputConverter()
  protected _collapsed: boolean = true;

  onIconClick: EventEmitter<object> = new EventEmitter<object>();

  constructor(
    elRef: ElementRef,
    _renderer: Renderer2,
    _injector: Injector,
    @Optional() @Inject(forwardRef(() => OListItemComponent)) _listItem: OListItemComponent
  ) {
    super(elRef, _renderer, _injector, _listItem);
  }

  ngAfterViewInit() {
    this.modifyMatListItemElement();
  }

  onActionIconClick(e?: Event) {
    if (Util.isDefined(e)) {
      e.stopPropagation();
    }
    this.onIconClick.emit(e);
  }

  get content(): string {
    return this._content;
  }

  set content(val: string) {
    this._content = val;
  }

  get avatar(): string {
    return this._avatar;
  }

  set avatar(val: string) {
    this._avatar = val;
  }

  get icon(): string {
    return this._icon;
  }

  set icon(val: string) {
    this._icon = val;
  }

  get collapsible(): boolean {
    return this._collapsible;
  }

  set collapsible(val: boolean) {
    this._collapsible = val;
  }

  get collapsed(): boolean {
    return this._collapsed;
  }

  set collapsed(val: boolean) {
    this._collapsed = val;
  }

}

