import { AfterViewInit, Component, ContentChild, EventEmitter, ViewChild, ViewEncapsulation } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

import { OAppHeaderComponent } from '../../components/app-header/o-app-header.component';
import { OAppSidenavComponent } from '../../components/app-sidenav/o-app-sidenav.component';
import { OUserInfoConfigurationDirective } from '../../components/user-info/user-info-configuration/o-user-info-configuration.directive';
import { InputConverter } from '../../decorators/input-converter';
import { Codes, OAppLayoutMode, OSidenavMode } from '../../util/codes';
import { Util } from '../../util/util';


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
  encapsulation: ViewEncapsulation.None
})

export class OAppLayoutComponent implements AfterViewInit {

  @InputConverter()
  sidenavOpened: boolean = true;
  @InputConverter()
  showUserInfo: boolean = true;
  @InputConverter()
  showLanguageSelector: boolean = true;
  @InputConverter()
  useFlagIcons: boolean = false;
  @InputConverter()
  protected _showHeader: boolean = true;
  @InputConverter()
  public showTitle: boolean = false;
  @InputConverter()
  public staticTitle: string;
  @InputConverter()
  public showStaticTitle: boolean = false;

  public headerColor: ThemePalette;
  public headerHeight = Codes.DEFAULT_ROW_HEIGHT;

  @ViewChild('appSidenav')
  public appSidenav: OAppSidenavComponent;

  @ViewChild('appHeader')
  public appHeader: OAppHeaderComponent;

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
