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
  ModuleWithProviders,
  EventEmitter
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  MdIconModule,
  MdCardModule,
  MdButtonModule,
  MdListModule
} from '@angular/material';

import { InputConverter } from '../../../decorators';
import { OListItemComponent } from '../list-item/o-list-item.component';
import { OListItemCardRenderer } from './o-list-item-card-renderer.class';

export const DEFAULT_INPUTS_O_LIST_ITEM_CARD_IMAGE = [
  ...OListItemCardRenderer.DEFAULT_INPUTS_O_CARD_RENDERER,
  'avatar'
];

export const DEFAULT_OUTPUTS_O_LIST_ITEM_CARD_IMAGE = [
  ...OListItemCardRenderer.DEFAULT_OUTPUTS_O_CARD_RENDERER
];

@Component({
  selector: 'o-list-item-card-image',
  templateUrl: 'o-list-item-card-image.component.html',
  styleUrls: ['o-list-item-card-image.component.scss'],
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

  encapsulation: ViewEncapsulation.None
})

export class OListItemCardImageComponent extends OListItemCardRenderer {

  protected content: string;
  protected avatar: string;
  @InputConverter()
  collapsible: boolean = false;
  @InputConverter()
  collapsed: boolean = true;

  onIconClick: EventEmitter<Object> = new EventEmitter<Object>();

  constructor(
    elRef: ElementRef,
    _renderer: Renderer,
    _injector: Injector,
    @Optional() @Inject(forwardRef(() => OListItemComponent)) _listItem: OListItemComponent
  ) {
    super(elRef, _renderer, _injector, _listItem);
    this.elRef.nativeElement.classList.add('o-list-item-card-image');
  }

  ngAfterViewInit() {
    this.modifyMdListItemElement();
  }

  onActionIconClick(event: any) {
    this.onIconClick.emit(event);
  }
}

@NgModule({
  declarations: [OListItemCardImageComponent],
  imports: [
    MdIconModule,
    CommonModule,
    MdCardModule,
    MdButtonModule,
    MdListModule
  ],
  exports: [OListItemCardImageComponent]
})
export class OListItemCardImageModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OListItemCardImageModule,
      providers: []
    };
  }
}
