import {
  Component,
  Inject,
  Injector,
  forwardRef,
  ElementRef,
  OnInit,
  NgModule,
  ModuleWithProviders,
  ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';

import { RouterModule } from '@angular/router';
import { MdIconModule } from '@angular/material';

import {OTranslateService} from '../../services';

import { OSideMenuModule, OSideMenuComponent } from './o-side-menu.component';
import {OTranslateModule} from '../../pipes/o-translate.pipe';

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

@Component({
  selector: 'o-locale-side-menu-item',
  templateUrl: 'o-locale-side-menu-item.component.html',
  styleUrls: [
    'o-locale-side-menu-item.component.scss'
  ],
  inputs: [
    ...DEFAULT_INPUTS_O_LOCALE_SIDE_MENU_ITEM
  ],
  encapsulation: ViewEncapsulation.None
})
export class OLocaleSideMenuItemComponent implements OnInit {

  public static DEFAULT_INPUTS_O_LOCALE_SIDE_MENU_ITEM = DEFAULT_INPUTS_O_LOCALE_SIDE_MENU_ITEM;

  protected menu: OSideMenuComponent;
  protected translateService: OTranslateService;

  protected title: string;
  protected tooltip: string;
  protected icon: string;
  protected locale: string;

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
  imports: [CommonModule, MdIconModule, RouterModule, OSideMenuModule ],
  exports: [OLocaleSideMenuItemComponent],
})
export class OLocaleSideMenuItemModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OLocaleSideMenuItemModule,
      providers: []
    };
  }
}
