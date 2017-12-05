import { Injector, NgModule, Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, EventEmitter, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdSidenav } from '@angular/material';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { OSharedModule } from '../../shared';
import { OAppSidenavMenuItemModule } from './menu-item/o-app-sidenav-menu-item.component';
import { OAppSidenavMenuGroupModule } from './menu-group/o-app-sidenav-menu-group.component';
import { AppMenuService, MenuRootItem, MenuItemUserInfo, MenuGroup, OUserInfoService, UserInfo } from '../../services';

const SMALL_WIDTH_BREAKPOINT = 840;

export const DEFAULT_INPUTS_O_APP_SIDENAV = [
  'compact'
];

export const DEFAULT_OUTPUTS_O_APP_SIDENAV = [
  'onSidenavToggle'
];

@Component({
  selector: 'o-app-sidenav',
  inputs: DEFAULT_INPUTS_O_APP_SIDENAV,
  outputs: DEFAULT_OUTPUTS_O_APP_SIDENAV,
  templateUrl: './o-app-sidenav.component.html',
  styleUrls: ['./o-app-sidenav.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-app-sidenav]': 'true'
  }
})
export class OAppSidenavComponent implements OnInit, OnDestroy, AfterViewInit {
  public static DEFAULT_INPUTS_O_APP_LAYOUT = DEFAULT_INPUTS_O_APP_SIDENAV;
  public static DEFAULT_OUTPUTS_O_APP_LAYOUT = DEFAULT_OUTPUTS_O_APP_SIDENAV;

  @ViewChild(MdSidenav) sidenav: MdSidenav;

  protected routerSubscription: Subscription;
  protected appMenuService: AppMenuService;
  protected _menuRootArray: MenuRootItem[];

  _compact: boolean = true;

  protected imageSrc: string;

  onSidenavToggle: EventEmitter<boolean> = new EventEmitter<boolean>();
  protected oUserInfoService: OUserInfoService;
  protected userInfoSubscription: Subscription;
  protected userInfo: UserInfo;

  constructor(
    protected injector: Injector,
    private router: Router,
    protected elRef: ElementRef
  ) {
    this.appMenuService = this.injector.get(AppMenuService);
    this.oUserInfoService = this.injector.get(OUserInfoService);
  }

  ngOnInit() {
    this.routerSubscription = this.router.events.subscribe(() => {
      if (this.isScreenSmall()) {
        this.sidenav.close();
      }
    });
  }

  ngAfterViewInit() {
    let menuRootsArray = this.appMenuService.getMenuRoots();
    if (this.compact) {
      this.userInfo = this.oUserInfoService.getUserInfo();
      this.userInfoSubscription = this.oUserInfoService.getUserInfoObservable().subscribe(res => {
        this.userInfo = res;
      });

      let userInfoItem: MenuItemUserInfo = {
        id: this.userInfo.username,
        name: this.userInfo.username,
        user: this.userInfo.username,
        avatar: this.userInfo.avatar,
      };
      let menuGroupUserInfo: MenuGroup = {
        id: 'user-info',
        name: 'USER_INFO',
        items: [userInfoItem],
        opened: true
      };
      menuRootsArray.unshift(menuGroupUserInfo);
    }
    this.menuRootArray = menuRootsArray;
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.userInfoSubscription) {
      this.userInfoSubscription.unsubscribe();
    }
  }

  isScreenSmall(): boolean {
    return window.matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`).matches;
  }

  get menuRootArray(): MenuRootItem[] {
    return this._menuRootArray;
  }

  set menuRootArray(val: MenuRootItem[]) {
    this._menuRootArray = val;
  }

  toggleSidenav() {
    this.sidenav.toggle();
    this.onSidenavToggle.emit(this.sidenav.opened);
  }

  get compact(): boolean {
    return this._compact;
  }

  set compact(arg: boolean) {
    this._compact = arg;
  }
}

@NgModule({
  imports: [
    CommonModule,
    OSharedModule,
    OAppSidenavMenuItemModule,
    OAppSidenavMenuGroupModule,
    RouterModule
  ],
  declarations: [
    OAppSidenavComponent
  ],
  exports: [OAppSidenavComponent]
})
export class OAppSidenavModule { }
