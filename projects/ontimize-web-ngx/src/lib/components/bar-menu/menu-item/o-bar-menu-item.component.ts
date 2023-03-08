import { Component, ElementRef, forwardRef, Inject, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { Util } from '../../../util/util';
import { OBarMenuComponent } from '../o-bar-menu.component';
import { OBaseMenuItemClass } from '../o-base-menu-item.class';

export const DEFAULT_INPUTS_O_BAR_MENU_ITEM = [
  // route [string]: name of the state to navigate. Default: no value.
  'route',

  // action [function]: function to execute. Default: no value.
  'action'
];

@Component({
  selector: 'o-bar-menu-item',
  templateUrl: './o-bar-menu-item.component.html',
  styleUrls: ['./o-bar-menu-item.component.scss'],
  inputs: DEFAULT_INPUTS_O_BAR_MENU_ITEM,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-bar-menu-item]': 'true',
    '[attr.disabled]': 'disabled'
  }
})
export class OBarMenuItemComponent extends OBaseMenuItemClass implements OnInit {

  protected router: Router;
  route: string;
  action: () => void;

  constructor(
    @Inject(forwardRef(() => OBarMenuComponent)) protected menu: OBarMenuComponent,
    protected elRef: ElementRef,
    protected injector: Injector
  ) {
    super(menu, elRef, injector);
    this.router = this.injector.get(Router);
  }

  ngOnInit() {
    // if (typeof (this.route) === 'string') {
    //   // TODO, permisos por route?
    // } else {
    //   this.restricted = false;
    // }
    super.ngOnInit();
  }

  collapseMenu(evt: Event) {
    if (this.menu) {
      this.menu.collapseAll();
    }
  }

  onClick() {
    if (this.disabled) {
      return;
    }
    if (Util.isDefined(this.route)) {
      this.router.navigate([this.route]);
    } else if (Util.isDefined(this.action)) {
      this.action();
    }
  }
}
