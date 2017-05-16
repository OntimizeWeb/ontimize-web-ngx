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
  MdListModule
} from '@angular/material';

import { OListItemComponent } from '../list-item/o-list-item.component';
import { OListItemTextRenderer } from './o-list-item-text-renderer.class';
import { OSharedModule } from '../../../shared.module';

export const DEFAULT_INPUTS_O_LIST_ITEM_AVATAR = [
  ...OListItemTextRenderer.DEFAULT_INPUTS_O_TEXT_RENDERER,
  'avatar'
];

export const DEFAULT_OUTPUTS_O_LIST_ITEM_AVATAR = [
  ...OListItemTextRenderer.DEFAULT_OUTPUTS_O_TEXT_RENDERER
];

@Component({
  selector: 'o-list-item-avatar',
  template: require('./o-list-item-avatar.component.html'),
  styles: [require('./o-list-item-avatar.component.scss')],
  inputs: [
    ...DEFAULT_INPUTS_O_LIST_ITEM_AVATAR
  ],
  outputs: [
    ...DEFAULT_OUTPUTS_O_LIST_ITEM_AVATAR
  ],
  encapsulation: ViewEncapsulation.None
})

export class OListItemAvatarComponent extends OListItemTextRenderer {

  protected avatar: string;

  constructor(
    elRef: ElementRef,
    _renderer: Renderer,
    _injector: Injector,
    @Optional() @Inject(forwardRef(() => OListItemComponent)) protected _listItem: OListItemComponent
  ) {
    super(elRef, _renderer, _injector, _listItem);
    this.elRef.nativeElement.classList.add('o-list-item-avatar');
  }

  ngAfterViewInit() {
    this.modifyMdListItemElement();
  }
}

@NgModule({
  declarations: [OListItemAvatarComponent],
  imports: [
    OSharedModule,
    MdIconModule,
    MdListModule
  ],
  exports: [OListItemAvatarComponent]
})
export class OListItemAvatarModule {

}
