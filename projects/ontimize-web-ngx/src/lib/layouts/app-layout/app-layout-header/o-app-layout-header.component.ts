import { Component } from '@angular/core';
export const DEFAULT_INPUTS_O_APP_LAYOUT_HEADER = [
  'position'
];
@Component({
  standalone: true,
  imports: [],
  selector: 'o-app-layout-header',
  templateUrl: './o-app-layout-header.component.html',
})
export class OAppLayoutHeaderComponent {
  position: 'start' | 'end' = 'start';
}
