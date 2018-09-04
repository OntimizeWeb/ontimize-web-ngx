import { Component, ElementRef, forwardRef, Inject, Injector, NgModule, Optional, Renderer2, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OSharedModule } from '../../../shared';
import { OListItemComponent } from '../list-item/o-list-item.component';
import { OListItemCardRenderer } from './o-list-item-card-renderer.class';

export const DEFAULT_INPUTS_O_LIST_ITEM_CARD = [
  ...OListItemCardRenderer.DEFAULT_INPUTS_O_CARD_RENDERER
];

export const DEFAULT_OUTPUTS_O_LIST_ITEM_CARD = [
  ...OListItemCardRenderer.DEFAULT_OUTPUTS_O_CARD_RENDERER
];

@Component({
  selector: 'o-list-item-card',
  templateUrl: './o-list-item-card.component.html',
  styleUrls: ['./o-list-item-card.component.scss'],
  inputs: DEFAULT_INPUTS_O_LIST_ITEM_CARD,
  outputs: DEFAULT_OUTPUTS_O_LIST_ITEM_CARD,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-custom-list-item]': 'true',
    '[class.o-list-item-card]': 'true'
  }
})
export class OListItemCardComponent extends OListItemCardRenderer {

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

}

@NgModule({
  declarations: [OListItemCardComponent],
  imports: [CommonModule, OSharedModule],
  exports: [OListItemCardComponent]
})
export class OListItemCardModule { }
