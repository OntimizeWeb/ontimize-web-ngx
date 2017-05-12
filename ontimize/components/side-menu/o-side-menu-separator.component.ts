import {
  Component, Inject, forwardRef,
  NgModule,
  ModuleWithProviders,
  ViewEncapsulation} from '@angular/core';

import { OSideMenuModule, OSideMenuComponent } from './o-side-menu.component';
import {OTranslateModule} from '../../pipes/o-translate.pipe';

@Component({
  selector: 'o-side-menu-separator',
  templateUrl: 'o-side-menu-separator.component.html',
  styleUrls: [
    'o-side-menu-separator.component.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class OSideMenuSeparatorComponent {

  protected menu: OSideMenuComponent;

  constructor(@Inject(forwardRef(() => OSideMenuComponent)) menu: OSideMenuComponent) {
    this.menu = menu;
  }

}

@NgModule({
  declarations: [OSideMenuSeparatorComponent],
  imports: [OSideMenuModule ],
  exports: [OSideMenuSeparatorComponent],
})
export class OSideMenuSeparatorModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OSideMenuSeparatorModule,
      providers: []
    };
  }
}
