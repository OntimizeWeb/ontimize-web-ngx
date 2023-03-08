import { Directive, ElementRef, EventEmitter, Injector, Renderer2 } from '@angular/core';

import { Util } from '../../../util/util';
import { OListItemComponent } from '../list-item/o-list-item.component';

export const DEFAULT_INPUTS_O_CARD_RENDERER = [
  'title',
  'subtitle',
  'image',
  'showImage: show-image',
  'action1Text: action-1-text',
  'action2Text: action-2-text'
];

export const DEFAULT_OUTPUTS_O_CARD_RENDERER = [
  'onAction1Click: action-1',
  'onAction2Click: action-2'
];

@Directive({
  inputs: DEFAULT_INPUTS_O_CARD_RENDERER,
  outputs: DEFAULT_OUTPUTS_O_CARD_RENDERER
})
export class OListItemCardRenderer {

  /* inputs variables */
  protected _title: string;
  protected _subtitle: string;
  protected _image: string;
  protected _showImage: boolean = true;
  protected _action1Text: string;
  protected _action2Text: string;

  onAction1Click: EventEmitter<object> = new EventEmitter<object>();
  onAction2Click: EventEmitter<object> = new EventEmitter<object>();
  /* end of inputs variables */

  constructor(
    public elRef: ElementRef,
    protected _renderer: Renderer2,
    protected _injector: Injector,
    protected _listItem: OListItemComponent
  ) { }

  modifyMatListItemElement() {
    if (this.elRef.nativeElement && this.elRef.nativeElement.parentElement) {
      const matListItem = this.elRef.nativeElement.parentElement.parentElement;
      matListItem.querySelector('.mat-list-text').remove();
      matListItem.classList.add('o-card-item');
    }
  }

  onAction1ButtonClick(e?: Event) {
    if (Util.isDefined(e)) {
      e.stopPropagation();
    }
    this.onAction1Click.emit(e);
  }

  onAction2ButtonClick(e?: Event) {
    if (Util.isDefined(e)) {
      e.stopPropagation();
    }
    this.onAction2Click.emit(e);
  }

  compareListHeight(height: string) {
    return (height === this._listItem._list.rowHeight) || undefined;
  }

  get title(): string {
    return this._title;
  }

  set title(val: string) {
    this._title = val;
  }

  get subtitle(): string {
    return this._subtitle;
  }

  set subtitle(val: string) {
    this._subtitle = val;
  }

  get image(): string {
    return this._image;
  }

  set image(val: string) {
    this._image = val;
  }

  get showImage(): boolean {
    return this._showImage;
  }

  set showImage(val: boolean) {
    this._showImage = val;
  }

  get action1Text(): string {
    return this._action1Text;
  }

  set action1Text(val: string) {
    this._action1Text = val;
  }

  get action2Text(): string {
    return this._action2Text;
  }

  set action2Text(val: string) {
    this._action2Text = val;
  }

}
