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
  protected title: string;
  protected subtitle: string;
  protected image: string;
  protected action1Text: string;
  protected action2Text: string;

  onAction1Click: EventEmitter<Object> = new EventEmitter<Object>();
  onAction2Click: EventEmitter<Object> = new EventEmitter<Object>();
  /* end of inputs variables */

  constructor(
    public elRef: ElementRef,
    protected _renderer: Renderer,
    protected _injector: Injector,
    protected _listItem: OListItemComponent
  ) {
    this.elRef.nativeElement.setAttribute('flex', '');
    this.elRef.nativeElement.setAttribute('layout-padding', '');
    this.elRef.nativeElement.setAttribute('layout', 'row');
    this.elRef.nativeElement.setAttribute('layout-align', 'center center');
    this.elRef.nativeElement.classList.add('o-custom-list-item');
  }


  modifyMdListItemElement() {
    if (this.elRef.nativeElement && this.elRef.nativeElement.parentElement) {
      let mdListItem = this.elRef.nativeElement.parentElement.parentElement;
      mdListItem.querySelector('.mat-list-text').remove();
      mdListItem.classList.add('o-card-item');
    }
  }

  // initialize() {
  // }

  // destroy() {
  // }

  onAction1ButtonClick(event: any) {
    this.onAction1Click.emit(event);
  }

  onAction2ButtonClick(event: any) {
    this.onAction2Click.emit(event);
  }

  compareListHeight(height: string) {
    return (height === this._listItem._list.rowHeight) || undefined;
  }
}
