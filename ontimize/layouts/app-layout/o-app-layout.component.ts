import { Component, NgModule, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Util } from '../../util/util';
import { OSharedModule } from '../../shared';
import { InputConverter } from '../../decorators';
import { OAppHeaderModule } from '../../components/app-header/o-app-header.component';
import { OAppSidenavModule } from '../../components/app-sidenav/o-app-sidenav.component';

export const DEFAULT_INPUTS_O_APP_LAYOUT = [
  'mode',
  'sidenavMode: sidenav-mode',
  'sidenavOpened: sidenav-opened',
  '_showHeader: show-header',
  'showUserInfo: show-user-info',
  'showLanguageSelector: show-language-selector',
  'useFlagIcons: use-flag-icons',
  'openedSidenavImg: opened-sidenav-image',
  'closedSidenavImg: closed-sidenav-image'
];

export const DEFAULT_OUTPUTS_O_APP_LAYOUT: any[] = [];

export type OAppLayoutMode = 'mobile' | 'desktop';
export type OSidenavMode = 'over' | 'push' | 'side';

@Component({
  selector: 'o-app-layout',
  inputs: DEFAULT_INPUTS_O_APP_LAYOUT,
  outputs: DEFAULT_OUTPUTS_O_APP_LAYOUT,
  templateUrl: './o-app-layout.component.html',
  styleUrls: ['./o-app-layout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OAppLayoutComponent {

  public static OAppLayoutModes: OAppLayoutMode[] = ['mobile', 'desktop'];
  public static OSidenavModes: OSidenavMode[] = ['over', 'push', 'side'];

  @InputConverter()
  sidenavOpened: boolean = true;
  @InputConverter()
  showUserInfo: boolean = true;
  @InputConverter()
  showLanguageSelector: boolean = true;
  @InputConverter()
  useFlagIcons: boolean = false;

  get showHeader(): boolean {
    return this._showHeader;
  }

  set showHeader(val: boolean) {
    this._showHeader = val;
  }

  @InputConverter()
  protected _showHeader: boolean;

  protected _mode: OAppLayoutMode;

  get mode(): OAppLayoutMode {
    return this._mode;
  }

  set mode(val: OAppLayoutMode) {
    let m = OAppLayoutComponent.OAppLayoutModes.find(e => e === val);
    if (Util.isDefined(m)) {
      this._mode = m;
      if (this._mode === 'mobile' && !Util.isDefined(this.showHeader)) {
        this.showHeader = true;
      }
    } else {
      console.error('Invalid `o-app-layout` mode (' + val + ')');
    }
  }

  protected _sidenavMode: OSidenavMode;

  get sidenavMode(): OSidenavMode {
    return this._sidenavMode;
  }

  set sidenavMode(val: OSidenavMode) {
    let m = OAppLayoutComponent.OSidenavModes.find(e => e === val);
    if (Util.isDefined(m)) {
      this._sidenavMode = m;
    } else {
      console.error('Invalid `o-app-layout` sidenav-mode (' + val + ')');
    }
  }

  openedSidenavImg: string;
  closedSidenavImg: string;

  public static DEFAULT_INPUTS_O_APP_LAYOUT = DEFAULT_INPUTS_O_APP_LAYOUT;
  public static DEFAULT_OUTPUTS_O_APP_LAYOUT = DEFAULT_OUTPUTS_O_APP_LAYOUT;
}

@NgModule({
  imports: [CommonModule, OSharedModule, RouterModule, OAppSidenavModule, OAppHeaderModule],
  declarations: [OAppLayoutComponent],
  exports: [OAppLayoutComponent]
})
export class OAppLayoutModule { }
