import {
  Component,
  Inject,
  forwardRef,
  NgModule,
  ModuleWithProviders,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdIconModule } from '@angular/material';

import { OSideMenuModule, OSideMenuComponent} from './o-side-menu.component';
import {OTranslateModule} from '../../pipes/o-translate.pipe';

export const DEFAULT_INPUTS_O_SIDE_MENU_GROUP = [
  // title [string]: menu group title. Default: no value.
  'title',

  // icon [string]: material icon. Default: no value.
  'icon'
];

@Component({
  selector: 'o-side-menu-group',
  templateUrl: './side-menu/o-side-menu-group.component.html',
  styleUrls: [
    './side-menu/o-side-menu-group.component.css'
  ],
  inputs: [
    ...DEFAULT_INPUTS_O_SIDE_MENU_GROUP
  ],
  encapsulation: ViewEncapsulation.None
})
export class OSideMenuGroupComponent {

  public static DEFAULT_INPUTS_O_SIDE_MENU_GROUP = DEFAULT_INPUTS_O_SIDE_MENU_GROUP;

  protected menu: OSideMenuComponent;

  protected title: string;

  constructor(@Inject(forwardRef(() => OSideMenuComponent)) menu: OSideMenuComponent) {
    this.menu = menu;
  }

}

@NgModule({
  declarations: [OSideMenuGroupComponent],
  imports: [CommonModule, MdIconModule, OSideMenuModule, OTranslateModule],
  exports: [OSideMenuGroupComponent],
})
export class OSideMenuGroupModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OSideMenuGroupModule,
      providers: []
    };
  }
}
