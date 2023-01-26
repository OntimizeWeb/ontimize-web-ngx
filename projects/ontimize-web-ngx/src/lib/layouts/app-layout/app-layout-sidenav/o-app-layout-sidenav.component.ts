import { Component } from '@angular/core';

export const DEFAULT_INPUTS_O_APP_LAYOUT_SIDENAV = [
  'position'
];

@Component({
  selector: 'o-app-layout-sidenav',
  templateUrl: './o-app-layout-sidenav.component.html',
  inputs: DEFAULT_INPUTS_O_APP_LAYOUT_SIDENAV
})
export class OAppLayoutSidenavComponent {

  position: 'start' | 'end' = 'end';
}
