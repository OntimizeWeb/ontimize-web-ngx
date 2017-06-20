import {
  Optional,
  Inject,
  forwardRef,
  NgModule,
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { MdSidenav } from '@angular/material';
import { CommonModule } from '@angular/common';

import { OSharedModule } from '../../shared';
import { OAppSidenavComponent } from './o-app-sidenav.component';

export const DEFAULT_INPUTS_O_APP_SIDENAV_IMAGE = [
  'openedSrc:  opened-src',
  'closedSrc: closed-src'
];

export const DEFAULT_OUTPUTS_O_APP_SIDENAV_IMAGE = [
];

@Component({
  selector: 'o-app-sidenav-image',
  inputs: DEFAULT_INPUTS_O_APP_SIDENAV_IMAGE,
  outputs: DEFAULT_OUTPUTS_O_APP_SIDENAV_IMAGE,
  template: require('./o-app-sidenav-image.component.html'),
  styles: [require('./o-app-sidenav-image.component.scss')],
  encapsulation: ViewEncapsulation.None,
})
export class OAppSidenavImageComponent implements OnInit {

  public static DEFAULT_INPUTS_O_APP_SIDENAV_IMAGE = DEFAULT_INPUTS_O_APP_SIDENAV_IMAGE;
  public static DEFAULT_OUTPUTS_O_APP_SIDENAV_IMAGE = DEFAULT_OUTPUTS_O_APP_SIDENAV_IMAGE;

  protected sidenav: MdSidenav;
  protected openedSrc: string;
  protected closedSrc: string;
  private _src: string;

  constructor(
    @Optional() @Inject(forwardRef(() => OAppSidenavComponent)) protected sidenavComp: OAppSidenavComponent,
  ) {
    this.sidenav = this.sidenavComp ? this.sidenavComp.sidenav : undefined;
    if (this.sidenav) {
      this.sidenav.onOpenStart.subscribe(this.setOpenedImg);
      this.sidenav.onCloseStart.subscribe(this.setClosedImg);
    }
  }

  ngOnInit() {
    if (this.sidenav && this.sidenav.opened) {
      this.setOpenedImg();
    } else if (this.sidenav) {
      this.setClosedImg();
    }
  }

  set src(val: string) {
    this._src = val;
  }

  get src() {
    return this._src;
  }

  setOpenedImg() {
    this.src = this.openedSrc;
  }

  setClosedImg() {
    this.src = this.closedSrc;
  }
}

@NgModule({
  imports: [
    CommonModule,
    OSharedModule
  ],
  declarations: [
    OAppSidenavImageComponent
  ],
  exports: [OAppSidenavImageComponent]
})
export class OAppSidenavImageModule { }
