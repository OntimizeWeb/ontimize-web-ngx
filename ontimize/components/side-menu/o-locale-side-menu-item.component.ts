import { Component, Inject, Injector, forwardRef, ElementRef, OnInit, NgModule, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OTranslateService } from '../../services';
import { OSharedModule } from '../../shared';
import { OSideMenuModule, OSideMenuComponent } from './o-side-menu.component';

export const DEFAULT_INPUTS_O_LOCALE_SIDE_MENU_ITEM = [
  // title [string]: menu item title. Default: no value.
  'title',

  // tooltip [string]: menu group tooltip. Default: 'title' value.
  'tooltip',

  // icon [string]: material icon. Default: no value.
  'icon',

  // locale [string]: language. For example: es
  'locale'
];

/**
 * @deprecated This component will be removed in following versions
 */
@Component({
  selector: 'o-locale-side-menu-item',
  templateUrl: './o-locale-side-menu-item.component.html',
  styleUrls: ['./o-locale-side-menu-item.component.scss'],
  inputs: DEFAULT_INPUTS_O_LOCALE_SIDE_MENU_ITEM,
  encapsulation: ViewEncapsulation.None
})
export class OLocaleSideMenuItemComponent implements OnInit {

  public static DEFAULT_INPUTS_O_LOCALE_SIDE_MENU_ITEM = DEFAULT_INPUTS_O_LOCALE_SIDE_MENU_ITEM;

  protected menu: OSideMenuComponent;
  protected translateService: OTranslateService;

  public title: string;
  public tooltip: string;
  public icon: string;
  public locale: string;

  constructor(
    @Inject(forwardRef(() => OSideMenuComponent)) menu: OSideMenuComponent,
    protected elRef: ElementRef,
    protected injector: Injector) {
    this.menu = menu;
    this.translateService = this.injector.get(OTranslateService);
  }

  ngOnInit() {
    if (!this.tooltip) {
      this.tooltip = this.title;
    }
    if (this.translateService) {
      this.translateService.onLanguageChanged.subscribe(() => {
        this.setDOMTitle();
      });
      this.setDOMTitle();
    }
  }

  setDOMTitle() {
    let tooltip = this.translateService.get(this.tooltip);
    this.elRef.nativeElement.setAttribute('title', tooltip);
  }

  configureI18n() {
    if (this.translateService) {
      this.translateService.use(this.locale);
    }
  }
}

@NgModule({
  declarations: [OLocaleSideMenuItemComponent],
  imports: [OSharedModule, CommonModule, RouterModule, OSideMenuModule],
  exports: [OLocaleSideMenuItemComponent]
})
export class OLocaleSideMenuItemModule {
}
