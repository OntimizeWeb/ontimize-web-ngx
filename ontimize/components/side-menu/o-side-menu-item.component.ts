import {
  Component,
  OnInit,
  Inject,
  forwardRef,
  NgModule,
  ModuleWithProviders,
  ViewEncapsulation
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import { MdIconModule } from '@angular/material';

import { OSideMenuModule, OSideMenuComponent } from './o-side-menu.component';
import {OTranslateModule} from '../../pipes/o-translate.pipe';

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
  templateUrl: './side-menu/o-side-menu-item.component.html',
  styleUrls: [
    './side-menu/o-side-menu-item.component.css'
  ],
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

  constructor(@Inject(forwardRef(() => OSideMenuComponent)) menu: OSideMenuComponent) {
    this.menu = menu;
  }

  public ngOnInit() {
    if (typeof(this.route) === 'string') {
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
  imports: [CommonModule, MdIconModule, RouterModule, OSideMenuModule, OTranslateModule],
  exports: [OSideMenuItemComponent],
})
export class OSideMenuItemModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OSideMenuItemModule,
      providers: []
    };
  }
}
