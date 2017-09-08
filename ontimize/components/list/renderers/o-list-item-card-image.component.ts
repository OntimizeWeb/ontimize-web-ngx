import {
  Component,
  Inject,
  Injector,
  forwardRef,
  ViewEncapsulation,
  ElementRef,
  Renderer,
  Optional,
  NgModule,
  EventEmitter
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { InputConverter } from '../../../decorators';
import { OListItemComponent } from '../list-item/o-list-item.component';
import { OListItemCardRenderer } from './o-list-item-card-renderer.class';
import { OSharedModule } from '../../../shared';

export const DEFAULT_INPUTS_O_LIST_ITEM_CARD_IMAGE = [
  ...OListItemCardRenderer.DEFAULT_INPUTS_O_CARD_RENDERER,
  'avatar'
];

export const DEFAULT_OUTPUTS_O_LIST_ITEM_CARD_IMAGE = [
  ...OListItemCardRenderer.DEFAULT_OUTPUTS_O_CARD_RENDERER
];

@Component({
  selector: 'o-list-item-card-image',
  templateUrl: './o-list-item-card-image.component.html',
  styleUrls: ['./o-list-item-card-image.component.scss'],
  inputs: [
    ...DEFAULT_INPUTS_O_LIST_ITEM_CARD_IMAGE,
    'content',
    'avatar',
    'icon',
    'collapsible',
    'collapsed'
  ],
  outputs: [
    ...DEFAULT_OUTPUTS_O_LIST_ITEM_CARD_IMAGE,
    'onIconClick : icon-action'
  ],
  encapsulation: ViewEncapsulation.None,
  host: {
    'layout-padding': '',
    '[class.o-custom-list-item]': 'true',
    '[class.o-list-item-card-image]': 'true'
  }
})

export class OListItemCardImageComponent extends OListItemCardRenderer {

  protected _content: string;
  protected _avatar: string;
  protected _icon: string;
  @InputConverter()
  protected _collapsible: boolean = false;
  @InputConverter()
  protected _collapsed: boolean = true;

  onIconClick: EventEmitter<Object> = new EventEmitter<Object>();

  constructor(
    elRef: ElementRef,
    _renderer: Renderer,
    _injector: Injector,
    @Optional() @Inject(forwardRef(() => OListItemComponent)) _listItem: OListItemComponent
  ) {
    super(elRef, _renderer, _injector, _listItem);
  }

  ngAfterViewInit() {
    this.modifyMdListItemElement();
  }

  onActionIconClick(event: any) {
    this.onIconClick.emit(event);
  }

  get content(): string {
    return this._content;
  }

  set content(val : string) {
    this._content = val;
  }

  get avatar(): string {
    return this._avatar;
  }

  set avatar(val : string) {
    this._avatar = val;
  }

  get icon(): string {
    return this._icon;
  }

  set icon(val : string) {
    this._icon = val;
  }

  get collapsible(): boolean {
    return this._collapsible;
  }

  set collapsible(val : boolean) {
    this._collapsible = val;
  }

  get collapsed(): boolean {
    return this._collapsed;
  }

  set collapsed(val : boolean) {
    this._collapsed = val;
  }
}

@NgModule({
  declarations: [OListItemCardImageComponent],
  imports: [
    OSharedModule,
    CommonModule
  ],
  exports: [OListItemCardImageComponent]
})
export class OListItemCardImageModule {
}
