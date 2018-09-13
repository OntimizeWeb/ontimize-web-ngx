import { Component, Injector, NgModule, ElementRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuardService } from '../../services';
import { OTranslateService } from '../../services';
import { OSharedModule } from '../../shared';
import { InputConverter } from '../../decorators/input-converter';
import { AppMenuService, MenuRootItem } from '../../services/app-menu.service';
import { OBarMenuItemModule } from './o-bar-menu-item.component';
import { OBarMenuGroupModule } from './o-bar-menu-group.component';
import { OBarMenumNestedComponent } from './o-bar-menu-nested.component';


export const DEFAULT_INPUTS_O_BAR_MENU = [
  // title [string]: menu title. Default: no value.
  'menuTitle: title',

  // tooltip [string]: menu tooltip. Default: 'title' value.
  'tooltip',
  // auto-menu [boolean]: If the component automatically creates or not a panel page based on the application menu configuration. Default: no.
  'autoMenu:auto-menu'
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
export class OBarMenuComponent {

  public static DEFAULT_INPUTS_O_BAR_MENU = DEFAULT_INPUTS_O_BAR_MENU;
  @InputConverter()
  autoMenu: boolean = true;
  protected authGuardService: AuthGuardService;
  protected translateService: OTranslateService;
  private appMenuService: AppMenuService;
  private menuRoots: MenuRootItem[];

  protected _menuTitle: string;
  protected _tooltip: string;
  protected _id: string;

  constructor(
    protected elRef: ElementRef,
    protected injector: Injector) {
    this.id = 'm_' + String((new Date()).getTime() + Math.random());
    this.authGuardService = this.injector.get(AuthGuardService);
    this.translateService = this.injector.get(OTranslateService);
    this.appMenuService = this.injector.get(AppMenuService);
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
    let tooltip = this.translateService.get(this.tooltip);
    this.elRef.nativeElement.setAttribute('title', tooltip);
  }

  collapseAll() {
    let inputs = this.elRef.nativeElement.querySelectorAll('input');
    if (inputs) {
      inputs.forEach(element => {
        element.checked = false;
      });
    }

    let fakeLis = this.elRef.nativeElement.querySelectorAll('.fake-li-hover');
    if (fakeLis) {
      fakeLis.forEach(element => {
        element.classList.remove('fake-li-hover');
      });
    }
  }

  getAuthGuardService(): AuthGuardService {
    return this.authGuardService;
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


}

@NgModule({
  declarations: [OBarMenuComponent, OBarMenumNestedComponent],
  imports: [OSharedModule, CommonModule, OBarMenuItemModule, OBarMenuGroupModule, OBarMenuItemModule],
  exports: [OBarMenuComponent]
})
export class OBarMenuModule {
}
