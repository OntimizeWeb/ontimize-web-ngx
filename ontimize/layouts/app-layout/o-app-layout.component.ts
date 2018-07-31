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
  'sidenavOpened: sidenav-opened',
  'showHeader: show-header',
  'showUserInfo: show-user-info',
  'useFlagIcons: use-flag-icons',
  'openedSidenavImg: opened-sidenav-image',
  'closedSidenavImg: closed-sidenav-image'
];

export const DEFAULT_OUTPUTS_O_APP_LAYOUT: any[] = [];

@Component({
  selector: 'o-app-layout',
  inputs: DEFAULT_INPUTS_O_APP_LAYOUT,
  outputs: DEFAULT_OUTPUTS_O_APP_LAYOUT,
  templateUrl: './o-app-layout.component.html',
  styleUrls: ['./o-app-layout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OAppLayoutComponent {

  public static defaultMode: string = 'desktop';
  public static Modes: string[] = ['mobile', 'desktop'];

  @InputConverter()
  sidenavOpened: boolean = true;
  @InputConverter()
  showHeader: boolean = false;
  @InputConverter()
  showUserInfo: boolean = true;
  @InputConverter()
  useFlagIcons: boolean = false;

  get mode(): string {
    return OAppLayoutComponent.Modes[this._mode];
  }
  set mode(val: string) {
    let m = OAppLayoutComponent.Modes.find(e => e === val);
    if (Util.isDefined(m)) {
      this._mode = m;
    } else {
      console.error('Invalid `o-app-layout` mode (' + val + ')');
    }
  }
  protected _mode: string = OAppLayoutComponent.defaultMode;

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
