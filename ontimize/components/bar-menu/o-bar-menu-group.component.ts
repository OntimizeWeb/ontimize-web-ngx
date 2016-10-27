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
import {CommonModule} from '@angular/common';

import { MdIconModule } from '@angular2-material/icon';

import {OBarMenuModule, OBarMenuComponent} from './o-bar-menu.component';
import { OTranslateModule } from '../../pipes/o-translate.pipe';
import { OTranslateService } from '../../services';

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
  templateUrl: './bar-menu/o-bar-menu-group.component.html',
  styleUrls: [
    './bar-menu/o-bar-menu-group.component.css'
  ],
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
  imports: [CommonModule, MdIconModule, OBarMenuModule, OTranslateModule],
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
