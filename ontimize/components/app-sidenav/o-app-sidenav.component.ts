import { Injector, NgModule, Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, EventEmitter, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdSidenav } from '@angular/material';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { OSharedModule } from '../../shared';
import { InputConverter } from '../../decorators';
import { AppMenuService, MenuRootItem, MenuItemUserInfo, MenuGroup, OUserInfoService, UserInfo } from '../../services';
import { OAppSidenavMenuItemModule } from './menu-item/o-app-sidenav-menu-item.component';
import { OAppSidenavMenuGroupModule } from './menu-group/o-app-sidenav-menu-group.component';
import { OAppSidenavImageModule } from './image/o-app-sidenav-image.component';

const SMALL_WIDTH_BREAKPOINT = 840;

export const DEFAULT_INPUTS_O_APP_SIDENAV = [
  'opened',
  'showUserInfo: show-user-info',
  'showToggleButton: show-toggle-button',
  'openedSidenavImg: opened-sidenav-image',
  'closedSidenavImg: closed-sidenav-image'
];

export const DEFAULT_OUTPUTS_O_APP_SIDENAV = [
  'onSidenavToggle',
  'afterSidenavToggle'
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

  @InputConverter()
  protected opened: boolean = true;
  _showUserInfo: boolean = true;
  _showToggleButton: boolean = true;
  openedSidenavImg: string;
  closedSidenavImg: string;

  onSidenavToggle: EventEmitter<boolean> = new EventEmitter<boolean>();
  afterSidenavToggle: EventEmitter<boolean> = new EventEmitter<boolean>();
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
    if (this.showUserInfo && this.showToggleButton) {
      this.userInfo = this.oUserInfoService.getUserInfo();
      this.userInfoSubscription = this.oUserInfoService.getUserInfoObservable().subscribe(res => {
        this.userInfo = res;
        this.refreshMenuRoots();
      });
    }
    this.refreshMenuRoots();
  }

  protected refreshMenuRoots() {
    let menuRootsArray = this.appMenuService.getMenuRoots();
    let firstRoot = menuRootsArray[0];
    let alreadyExistsUserInfo = firstRoot ? firstRoot.id === 'user-info' : false;
    if (this.showUserInfo && this.userInfo && this.showToggleButton && !alreadyExistsUserInfo) {
      let userInfoItem: MenuItemUserInfo = {
        id: this.userInfo.username,
        name: this.userInfo.username,
        user: this.userInfo.username,
        avatar: this.userInfo.avatar
      };
      let menuGroupUserInfo: MenuGroup = {
        id: 'user-info',
        name: 'APP_LAYOUT.USER_PROFILE',
        items: [userInfoItem],
        opened: true,
        icon: 'person_pin'
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

  isSidenavOpened(): boolean {
    return this.opened && !this.isScreenSmall();
  }

  get menuRootArray(): MenuRootItem[] {
    return this._menuRootArray;
  }

  set menuRootArray(val: MenuRootItem[]) {
    this._menuRootArray = val;
  }

  toggleSidenav() {
    const self = this;
    this.sidenav.toggle().then(() => {
      self.afterSidenavToggle.emit(this.sidenav.opened);
    });
    this.opened = this.sidenav.opened;
    this.onSidenavToggle.emit(this.sidenav.opened);
  }

  get showUserInfo(): boolean {
    return this._showUserInfo;
  }

  set showUserInfo(arg: boolean) {
    this._showUserInfo = arg;
  }

  get showToggleButton(): boolean {
    return this._showToggleButton;
  }

  set showToggleButton(arg: boolean) {
    this._showToggleButton = arg;
  }
}

@NgModule({
  imports: [
    CommonModule,
    OSharedModule,
    OAppSidenavMenuItemModule,
    OAppSidenavMenuGroupModule,
    OAppSidenavImageModule,
    RouterModule
  ],
  declarations: [
    OAppSidenavComponent
  ],
  exports: [OAppSidenavComponent]
})
export class OAppSidenavModule { }
