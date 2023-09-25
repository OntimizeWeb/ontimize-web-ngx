import { AfterViewInit, Component, ElementRef, forwardRef, Inject, Injector, OnInit, Optional, Renderer2, ViewEncapsulation } from '@angular/core';

import { OListItemComponent } from '../../list-item/o-list-item.component';
import { OListItemTextRenderer } from '../o-list-item-text-renderer.class';

export const DEFAULT_INPUTS_O_LIST_ITEM_AVATAR = [
  'avatar',
  'emptyAvatar: empty-avatar',
  // avatar-type [base64|url]: avatar type (extern url or base64). Default: no value.
  'avatarType: avatar-type'
];

@Component({
  selector: 'o-list-item-avatar',
  templateUrl: './o-list-item-avatar.component.html',
  styleUrls: ['./o-list-item-avatar.component.scss'],
  inputs: DEFAULT_INPUTS_O_LIST_ITEM_AVATAR,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-custom-list-item]': 'true',
    '[class.o-list-item-avatar]': 'true'
  }
})
export class OListItemAvatarComponent extends OListItemTextRenderer implements AfterViewInit, OnInit {

  public avatarSrc: string;
  protected avatar: string;
  protected avatarType: string;
  protected emptyAvatar: string;

  constructor(
    elRef: ElementRef,
    _renderer: Renderer2,
    _injector: Injector,
    @Optional() @Inject(forwardRef(() => OListItemComponent)) protected _listItem: OListItemComponent
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
    this.avatarSrc = avatarValue;
  }

}
