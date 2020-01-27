import { AfterViewInit, Component, ElementRef, forwardRef, Inject, Injector, NgModule, OnInit, Optional, Renderer2, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { OSharedModule } from '../../../shared/shared.module';
import { OListItemComponent } from '../list-item/o-list-item.component';
import { OListItemTextRenderer } from './o-list-item-text-renderer.class';

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
  moduleId: module.id,
  selector: 'o-list-item-avatar',
  templateUrl: './o-list-item-avatar.component.html',
  styleUrls: ['./o-list-item-avatar.component.scss'],
  inputs: DEFAULT_INPUTS_O_LIST_ITEM_AVATAR,
  outputs: DEFAULT_OUTPUTS_O_LIST_ITEM_AVATAR,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-custom-list-item]': 'true',
    '[class.o-list-item-avatar]': 'true'
  }
})
export class OListItemAvatarComponent extends OListItemTextRenderer implements AfterViewInit, OnInit {

  protected avatar: string;
  protected avatarType: string;
  protected emptyAvatar: string;
  protected _avatarSrc: SafeResourceUrl;

  constructor(
    elRef: ElementRef,
    _renderer: Renderer2,
    _injector: Injector,
    @Optional() @Inject(forwardRef(() => OListItemComponent)) protected _listItem: OListItemComponent,
    public sanitizer: DomSanitizer
  ) {
    super(elRef, _renderer, _injector, _listItem);
  }

  ngAfterViewInit() {
    this.modifyMatListItemElement();
  }

  ngOnInit() {
    let avatarValue: any = this.avatar;
    if (!this.avatar) {
      avatarValue = this.emptyAvatar;
    } else {
      switch (this.avatarType) {
        case 'base64':
          avatarValue = ('data:image/png;base64,' + ((typeof (avatarValue.bytes) !== 'undefined') ? avatarValue.bytes : avatarValue));
          break;
        case 'url':
        default:
          avatarValue = this.avatar;
          break;
      }
    }
    this.avatarSrc = this.sanitizer.bypassSecurityTrustResourceUrl(avatarValue);
  }

  get avatarSrc(): SafeResourceUrl {
    return this._avatarSrc;
  }

  set avatarSrc(val: SafeResourceUrl) {
    this._avatarSrc = val;
  }

}

@NgModule({
  declarations: [OListItemAvatarComponent],
  imports: [CommonModule, OSharedModule],
  exports: [OListItemAvatarComponent]
})
export class OListItemAvatarModule { }
