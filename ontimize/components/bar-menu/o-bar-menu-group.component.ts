import {
  Component,
  Inject,
  forwardRef,
  NgModule,
  ModuleWithProviders,
  ViewEncapsulation
} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MdIconModule} from '@angular2-material/icon';

import {OBarMenuModule, OBarMenuComponent} from './o-bar-menu.component';
import {OTranslateModule} from '../../pipes/o-translate.pipe';

export const DEFAULT_INPUTS_O_BAR_MENU_GROUP = [
  // title [string]: menu group title. Default: no value.
  'title',

  // icon [string]: material icon. Default: no value.
  'icon'
];

@Component({
  selector: 'o-bar-menu-group',
  templateUrl: './bar-menu/o-bar-menu-group.component.html',
  styleUrls: [
    './bar-menu/o-bar-menu-group.component.css'
  ],
  inputs: [

    // title [string]: menu group title. Default: no value.
    'title',

    // icon [string]: material icon. Default: no value.
    'icon'

  ],
  encapsulation: ViewEncapsulation.None
})
export class OBarMenuGroupComponent {

  public static DEFAULT_INPUTS_O_BAR_MENU_GROUP = DEFAULT_INPUTS_O_BAR_MENU_GROUP;

  protected menu: OBarMenuComponent;

  protected title: string;
  protected id: string;

  constructor(@Inject(forwardRef(() => OBarMenuComponent)) menu: OBarMenuComponent) {
    this.menu = menu;
    this.id = 'm_' + String((new Date()).getTime() + Math.random());
  }

}

@NgModule({
  declarations: [OBarMenuGroupComponent],
  imports: [CommonModule, MdIconModule, OBarMenuModule, OTranslateModule],
  exports: [OBarMenuGroupComponent],
})
export class OBarMenuGroupModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OBarMenuGroupModule,
      providers: []
    };
  }
}
