import {
  Component, Injector,
  NgModule,
  ElementRef,
  ViewEncapsulation
} from '@angular/core';
import { MdToolbarModule, MdIconModule } from '@angular/material';
import { AuthGuardService } from '../../services';
import { OTranslateService } from '../../services';
import { OSharedModule } from '../../shared';

export const DEFAULT_INPUTS_O_BAR_MENU = [
  // title [string]: menu title. Default: no value.
  'menuTitle: title',

  // tooltip [string]: menu tooltip. Default: 'title' value.
  'tooltip'
];

@Component({
  selector: 'o-bar-menu',
  template: require('./o-bar-menu.component.html'),
  styles: [require('./o-bar-menu.component.scss')],
  inputs: [
    ...DEFAULT_INPUTS_O_BAR_MENU
  ],
  encapsulation: ViewEncapsulation.None
})
export class OBarMenuComponent {

  public static DEFAULT_INPUTS_O_BAR_MENU = DEFAULT_INPUTS_O_BAR_MENU;

  public authGuardService: AuthGuardService;
  protected translateService: OTranslateService;

  protected menuTitle: string;
  protected tooltip: string;
  protected id: string;

  constructor(
    protected elRef: ElementRef,
    protected injector: Injector) {
    this.id = 'm_' + String((new Date()).getTime() + Math.random());
    this.authGuardService = this.injector.get(AuthGuardService);
    this.translateService = this.injector.get(OTranslateService);
  }

  public ngOnInit() {

    if (!this.tooltip) {
      this.tooltip = this.menuTitle;
    }
    if (this.translateService) {
      this.translateService.onLanguageChanged.subscribe(() => {
        this.setDOMTitle();
      });
      this.setDOMTitle();
    }
  }

  setDOMTitle() {
    let tooltip = this.translateService.get(this.tooltip);
    this.elRef.nativeElement.setAttribute('title', tooltip);
  }

  collapseAll() {
    let inputs = this.elRef.nativeElement.querySelectorAll('input');
    if (inputs) {
      inputs.forEach(element => {
        element.checked = false;
      });
    }

    let fakeLis = this.elRef.nativeElement.querySelectorAll('.fake-li-hover');
    if (fakeLis) {
      fakeLis.forEach(element => {
        element.classList.remove('fake-li-hover');
      });
    }

  }

}

@NgModule({
  declarations: [OBarMenuComponent],
  imports: [OSharedModule, MdIconModule, MdToolbarModule],
  exports: [OBarMenuComponent],
})
export class OBarMenuModule {
}
