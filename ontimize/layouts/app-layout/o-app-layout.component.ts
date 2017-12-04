import { Component, NgModule, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { OSharedModule } from '../../shared';
import { OAppSidenavModule, OAppHeaderModule, OAppSidenavImageModule, OUserInfoModule } from '../../components';
import { InputConverter } from '../../decorators';

export const DEFAULT_INPUTS_O_APP_LAYOUT = [
  'compact',
  'showHeader: show-header'
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
  //  implements OnInit {

  @InputConverter()
  compact: boolean = true;
  @InputConverter()
  showHeader: boolean = false;

  public static DEFAULT_INPUTS_O_APP_LAYOUT = DEFAULT_INPUTS_O_APP_LAYOUT;
  public static DEFAULT_OUTPUTS_O_APP_LAYOUT = DEFAULT_OUTPUTS_O_APP_LAYOUT;

  // constructor() {
  // }

  // ngOnInit(): void {
  // }

}

@NgModule({
  imports: [
    CommonModule,
    OSharedModule,
    RouterModule,
    OAppSidenavModule,
    OAppSidenavImageModule,
    OAppHeaderModule,
    OUserInfoModule
  ],
  declarations: [
    OAppLayoutComponent
  ],
  exports: [OAppLayoutComponent]
})
export class OAppLayoutModule { }
