import {
  Component,
  Inject,
  Injector,
  forwardRef,
  ElementRef,
  OnInit,
  NgModule,
  HostListener,
  ViewEncapsulation
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { MdIconModule } from '@angular/material';

import { OTranslateService } from '../../services';

import { OBarMenuModule, OBarMenuComponent } from './o-bar-menu.component';
import { OSharedModule } from '../../shared';

export const DEFAULT_INPUTS_O_LOCALE_BAR_MENU_ITEM = [
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
  selector: 'o-locale-bar-menu-item',
  template: require('./o-locale-bar-menu-item.component.html'),
  styles: [require('./o-locale-bar-menu-item.component.scss')],
  inputs: [
    ...DEFAULT_INPUTS_O_LOCALE_BAR_MENU_ITEM
  ],
  encapsulation: ViewEncapsulation.None
})
export class OLocaleBarMenuItemComponent implements OnInit {

  public static DEFAULT_INPUTS_O_LOCALE_BAR_MENU_ITEM = DEFAULT_INPUTS_O_LOCALE_BAR_MENU_ITEM;

  protected menu: OBarMenuComponent;
  protected translateService: OTranslateService;

  protected title: string;
  protected tooltip: string;
  protected icon: string;
  protected locale: string;

  isHovered: boolean = false;

  @HostListener('mouseover') onMouseover = () => this.isHovered = true;
  @HostListener('mouseout') onMouseout = () => this.isHovered = false;

  constructor(
    @Inject(forwardRef(() => OBarMenuComponent)) menu: OBarMenuComponent,
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
    if (this.menu) {
      this.menu.collapseAll();
    }
  }
}

@NgModule({
  declarations: [OLocaleBarMenuItemComponent],
  imports: [OSharedModule, MdIconModule, RouterModule, OBarMenuModule],
  exports: [OLocaleBarMenuItemComponent],
})
export class OLocaleBarMenuItemModule {
}
