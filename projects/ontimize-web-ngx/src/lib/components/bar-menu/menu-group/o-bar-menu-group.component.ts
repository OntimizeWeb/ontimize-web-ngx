import { Component, ElementRef, forwardRef, Inject, Injector, ViewEncapsulation } from '@angular/core';

import { OBarMenuComponent } from '../o-bar-menu.component';
import { DEFAULT_INPUTS_O_BASE_MENU_ITEM, OBaseMenuItemClass } from '../o-base-menu-item.class';

export const DEFAULT_INPUTS_O_BAR_MENU_GROUP = [
  ...DEFAULT_INPUTS_O_BASE_MENU_ITEM
];

@Component({
  selector: 'o-bar-menu-group',
  templateUrl: './o-bar-menu-group.component.html',
  styleUrls: ['./o-bar-menu-group.component.scss'],
  inputs: DEFAULT_INPUTS_O_BAR_MENU_GROUP,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-bar-menu-group]': 'true',
    '[attr.disabled]': 'disabled'
  }
})
export class OBarMenuGroupComponent extends OBaseMenuItemClass {

  id: string;

  constructor(
    @Inject(forwardRef(() => OBarMenuComponent)) protected menu: OBarMenuComponent,
    protected elRef: ElementRef,
    protected injector: Injector
  ) {
    super(menu, elRef, injector);
    var randomArray = new Uint32Array(10);
    window.crypto.getRandomValues(randomArray);
    this.id = 'm_' + String((new Date()).getTime() + randomArray[0].toString());
  }
  
}
