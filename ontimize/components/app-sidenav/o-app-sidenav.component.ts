import {
  Injector,
  NgModule,
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild
} from '@angular/core';

import { MdSidenav } from '@angular/material';
import { RouterModule, Router } from '@angular/router';
import { OSharedModule } from '../../shared';
import { CommonModule } from '@angular/common';
import {
  DialogService,
  OTranslateService,
  AppMenuService,
  MenuGroup,
  MenuItemLogout,
  MenuItemAction,
  // MenuItem,
  // MenuItemRoute,
  MenuItemLocale,
  LoginService
} from '../../services';

const SMALL_WIDTH_BREAKPOINT = 840;

export const DEFAULT_INPUTS_O_APP_SIDENAV = [];
export const DEFAULT_OUTPUTS_O_APP_SIDENAV = [];

@Component({
  selector: 'o-app-sidenav',
  inputs: DEFAULT_INPUTS_O_APP_SIDENAV,
  outputs: DEFAULT_OUTPUTS_O_APP_SIDENAV,
  template: require('./o-app-sidenav.component.html'),
  styles: [require('./o-app-sidenav.component.scss')],
  encapsulation: ViewEncapsulation.None,
})
export class OAppSidenavComponent implements OnInit {

  public static DEFAULT_INPUTS_O_APP_LAYOUT = DEFAULT_INPUTS_O_APP_SIDENAV;
  public static DEFAULT_OUTPUTS_O_APP_LAYOUT = DEFAULT_OUTPUTS_O_APP_SIDENAV;

  @ViewChild(MdSidenav) sidenav: MdSidenav;

  protected dialogService: DialogService;
  protected translateService: OTranslateService;
  protected appMenuService: AppMenuService;
  protected loginService: LoginService;

  protected menuGroupArray: MenuGroup[];

  protected imageSrc: string;

  constructor(
    protected injector: Injector,
    private router: Router
  ) {
    this.dialogService = this.injector.get(DialogService);
    this.translateService = this.injector.get(OTranslateService);
    this.loginService = this.injector.get(LoginService);
    this.appMenuService = this.injector.get(AppMenuService);
    this.menuGroupArray = this.appMenuService.getMenuGroups();
  }

  ngOnInit() {
    this.router.events.subscribe(() => {
      if (this.isScreenSmall()) {
        this.sidenav.close();
      }
    });
  }

  isScreenSmall(): boolean {
    return window.matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`).matches;
  }

  configureI18n(item: MenuItemLocale) {
    if (this.isConfiguredLang(item)) {
      return;
    }
    if (this.translateService) {
      this.translateService.use(item.locale);
    }
    // if (this.menu) {
    //   this.menu.collapseAll();
    // }
  }

  isConfiguredLang(item: MenuItemLocale) {
    if (this.translateService) {
      return (this.translateService.getCurrentLang() === item.locale);
    }
    return false;
  }

  onMenuItemActionClick(item: MenuItemAction) {
    if (item.confirm !== undefined) {
      this.dialogService.confirm('CONFIRM', item.confirm).then(
        res => {
          if (res === true) {
            item.action();
          }
        }
      );
    } else {
      item.action();
    }
  }

  onLogoutClick() {
    this.loginService.logoutWithConfirmationAndRedirect();
  }


}

@NgModule({
  imports: [
    CommonModule,
    OSharedModule,
    RouterModule
  ],
  declarations: [
    OAppSidenavComponent
  ],
  exports: [OAppSidenavComponent]
})
export class OAppSidenavModule { }
