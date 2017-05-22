import {
  Component, Inject, forwardRef,
  NgModule,
  ViewEncapsulation
} from '@angular/core';
import { OBarMenuModule, OBarMenuComponent } from './o-bar-menu.component';
import { OSharedModule } from '../../shared';


@Component({
  selector: 'o-bar-menu-separator',
  template: require('./o-bar-menu-separator.component.html'),
  styles: [require('./o-bar-menu-separator.component.scss')],
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
  imports: [OSharedModule, OBarMenuModule],
  exports: [OBarMenuSeparatorComponent],
})
export class OBarMenuSeparatorModule {
}
