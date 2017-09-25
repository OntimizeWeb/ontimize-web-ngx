import {
  Component, Inject, forwardRef,
  NgModule,
  ViewEncapsulation
} from '@angular/core';

import { OSideMenuModule, OSideMenuComponent } from './o-side-menu.component';
import { OSharedModule } from '../../shared';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'o-side-menu-separator',
  templateUrl: './o-side-menu-separator.component.html',
  styleUrls: ['./o-side-menu-separator.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OSideMenuSeparatorComponent {

  protected menu: OSideMenuComponent;

  constructor( @Inject(forwardRef(() => OSideMenuComponent)) menu: OSideMenuComponent) {
    this.menu = menu;
  }

}

@NgModule({
  declarations: [OSideMenuSeparatorComponent],
  imports: [OSharedModule, CommonModule, OSideMenuModule],
  exports: [OSideMenuSeparatorComponent]
})
export class OSideMenuSeparatorModule {
}
