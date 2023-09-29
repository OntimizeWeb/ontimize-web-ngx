import { Component, ElementRef, forwardRef, Inject, Injector, ViewEncapsulation } from '@angular/core';

import { Util } from '../../../util/util';
import { OBaseMenuItemClass } from '../o-base-menu-item.class';
import { OBarMenuBase } from '../o-bar-menu-base.class';


@Component({
  selector: 'o-bar-menu-group',
  templateUrl: './o-bar-menu-group.component.html',
  styleUrls: ['./o-bar-menu-group.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-bar-menu-group]': 'true',
    '[attr.disabled]': 'disabled'
  }
})
export class OBarMenuGroupComponent extends OBaseMenuItemClass {

  id: string;

  constructor(
    @Inject(forwardRef(() => OBarMenuBase)) protected menu: OBarMenuBase,
    protected elRef: ElementRef,
    protected injector: Injector
  ) {
    super(menu, elRef, injector);
    this.id = 'm_' + String((new Date()).getTime() + Util.randomNumber().toString());
  }

}
