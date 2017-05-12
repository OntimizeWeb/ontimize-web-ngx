import {
  Component, Inject, forwardRef,
  NgModule,
  ModuleWithProviders,
  ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OBarMenuModule, OBarMenuComponent} from './o-bar-menu.component';
import {OTranslateModule} from '../../pipes/o-translate.pipe';

@Component({
  selector: 'o-bar-menu-separator',
  templateUrl: 'o-bar-menu-separator.component.html',
  styleUrls: [
    'o-bar-menu-separator.component.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class OBarMenuSeparatorComponent {

  protected menu: OBarMenuComponent;

  constructor(@Inject(forwardRef(() => OBarMenuComponent)) menu: OBarMenuComponent) {
    this.menu = menu;
  }

}

@NgModule({
  declarations: [OBarMenuSeparatorComponent],
  imports: [CommonModule, OBarMenuModule ],
  exports: [OBarMenuSeparatorComponent],
})
export class OBarMenuSeparatorModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OBarMenuSeparatorModule,
      providers: []
    };
  }
}
