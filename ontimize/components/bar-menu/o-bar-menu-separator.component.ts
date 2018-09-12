import { Component, ViewEncapsulation, NgModule } from '@angular/core';
import { OSharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { OBarMenuModule } from './o-bar-menu.component';


@Component({
  selector: 'o-bar-menu-separator',
  templateUrl: './o-bar-menu-separator.component.html',
  styleUrls: ['./o-bar-menu-separator.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OBarMenuSeparatorComponent {
  constructor() { }
}
@NgModule({
  declarations: [OBarMenuSeparatorComponent],
  imports: [OSharedModule, CommonModule, OBarMenuModule],
  exports: [OBarMenuSeparatorComponent]
})
export class OBarMenuSeparatorModule {
}
