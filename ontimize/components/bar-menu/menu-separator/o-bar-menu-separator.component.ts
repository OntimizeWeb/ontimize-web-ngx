import { Component, ViewEncapsulation, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  moduleId: module.id,
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
@NgModule({
  declarations: [OBarMenuSeparatorComponent],
  imports: [CommonModule],
  exports: [OBarMenuSeparatorComponent]
})
export class OBarMenuSeparatorModule {
}
