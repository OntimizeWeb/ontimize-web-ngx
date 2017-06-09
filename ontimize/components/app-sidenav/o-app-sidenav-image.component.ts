import {
  NgModule,
  Component,
  ViewEncapsulation
} from '@angular/core';

import { OSharedModule } from '../../shared';
import { CommonModule } from '@angular/common';

export const DEFAULT_INPUTS_O_APP_SIDENAV_IMAGE = [
  'src'
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
export class OAppSidenavImageComponent {

  public static DEFAULT_INPUTS_O_APP_SIDENAV_IMAGE = DEFAULT_INPUTS_O_APP_SIDENAV_IMAGE;
  public static DEFAULT_OUTPUTS_O_APP_SIDENAV_IMAGE = DEFAULT_OUTPUTS_O_APP_SIDENAV_IMAGE;

  protected src: string;

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
