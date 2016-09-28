import {Component, Injector,
  NgModule,
  ModuleWithProviders,
  ViewEncapsulation} from '@angular/core';
import {MdToolbarModule} from '@angular2-material/toolbar';
import {MdIconModule} from '@angular2-material/icon';
import {AuthGuardService} from '../../services';
import {OTranslateModule} from '../../pipes/o-translate.pipe';


export const DEFAULT_INPUTS_O_BAR_MENU = [
  // title [string]: menu title. Default: no value.
  'title'
];

@Component({
  selector: 'o-bar-menu',
  templateUrl: './bar-menu/o-bar-menu.component.html',
  styleUrls: [
    './bar-menu/o-bar-menu.component.css'
  ],
  inputs: [
    ...DEFAULT_INPUTS_O_BAR_MENU
  ],
  encapsulation: ViewEncapsulation.None
})
export class OBarMenuComponent {

  public static DEFAULT_INPUTS_O_BAR_MENU = DEFAULT_INPUTS_O_BAR_MENU;

  public authGuardService: AuthGuardService;

  protected title: string;
  protected id: string;

  constructor(protected injector: Injector) {
    this.id = 'm_' + String((new Date()).getTime() + Math.random());
    this.authGuardService = this.injector.get(AuthGuardService);
  }

}

@NgModule({
  declarations: [OBarMenuComponent],
  imports: [MdIconModule, MdToolbarModule, OTranslateModule],
  exports: [OBarMenuComponent],
})
export class OBarMenuModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OBarMenuModule,
      providers: []
    };
  }
}
