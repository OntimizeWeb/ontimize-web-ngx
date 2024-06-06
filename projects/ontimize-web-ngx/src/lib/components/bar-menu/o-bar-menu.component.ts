import { Component, ElementRef, Injector, OnInit, ViewEncapsulation } from '@angular/core';

import { AppMenuService } from '../../services/app-menu.service';
import { PermissionsService } from '../../services/permissions/permissions.service';
import { OTranslateService } from '../../services/translate/o-translate.service';
import { MenuRootItem } from '../../types/menu-root-item.type';
import { Util } from '../../util/util';
import { Subscription } from 'rxjs';

export const DEFAULT_INPUTS_O_BAR_MENU = [
  // title [string]: menu title. Default: no value.
  'menuTitle: title',
  // tooltip [string]: menu tooltip. Default: 'title' value.
  'tooltip',
];

@Component({
  selector: 'o-bar-menu',
  templateUrl: './o-bar-menu.component.html',
  styleUrls: ['./o-bar-menu.component.scss'],
  inputs: DEFAULT_INPUTS_O_BAR_MENU,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-bar-menu]': 'true'
  }
})
export class OBarMenuComponent implements OnInit {

  protected permissionsService: PermissionsService;
  protected translateService: OTranslateService;
  private appMenuService: AppMenuService;
  private menuRoots: MenuRootItem[];

  protected _menuTitle: string;
  protected _tooltip: string;
  protected _id: string;
  protected subscription: Subscription = new Subscription();

  constructor(
    protected elRef: ElementRef,
    protected injector: Injector) {
    this.id = 'm_' + String((new Date()).getTime() + Util.randomNumber().toString());
    this.permissionsService = this.injector.get(PermissionsService);
    this.translateService = this.injector.get(OTranslateService);
    this.appMenuService = this.injector.get(AppMenuService);
    this.subscription.add(this.appMenuService.onPermissionMenuChanged.subscribe(() => this.refreshMenuRoots()));
    this.menuRoots = this.appMenuService.getMenuRoots();
  }


  public ngOnInit() {
    if (!this.tooltip) {
      this.tooltip = this.menuTitle;
    }
    if (this.translateService) {
      this.translateService.onLanguageChanged.subscribe(() => {
        this.setDOMTitle();
      });
      this.setDOMTitle();
    }
  }

  setDOMTitle() {
    const tooltip = this.translateService.get(this.tooltip);
    this.elRef.nativeElement.setAttribute('title', tooltip);
  }

  collapseAll() {
    const inputs = this.elRef.nativeElement.querySelectorAll('input');
    if (inputs) {
      inputs.forEach(element => {
        element.checked = false;
      });
    }
    const fakeLis = this.elRef.nativeElement.querySelectorAll('.fake-li-hover');
    if (fakeLis) {
      fakeLis.forEach(element => {
        element.classList.remove('fake-li-hover');
      });
    }
  }

  getPermissionsService(): PermissionsService {
    return this.permissionsService;
  }

  get menuTitle(): string {
    return this._menuTitle;
  }

  set menuTitle(val: string) {
    this._menuTitle = val;
  }

  get tooltip(): string {
    return this._tooltip;
  }

  set tooltip(val: string) {
    this._tooltip = val;
  }

  get id(): string {
    return this._id;
  }

  set id(val: string) {
    this._id = val;
  }

  get menuItems(): MenuRootItem[] {
    return this.menuRoots;
  }

  refreshMenuRoots(): void {
    this.menuRoots= [...this.appMenuService.getMenuRoots()];
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();

  }
}

