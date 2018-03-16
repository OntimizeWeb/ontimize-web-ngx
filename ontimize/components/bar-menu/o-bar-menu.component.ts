import { Component, Injector, NgModule, ElementRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  templateUrl: './o-bar-menu.component.html',
  styleUrls: ['./o-bar-menu.component.scss'],
  inputs: [
    ...DEFAULT_INPUTS_O_BAR_MENU
  ],
  encapsulation: ViewEncapsulation.None
})
export class OBarMenuComponent {

  public static DEFAULT_INPUTS_O_BAR_MENU = DEFAULT_INPUTS_O_BAR_MENU;

  protected authGuardService: AuthGuardService;
  protected translateService: OTranslateService;

  protected _menuTitle: string;
  protected _tooltip: string;
  protected _id: string;

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

  getAuthGuardService(): AuthGuardService {
    return this.authGuardService;
  }

  get menuTitle(): string {
    return this._menuTitle;
  }

  set menuTitle(val: string) {
    this._menuTitle = val;
  }

  get tooltip(): string {
    return this._tooltip;
  }

  set tooltip(val: string) {
    this._tooltip = val;
  }

  get id(): string {
    return this._id;
  }

  set id(val: string) {
    this._id = val;
  }
}

@NgModule({
  declarations: [OBarMenuComponent],
  imports: [OSharedModule, CommonModule],
  exports: [OBarMenuComponent]
})
export class OBarMenuModule {
}
