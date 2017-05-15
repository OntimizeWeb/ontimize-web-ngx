import {
  Component,
  Inject,
  Injector,
  ElementRef,
  forwardRef,
  OnInit,
  NgModule,
  ModuleWithProviders,
  HostListener,
  ViewEncapsulation
} from '@angular/core';

import { MdIconModule } from '@angular/material';
import { OBarMenuModule, OBarMenuComponent } from './o-bar-menu.component';
import { OTranslateService } from '../../services';
import { OSharedModule } from '../../shared.module';

export const DEFAULT_INPUTS_O_BAR_MENU_GROUP = [
  // title [string]: menu group title. Default: no value.
  'groupTitle: title',

  // tooltip [string]: menu group tooltip. Default: 'title' value.
  'tooltip',

  // icon [string]: material icon. Default: no value.
  'icon'
];

@Component({
  selector: 'o-bar-menu-group',
  template: require('./o-bar-menu-group.component.html'),
  styles: [require('./o-bar-menu-group.component.scss')],
  inputs: [
    ...DEFAULT_INPUTS_O_BAR_MENU_GROUP
  ],
  encapsulation: ViewEncapsulation.None
})
export class OBarMenuGroupComponent implements OnInit {

  public static DEFAULT_INPUTS_O_BAR_MENU_GROUP = DEFAULT_INPUTS_O_BAR_MENU_GROUP;

  protected menu: OBarMenuComponent;
  protected translateService: OTranslateService;

  protected groupTitle: string;
  protected tooltip: string;
  protected id: string;

  isHovered: boolean = false;

  @HostListener('mouseover') onMouseover = () => this.isHovered = true;
  @HostListener('mouseout') onMouseout = () => this.isHovered = false;

  constructor(
    @Inject(forwardRef(() => OBarMenuComponent)) menu: OBarMenuComponent,
    protected elRef: ElementRef,
    protected injector: Injector) {
    this.menu = menu;
    this.id = 'm_' + String((new Date()).getTime() + Math.random());

    this.translateService = this.injector.get(OTranslateService);
  }

  ngOnInit() {
    if (!this.tooltip) {
      this.tooltip = this.groupTitle;
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

}

@NgModule({
  declarations: [OBarMenuGroupComponent],
  imports: [OSharedModule, MdIconModule, OBarMenuModule],
  exports: [OBarMenuGroupComponent],
})
export class OBarMenuGroupModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OBarMenuGroupModule,
      providers: []
    };
  }
}
