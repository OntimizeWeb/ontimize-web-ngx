import {
  Component, Inject, forwardRef,
  NgModule,
  ViewEncapsulation
} from '@angular/core';
import { OBarMenuModule, OBarMenuComponent } from './o-bar-menu.component';
import { OSharedModule } from '../../shared';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'o-bar-menu-separator',
  templateUrl: './o-bar-menu-separator.component.html',
  styleUrls: ['./o-bar-menu-separator.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OBarMenuSeparatorComponent {

  protected menu: OBarMenuComponent;

  constructor( @Inject(forwardRef(() => OBarMenuComponent)) menu: OBarMenuComponent) {
    this.menu = menu;
  }
}

@NgModule({
  declarations: [OBarMenuSeparatorComponent],
  imports: [OSharedModule, CommonModule, OBarMenuModule],
  exports: [OBarMenuSeparatorComponent],
})
export class OBarMenuSeparatorModule {
}
