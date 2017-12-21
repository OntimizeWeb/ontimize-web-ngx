import { Component, NgModule, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { OSharedModule } from '../../shared';
import { InputConverter } from '../../decorators';
import { OAppHeaderModule } from '../../components/app-header/o-app-header.component';
import { OAppSidenavModule } from '../../components/app-sidenav/o-app-sidenav.component';

export const DEFAULT_INPUTS_O_APP_LAYOUT = [
  'sidenavOpened: sidenav-opened',
  'showHeader: show-header',
  'showUserInfo: show-user-info',
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
  @InputConverter()
  sidenavOpened: boolean = true;
  @InputConverter()
  showHeader: boolean = false;
  @InputConverter()
  showUserInfo: boolean = true;

  openedSidenavImg: string;
  closedSidenavImg: string;

  public static DEFAULT_INPUTS_O_APP_LAYOUT = DEFAULT_INPUTS_O_APP_LAYOUT;
  public static DEFAULT_OUTPUTS_O_APP_LAYOUT = DEFAULT_OUTPUTS_O_APP_LAYOUT;
}

@NgModule({
  imports: [
    CommonModule,
    OSharedModule,
    RouterModule,
    OAppSidenavModule,
    OAppHeaderModule
  ],
  declarations: [
    OAppLayoutComponent
  ],
  exports: [OAppLayoutComponent]
})
export class OAppLayoutModule { }
