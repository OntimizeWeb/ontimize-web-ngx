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

import { CommonModule } from '@angular/common';
import { MdIconModule, MdCardModule } from '@angular/material';

import { OListItemComponent } from '../list-item/o-list-item.component';
import { OListItemCardRenderer } from './o-list-item-card-renderer.class';

export const DEFAULT_INPUTS_O_LIST_ITEM_CARD = [
  ...OListItemCardRenderer.DEFAULT_INPUTS_O_CARD_RENDERER,
  'avatar'
];

export const DEFAULT_OUTPUTS_O_LIST_ITEM_CARD = [
  ...OListItemCardRenderer.DEFAULT_OUTPUTS_O_CARD_RENDERER
];

@Component({
  selector: 'o-list-item-card',
  templateUrl: 'list/renderers/o-list-item-card.component.html',
  styleUrls: ['list/renderers/o-list-item-card.component.css'],
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

  compareListHeight(height: string) {
    return (height === this._listItem._list.rowHeight) || undefined;
  }
}

@NgModule({
  declarations: [OListItemCardComponent],
  imports: [MdIconModule, CommonModule, MdCardModule],
  exports: [OListItemCardComponent]
})
export class OListItemCardModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OListItemCardModule,
      providers: []
    };
  }
}
