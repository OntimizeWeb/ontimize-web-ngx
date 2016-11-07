import {
  Component,
  OnInit,
  Inject,
  Injector,
  forwardRef,
  ElementRef,
  NgModule,
  ModuleWithProviders,
  HostListener,
  ViewEncapsulation
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import { MdIconModule } from '@angular/material';

import {OBarMenuModule, OBarMenuComponent} from './o-bar-menu.component';
import { OTranslateModule } from '../../pipes/o-translate.pipe';
import { OTranslateService } from '../../services';

export const DEFAULT_INPUTS_O_BAR_MENU_ITEM = [
  // title [string]: menu item title. Default: no value.
  'itemTitle: title',

  // tooltip [string]: menu group tooltip. Default: 'title' value.
  'tooltip',

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
  protected translateService: OTranslateService;

  protected itemTitle: string;
  protected tooltip: string;
  protected icon: string;
  protected route: string;
  protected action: Function;

  protected restricted: boolean;

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

  public ngOnInit() {
    if (typeof(this.route) === 'string') {
      this.menu.authGuardService.isRestricted(this.route)
        .then(restricted => this.restricted = restricted)
        .catch(err => this.restricted = true);
    } else {
      this.restricted = false;
    }

    if (!this.tooltip) {
      this.tooltip = this.itemTitle;
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

  collapseMenu(evt: Event) {
    if (this.menu) {
      this.menu.collapseAll();
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
