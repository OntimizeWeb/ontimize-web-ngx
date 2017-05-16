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
  ModuleWithProviders
} from '@angular/core';

import {
  MdIconModule,
  MdCardModule,
  MdButtonModule,
  MdListModule
} from '@angular/material';

import { OListItemComponent } from '../list-item/o-list-item.component';
import { OListItemCardRenderer } from './o-list-item-card-renderer.class';
import { OSharedModule } from '../../../shared.module';

export const DEFAULT_INPUTS_O_LIST_ITEM_CARD = [
  ...OListItemCardRenderer.DEFAULT_INPUTS_O_CARD_RENDERER
];

export const DEFAULT_OUTPUTS_O_LIST_ITEM_CARD = [
  ...OListItemCardRenderer.DEFAULT_OUTPUTS_O_CARD_RENDERER
];

@Component({
  selector: 'o-list-item-card',
  template: require('./o-list-item-card.component.html'),
  styles: [require('./o-list-item-card.component.scss')],
  inputs: [
    ...DEFAULT_INPUTS_O_LIST_ITEM_CARD
  ],
  outputs: [
    ...DEFAULT_OUTPUTS_O_LIST_ITEM_CARD
  ],
  encapsulation: ViewEncapsulation.None
})

export class OListItemCardComponent extends OListItemCardRenderer {

  constructor(
    elRef: ElementRef,
    _renderer: Renderer,
    _injector: Injector,
    @Optional() @Inject(forwardRef(() => OListItemComponent)) _listItem: OListItemComponent
  ) {
    super(elRef, _renderer, _injector, _listItem);
    this.elRef.nativeElement.classList.add('o-list-item-card');
  }

  ngAfterViewInit() {
    this.modifyMdListItemElement();
  }
}

@NgModule({
  declarations: [OListItemCardComponent],
  imports: [
    OSharedModule,
    MdIconModule,
    MdCardModule,
    MdButtonModule,
    MdListModule
  ],
  exports: [OListItemCardComponent]
})
export class OListItemCardModule {
}
