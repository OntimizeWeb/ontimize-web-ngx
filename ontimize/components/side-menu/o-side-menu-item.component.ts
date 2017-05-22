import {
  Component,
  OnInit,
  Inject,
  forwardRef,
  NgModule,
  ViewEncapsulation
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { MdIconModule } from '@angular/material';

import { OSideMenuModule, OSideMenuComponent } from './o-side-menu.component';
import { OSharedModule } from '../../shared';

export const DEFAULT_INPUTS_O_SIDE_MENU_ITEM = [
  // title [string]: menu item title. Default: no value.
  'title',

  // icon [string]: material icon. Default: no value.
  'icon',

  // route [string]: name of the state to navigate. Default: no value.
  'route',

  // action [function]: function to execute. Default: no value.
  'action'
];

@Component({
  selector: 'o-side-menu-item',
  template: require('./o-side-menu-item.component.html'),
  styles: [require('./o-side-menu-item.component.scss')],
  inputs: [
    ...DEFAULT_INPUTS_O_SIDE_MENU_ITEM
  ],
  encapsulation: ViewEncapsulation.None
})
export class OSideMenuItemComponent implements OnInit {

  public static DEFAULT_INPUTS_O_SIDE_MENU_ITEM = DEFAULT_INPUTS_O_SIDE_MENU_ITEM;

  protected menu: OSideMenuComponent;

  protected title: string;
  protected icon: string;
  protected route: string;
  protected action: Function;

  protected restricted: boolean;

  constructor( @Inject(forwardRef(() => OSideMenuComponent)) menu: OSideMenuComponent) {
    this.menu = menu;
  }

  public ngOnInit() {
    if (typeof (this.route) === 'string') {
      this.menu.authGuardService.isRestricted(this.route)
        .then(restricted => this.restricted = restricted)
        .catch(err => this.restricted = true);
    } else {
      this.restricted = false;
    }
  }

}


@NgModule({
  declarations: [OSideMenuItemComponent],
  imports: [OSharedModule, MdIconModule, RouterModule, OSideMenuModule],
  exports: [OSideMenuItemComponent],
})
export class OSideMenuItemModule {
}
