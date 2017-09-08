import {
  Component,
  OnInit,
  Inject,
  Injector,
  forwardRef,
  ElementRef,
  NgModule,
  HostListener,
  ViewEncapsulation
} from '@angular/core';
import { RouterModule } from '@angular/router';

import { OBarMenuModule, OBarMenuComponent } from './o-bar-menu.component';
import { OTranslateService } from '../../services';
import { OSharedModule } from '../../shared';
import { CommonModule } from '@angular/common';

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
  templateUrl: './o-bar-menu-item.component.html',
  styleUrls: ['./o-bar-menu-item.component.scss'],
  inputs: [
    ...DEFAULT_INPUTS_O_BAR_MENU_ITEM
  ],
  encapsulation: ViewEncapsulation.None
})
export class OBarMenuItemComponent implements OnInit {

  public static DEFAULT_INPUTS_O_BAR_MENU_ITEM = DEFAULT_INPUTS_O_BAR_MENU_ITEM;

  protected menu: OBarMenuComponent;
  protected translateService: OTranslateService;

  protected _itemTitle: string;
  protected _tooltip: string;
  protected _icon: string;
  protected _route: string;
  protected _action: Function;
  protected _restricted: boolean;
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

  public ngOnInit() {
    if (typeof (this.route) === 'string') {
      this.menu.getAuthGuardService().isRestricted(this.route)
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

  get itemTitle(): string {
    return this._itemTitle;
  }

  set itemTitle(val : string) {
    this._itemTitle = val;
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

  get route(): string {
    return this._route;
  }

  set route(val : string) {
    this._route = val;
  }

  get action(): Function {
    return this._action;
  }

  set action(val : Function) {
    this._action = val;
  }

  get restricted(): boolean {
    return this._restricted;
  }

  set restricted(val : boolean) {
    this._restricted = val;
  }

  get isHovered(): boolean {
    return this._isHovered;
  }

  set isHovered(val : boolean) {
    this._isHovered = val;
  }
}


@NgModule({
  declarations: [OBarMenuItemComponent],
  imports: [OSharedModule, CommonModule, RouterModule, OBarMenuModule],
  exports: [OBarMenuItemComponent],
})
export class OBarMenuItemModule {
}
