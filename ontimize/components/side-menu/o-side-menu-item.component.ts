import { Component, OnInit, Inject, forwardRef, NgModule, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OSharedModule } from '../../shared';
import { OSideMenuModule, OSideMenuComponent } from './o-side-menu.component';

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

/**
 * @deprecated This component will be removed in following versions
 */
@Component({
  moduleId: module.id,
  selector: 'o-side-menu-item',
  templateUrl: './o-side-menu-item.component.html',
  styleUrls: ['./o-side-menu-item.component.scss'],
  inputs: DEFAULT_INPUTS_O_SIDE_MENU_ITEM,
  encapsulation: ViewEncapsulation.None
})
export class OSideMenuItemComponent implements OnInit {

  public static DEFAULT_INPUTS_O_SIDE_MENU_ITEM = DEFAULT_INPUTS_O_SIDE_MENU_ITEM;

  protected menu: OSideMenuComponent;

  protected _title: string;
  protected _icon: string;
  protected _route: string;
  protected _action: Function;

  protected _restricted: boolean;

  constructor( @Inject(forwardRef(() => OSideMenuComponent)) menu: OSideMenuComponent) {
    this.menu = menu;
  }

  public ngOnInit() {
    if (typeof (this.route) === 'string') {
      this.menu.getAuthGuardService().isRestricted(this.route)
        .then(restricted => this.restricted = restricted)
        .catch(err => this.restricted = true);
    } else {
      this.restricted = false;
    }
  }

  get title(): string {
    return this._title;
  }

  set title(val: string) {
    this._title = val;
  }

  get icon(): string {
    return this._icon;
  }

  set icon(val: string) {
    this._icon = val;
  }

  get route(): string {
    return this._route;
  }

  set route(val: string) {
    this._route = val;
  }

  get action(): Function {
    return this._action;
  }

  set action(val: Function) {
    this._action = val;
  }

  get restricted(): boolean {
    return this._restricted;
  }

  set restricted(val: boolean) {
    this._restricted = val;
  }
}


@NgModule({
  declarations: [OSideMenuItemComponent],
  imports: [OSharedModule, CommonModule, RouterModule, OSideMenuModule],
  exports: [OSideMenuItemComponent]
})
export class OSideMenuItemModule {
}
