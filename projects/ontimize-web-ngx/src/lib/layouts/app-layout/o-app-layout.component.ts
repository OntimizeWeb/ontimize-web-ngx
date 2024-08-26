import { AfterViewInit, Component, ContentChild, EventEmitter, ViewChild, ViewEncapsulation, forwardRef } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

import { OUserInfoConfigurationDirective } from '../../components/user-info/user-info-configuration/o-user-info-configuration.directive';
import { BooleanInputConverter } from '../../decorators/input-converter';
import { Codes, OAppLayoutMode, OSidenavMode } from '../../util/codes';
import { Util } from '../../util/util';
import { OAppSidenavBase } from '../../components/app-sidenav/o-app-sidenav-base.class';
import { OAppHeaderBase } from '../../components/app-header/o-app-header-base.class';
import { OAppLayoutBase } from './o-app-layout-base.class';

export const DEFAULT_INPUTS_O_APP_LAYOUT = [
  'mode',
  'sidenavMode: sidenav-mode',
  'sidenavOpened: sidenav-opened',
  '_showHeader: show-header',
  'showUserInfo: show-user-info',
  'showLanguageSelector: show-language-selector',
  'useFlagIcons: use-flag-icons',
  'openedSidenavImg: opened-sidenav-image',
  'closedSidenavImg: closed-sidenav-image',
  'headerColor: header-color',
  'headerHeight: header-height',
  'showTitle: show-title',
  'staticTitle: static-title',
  'showStaticTitle: show-static-title'
];

export const DEFAULT_OUTPUTS_O_APP_LAYOUT: any[] = [
  'beforeOpenSidenav',
  'afterOpenSidenav',
  'beforeCloseSidenav',
  'afterCloseSidenav'
];

@Component({
  selector: 'o-app-layout',
  inputs: DEFAULT_INPUTS_O_APP_LAYOUT,
  outputs: DEFAULT_OUTPUTS_O_APP_LAYOUT,
  templateUrl: './o-app-layout.component.html',
  styleUrls: ['./o-app-layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: OAppLayoutBase, useExisting: forwardRef(() => OAppLayoutComponent) }
  ]
})

export class OAppLayoutComponent implements AfterViewInit {

  @BooleanInputConverter()
  sidenavOpened: boolean = true;
  @BooleanInputConverter()
  showUserInfo: boolean = true;
  @BooleanInputConverter()
  showLanguageSelector: boolean = true;
  @BooleanInputConverter()
  useFlagIcons: boolean = false;
  @BooleanInputConverter()
  protected _showHeader: boolean = true;
  @BooleanInputConverter()
  public showTitle: boolean = false;
  public staticTitle: string;
  @BooleanInputConverter()
  public showStaticTitle: boolean = false;

  public headerColor: ThemePalette;
  public headerHeight = Codes.DEFAULT_ROW_HEIGHT;

  @ViewChild('appSidenav')
  public appSidenav: OAppSidenavBase;

  @ViewChild('appHeader')
  public appHeader: OAppHeaderBase;

  @ContentChild(OUserInfoConfigurationDirective)
  public userInfoConfiguration: OUserInfoConfigurationDirective;

  protected _mode: OAppLayoutMode;
  protected _sidenavMode: OSidenavMode;

  openedSidenavImg: string;
  closedSidenavImg: string;

  beforeOpenSidenav: EventEmitter<boolean> = new EventEmitter<boolean>();
  afterOpenSidenav: EventEmitter<boolean> = new EventEmitter<boolean>();
  beforeCloseSidenav: EventEmitter<boolean> = new EventEmitter<boolean>();
  afterCloseSidenav: EventEmitter<boolean> = new EventEmitter<boolean>();

  get showHeader(): boolean {
    return this._showHeader;
  }

  set showHeader(val: boolean) {
    this._showHeader = val;
  }

  get mode(): OAppLayoutMode {
    return this._mode;
  }

  set mode(val: OAppLayoutMode) {
    const m = Codes.OAppLayoutModes.find(e => e === val);
    if (Util.isDefined(m)) {
      this._mode = m;
      if (this._mode === 'mobile' && !Util.isDefined(this.showHeader)) {
        this.showHeader = true;
      }
    } else {
      console.error('Invalid `o-app-layout` mode (' + val + ')');
    }
  }

  get sidenavMode(): OSidenavMode {
    return this._sidenavMode;
  }

  set sidenavMode(val: OSidenavMode) {
    const m = Codes.OSidenavModes.find(e => e === val);
    if (Util.isDefined(m)) {
      this._sidenavMode = m;
    } else {
      console.error('Invalid `o-app-layout` sidenav-mode (' + val + ')');
    }
  }

  sidenavToggle(opened: boolean) {
    opened ? this.beforeOpenSidenav.emit() : this.beforeCloseSidenav.emit();
  }

  afterToggle(opened: boolean) {
    opened ? this.afterOpenSidenav.emit() : this.afterCloseSidenav.emit();
  }

  ngAfterViewInit(): void {
    if (this.appHeader && this.appHeader.userInfo) {
      this.appHeader.userInfo.registerUserInfoConfiguration(this.userInfoConfiguration);
    }
  }

}
