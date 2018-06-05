import { Injector, NgModule, Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, EventEmitter, AfterViewInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenav } from '@angular/material';
import { RouterModule, Router } from '@angular/router';
import { ObservableMedia, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs/Subscription';

import { OSharedModule } from '../../shared';
import { InputConverter } from '../../decorators';
import { AppMenuService, MenuRootItem, MenuItemUserInfo, MenuGroup, OUserInfoService, UserInfo } from '../../services';
import { OAppSidenavMenuItemModule } from './menu-item/o-app-sidenav-menu-item.component';
import { OAppSidenavMenuGroupModule } from './menu-group/o-app-sidenav-menu-group.component';
import { OAppSidenavImageModule } from './image/o-app-sidenav-image.component';

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
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OAppSidenavComponent implements OnInit, OnDestroy, AfterViewInit {
  public static DEFAULT_INPUTS_O_APP_LAYOUT = DEFAULT_INPUTS_O_APP_SIDENAV;
  public static DEFAULT_OUTPUTS_O_APP_LAYOUT = DEFAULT_OUTPUTS_O_APP_SIDENAV;

  @ViewChild(MatSidenav) sidenav: MatSidenav;

  protected routerSubscription: Subscription;
  appMenuService: AppMenuService;
  protected _menuRootArray: MenuRootItem[] = [];

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

  protected mediaWatch: Subscription;

  constructor(
    protected injector: Injector,
    protected router: Router,
    protected elRef: ElementRef,
    protected cd: ChangeDetectorRef,
    protected media: ObservableMedia
  ) {
    this.appMenuService = this.injector.get(AppMenuService);
    this.menuRootArray = this.appMenuService.getMenuRoots();
    this.oUserInfoService = this.injector.get(OUserInfoService);
    const self = this;
    this.mediaWatch = this.media.subscribe((change: MediaChange) => {
      if (self.isScreenSmall() && self.sidenav) {
        self.sidenav.close();
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (this.isScreenSmall()) {
      this.sidenav.close();
    } else {
      this.sidenav.open();
    }
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
    let firstRoot = this.menuRootArray[0];
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
      this.menuRootArray.unshift(menuGroupUserInfo);
    }
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
    return this.media.isActive('lt-sm');
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
    const promise = this.sidenav.opened ? this.sidenav.close() : this.sidenav.open();
    const self = this;
    promise.then(() => {
      self.afterSidenavToggle.emit(self.sidenav.opened);
    });
    this.cd.detectChanges();
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
  declarations: [OAppSidenavComponent],
  exports: [OAppSidenavComponent]
})
export class OAppSidenavModule { }
