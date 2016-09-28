import {
  Component,
  Inject,
  forwardRef,
  NgModule,
  ModuleWithProviders,
  ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RouterModule} from '@angular/router';
import {MdIconModule} from '@angular2-material/icon';

import {OTranslateService} from '../../services';

import {OBarMenuModule, OBarMenuComponent} from './o-bar-menu.component';
import {OTranslateModule} from '../../pipes/o-translate.pipe';

export const DEFAULT_INPUTS_O_LOCALE_BAR_MENU_ITEM = [
  // title [string]: menu item title. Default: no value.
  'title',

  // icon [string]: material icon. Default: no value.
  'icon',

  // locale [string]: language. For example: es
  'locale'
];

@Component({
  selector: 'o-locale-bar-menu-item',
  templateUrl: './bar-menu/o-locale-bar-menu-item.component.html',
  styleUrls: [
    './bar-menu/o-locale-bar-menu-item.component.css'
  ],
  inputs: [
    ...DEFAULT_INPUTS_O_LOCALE_BAR_MENU_ITEM
  ],
  encapsulation: ViewEncapsulation.None
})
export class OLocaleBarMenuItemComponent {

  public static DEFAULT_INPUTS_O_LOCALE_BAR_MENU_ITEM = DEFAULT_INPUTS_O_LOCALE_BAR_MENU_ITEM;

  protected menu: OBarMenuComponent;

  protected title: string;
  protected icon: string;
  protected locale: string;

  constructor( @Inject(forwardRef(() => OBarMenuComponent)) menu: OBarMenuComponent, protected translate: OTranslateService) {
    this.menu = menu;
  }

  configureI18n() {
    if (this.translate) {
      this.translate.use(this.locale);
    }
  }
}

@NgModule({
  declarations: [OLocaleBarMenuItemComponent],
  imports: [CommonModule, MdIconModule, RouterModule, OBarMenuModule, OTranslateModule],
  exports: [OLocaleBarMenuItemComponent],
})
export class OLocaleBarMenuItemModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OLocaleBarMenuItemModule,
      providers: []
    };
  }
}
