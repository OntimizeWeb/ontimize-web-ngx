import {
  Inject,
  Injector,
  forwardRef,
  ElementRef,
  Renderer,
  Optional,
  EventEmitter
} from '@angular/core';

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

  public static DEFAULT_INPUTS_O_TEXT_RENDERER = DEFAULT_INPUTS_O_TEXT_RENDERER;
  public static DEFAULT_OUTPUTS_O_TEXT_RENDERER = DEFAULT_OUTPUTS_O_TEXT_RENDERER;

  /* inputs variables */
  protected title: string;
  protected primaryText: string;
  protected secondaryText: string;
  protected icon: string;

  onIconClick: EventEmitter<Object> = new EventEmitter<Object>();
  /* end of inputs variables */

  private has3Lines: boolean = true;

  constructor(
    public elRef: ElementRef,
    protected _renderer: Renderer,
    protected _injector: Injector,
    @Optional() @Inject(forwardRef(() => OListItemComponent)) protected _listItem: OListItemComponent
  ) {
    this.elRef.nativeElement.setAttribute('flex', '');
    this.elRef.nativeElement.setAttribute('layout', 'row');
    this.elRef.nativeElement.setAttribute('layout-align', 'center center');
    this.elRef.nativeElement.classList.add('o-custom-list-item');
  }

  // initialize() {
  // }

  // destroy() {
  // }

  modifyMdListItemElement() {
    if (this.elRef.nativeElement && this.elRef.nativeElement.parentElement) {
      let mdListItem = this.elRef.nativeElement.parentElement.parentElement;
      if (mdListItem && mdListItem.nodeName === 'MD-LIST-ITEM') {
        let mdLines = 3;
        if (this.title === undefined) {
          mdLines--;
        }
        if (this.primaryText === undefined) {
          mdLines--;
        }
        if (this.secondaryText === undefined) {
          mdLines--;
        }
        this.has3Lines = (mdLines === 3);
        mdListItem.classList.add('mat-' + mdLines + '-line');
        mdListItem.querySelector('.mat-list-text').remove();
      }
    }
  }

  onActionIconClick(event: any) {
    this.onIconClick.emit(event);
  }
}
