import { Component, ElementRef, forwardRef, Inject, Injector, ViewEncapsulation } from '@angular/core';

import { OBarMenuComponent } from '../o-bar-menu.component';
import { DEFAULT_INPUTS_O_BASE_MENU_ITEM, OBaseMenuItemClass } from '../o-base-menu-item.class';

export const DEFAULT_INPUTS_O_LOCALE_BAR_MENU_ITEM = [
  ...DEFAULT_INPUTS_O_BASE_MENU_ITEM,
  // locale [string]: language. For example: es
  'locale'
];

@Component({
  selector: 'o-locale-bar-menu-item',
  templateUrl: './o-locale-bar-menu-item.component.html',
  styleUrls: ['./o-locale-bar-menu-item.component.scss'],
  inputs: DEFAULT_INPUTS_O_LOCALE_BAR_MENU_ITEM,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-locale-bar-menu-item]': 'true'
  }
})
export class OLocaleBarMenuItemComponent extends OBaseMenuItemClass {

  locale: string;

  constructor(
    @Inject(forwardRef(() => OBarMenuComponent)) protected menu: OBarMenuComponent,
    protected elRef: ElementRef,
    protected injector: Injector
  ) {
    super(menu, elRef, injector);
  }

  configureI18n() {
    if (this.isConfiguredLang()) {
      return;
    }
    if (this.translateService) {
      this.translateService.use(this.locale);
    }
    if (this.menu) {
      this.menu.collapseAll();
    }
  }

  isConfiguredLang() {
    if (this.translateService) {
      return (this.translateService.getCurrentLang() === this.locale);
    }
    return false;
  }
}
