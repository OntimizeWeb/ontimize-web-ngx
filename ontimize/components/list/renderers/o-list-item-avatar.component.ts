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
  OnInit,
  AfterViewInit
} from '@angular/core';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { OListItemComponent } from '../list-item/o-list-item.component';
import { OListItemTextRenderer } from './o-list-item-text-renderer.class';
import { OSharedModule } from '../../../shared';

export const DEFAULT_INPUTS_O_LIST_ITEM_AVATAR = [
  ...OListItemTextRenderer.DEFAULT_INPUTS_O_TEXT_RENDERER,
  'avatar',

  'emptyAvatar: empty-avatar',

  // avatar-type [base64|url]: avatar type (extern url or base64). Default: no value.
  'avatarType: avatar-type'
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

export class OListItemAvatarComponent extends OListItemTextRenderer implements OnInit, AfterViewInit {

  protected avatar: string;
  protected avatarType: string;
  protected emptyAvatar: string;
  protected avatarSrc: SafeResourceUrl;
  constructor(
    elRef: ElementRef,
    _renderer: Renderer,
    _injector: Injector,
    @Optional() @Inject(forwardRef(() => OListItemComponent)) protected _listItem: OListItemComponent,
    public sanitizer: DomSanitizer
  ) {
    super(elRef, _renderer, _injector, _listItem);
    this.elRef.nativeElement.classList.add('o-list-item-avatar');
  }

  ngAfterViewInit() {
    this.modifyMdListItemElement();
  }

  ngOnInit() {
    let avatarValue: any = this.avatar;
    if (!this.avatar) {
      avatarValue = this.emptyAvatar;
    } else {
      switch (this.avatarType) {
        case 'base64':
          avatarValue = ('data:image/*;base64,' + ((typeof (avatarValue.bytes) !== 'undefined') ? avatarValue.bytes : avatarValue));
          break;
        case 'url':
        default:
          avatarValue = this.avatar;
          break;
      }
    }
    this.avatarSrc = this.sanitizer.bypassSecurityTrustResourceUrl(avatarValue);

  }
}

@NgModule({
  declarations: [OListItemAvatarComponent],
  imports: [
    OSharedModule,
    CommonModule
  ],
  exports: [OListItemAvatarComponent]
})
export class OListItemAvatarModule {

}
