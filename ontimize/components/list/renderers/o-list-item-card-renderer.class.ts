import {
  Injector,
  ElementRef,
  Renderer,
  EventEmitter
} from '@angular/core';

import { OListItemComponent } from '../list-item/o-list-item.component';

export const DEFAULT_INPUTS_O_CARD_RENDERER = [
  'title',
  'subtitle',
  'image',
  'action1Text : action-1-text',
  'action2Text : action-2-text'
];

export const DEFAULT_OUTPUTS_O_CARD_RENDERER = [
  'onAction1Click : action-1',
  'onAction2Click : action-2'
];

export class OListItemCardRenderer {

  public static DEFAULT_INPUTS_O_CARD_RENDERER = DEFAULT_INPUTS_O_CARD_RENDERER;
  public static DEFAULT_OUTPUTS_O_CARD_RENDERER = DEFAULT_OUTPUTS_O_CARD_RENDERER;

  /* inputs variables */
  protected _title: string;
  protected _subtitle: string;
  protected _image: string;
  protected _action1Text: string;
  protected _action2Text: string;

  onAction1Click: EventEmitter<Object> = new EventEmitter<Object>();
  onAction2Click: EventEmitter<Object> = new EventEmitter<Object>();
  /* end of inputs variables */

  constructor(
    public elRef: ElementRef,
    protected _renderer: Renderer,
    protected _injector: Injector,
    protected _listItem: OListItemComponent
  ) {
  }

  modifyMatListItemElement() {
    if (this.elRef.nativeElement && this.elRef.nativeElement.parentElement) {
      let matListItem = this.elRef.nativeElement.parentElement.parentElement;
      matListItem.querySelector('.mat-list-text').remove();
      matListItem.classList.add('o-card-item');
    }
  }

  onAction1ButtonClick(event: any) {
    this.onAction1Click.emit(event);
  }

  onAction2ButtonClick(event: any) {
    this.onAction2Click.emit(event);
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
