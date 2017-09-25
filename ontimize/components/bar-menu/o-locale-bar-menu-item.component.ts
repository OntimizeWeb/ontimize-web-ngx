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

import { OTranslateService } from '../../services';

import { OBarMenuModule, OBarMenuComponent } from './o-bar-menu.component';
import { OSharedModule } from '../../shared';
import { CommonModule } from '@angular/common';

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
  templateUrl: './o-locale-bar-menu-item.component.html',
  styleUrls: ['./o-locale-bar-menu-item.component.scss'],
  inputs: [
    ...DEFAULT_INPUTS_O_LOCALE_BAR_MENU_ITEM
  ],
  encapsulation: ViewEncapsulation.None
})
export class OLocaleBarMenuItemComponent implements OnInit {

  public static DEFAULT_INPUTS_O_LOCALE_BAR_MENU_ITEM = DEFAULT_INPUTS_O_LOCALE_BAR_MENU_ITEM;

  protected menu: OBarMenuComponent;
  protected translateService: OTranslateService;

  protected _title: string;
  protected _tooltip: string;
  protected _icon: string;
  protected _locale: string;
  protected _isHovered: boolean = false;

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

  get title(): string {
    return this._title;
  }

  set title(val : string) {
    this._title = val;
  }

  get tooltip(): string {
    return this._tooltip;
  }

  set tooltip(val : string) {
    this._tooltip = val;
  }

  get icon(): string {
    return this._icon;
  }

  set icon(val : string) {
    this._icon = val;
  }

  get locale(): string {
    return this._locale;
  }

  set locale(val : string) {
    this._locale = val;
  }

  get isHovered(): boolean {
    return this._isHovered;
  }

  set isHovered(val : boolean) {
    this._isHovered = val;
  }
}

@NgModule({
  declarations: [OLocaleBarMenuItemComponent],
  imports: [OSharedModule, CommonModule, RouterModule, OBarMenuModule],
  exports: [OLocaleBarMenuItemComponent],
})
export class OLocaleBarMenuItemModule {
}
