import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'o-bar-menu-separator',
  templateUrl: './o-bar-menu-separator.component.html',
  styleUrls: ['./o-bar-menu-separator.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-bar-menu-separator]': 'true'
  }
})
export class OBarMenuSeparatorComponent {
}
