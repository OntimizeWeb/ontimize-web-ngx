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
import {MdIconModule} from '@angular2-material/icon';

import {OBarMenuModule, OBarMenuComponent} from './o-bar-menu.component';
import {OTranslateModule} from '../../pipes/o-translate.pipe';

export const DEFAULT_INPUTS_O_BAR_MENU_ITEM = [
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
  selector: 'o-bar-menu-item',
  templateUrl: './bar-menu/o-bar-menu-item.component.html',
  styleUrls: [
    './bar-menu/o-bar-menu-item.component.css'
  ],
  inputs: [
    ...DEFAULT_INPUTS_O_BAR_MENU_ITEM
  ],
  encapsulation: ViewEncapsulation.None
})
export class OBarMenuItemComponent implements OnInit {

  public static DEFAULT_INPUTS_O_BAR_MENU_ITEM = DEFAULT_INPUTS_O_BAR_MENU_ITEM;

  protected menu: OBarMenuComponent;

  protected title: string;
  protected icon: string;
  protected route: string;
  protected action: Function;

  protected restricted: boolean;

  constructor(@Inject(forwardRef(() => OBarMenuComponent)) menu: OBarMenuComponent) {
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
  declarations: [OBarMenuItemComponent],
  imports: [CommonModule, MdIconModule, RouterModule, OBarMenuModule, OTranslateModule],
  exports: [OBarMenuItemComponent],
})
export class OBarMenuItemModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OBarMenuItemModule,
      providers: []
    };
  }
}
